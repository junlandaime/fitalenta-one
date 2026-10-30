import prisma from "../config/prisma";
import { PasswordErrors } from "../errors/password.errors";
import { UserErrors } from "../errors/user.errors";
import { ChangePasswordInput, ForgotPasswordInput, ResetPasswordInput } from "../types/password.types";
import { comparePassword, hashPassword } from "../utils/password";
import { isPasswordResetTokenValid, readPasswordResetUserId } from "../utils/passwordResetToken";
import { queuePasswordResetEmail } from "./authMail.service";

export async function changePassword(userId: number, input: ChangePasswordInput): Promise<void> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw UserErrors.notFound();

  if (!(await comparePassword(input.currentPassword, user.password))) {
    throw PasswordErrors.invalidCurrentPassword();
  }
  if (input.currentPassword === input.newPassword) throw PasswordErrors.sameAsCurrent();

  await prisma.user.update({
    where: { id: userId },
    data: { password: await hashPassword(input.newPassword) },
  });
}

export async function requestPasswordReset({ email }: ForgotPasswordInput): Promise<void> {
  const normalized = email.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email: normalized } });
  if (!user) {
    console.warn(`[Password Reset] Permintaan untuk email tidak terdaftar: ${normalized}`);
    return;
  }
  console.log(`[Password Reset] Mengirim email reset password ke: ${user.email} (ID: ${user.id})`);
  queuePasswordResetEmail(user);
}

export async function resetPassword({ token, newPassword }: ResetPasswordInput): Promise<void> {
  const userId = readPasswordResetUserId(token);
  if (userId === null) {
    console.warn("[Password Reset] Gagal: Token reset tidak dapat dibaca userId-nya");
    throw PasswordErrors.invalidResetToken();
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    console.warn(`[Password Reset] Gagal: User dengan ID ${userId} tidak ditemukan`);
    throw PasswordErrors.invalidResetToken();
  }
  if (!isPasswordResetTokenValid(token, user)) {
    console.warn(`[Password Reset] Gagal: Token signature tidak valid untuk user ${user.email}`);
    throw PasswordErrors.invalidResetToken();
  }

  const { count } = await prisma.user.updateMany({
    where: { id: user.id, password: user.password },
    data: {
      password: await hashPassword(newPassword),
      emailVerifiedAt: user.emailVerifiedAt ?? new Date(),
    },
  });
  if (count === 0) {
    console.warn(`[Password Reset] Gagal: Concurrency update count === 0 untuk user ${user.email}`);
    throw PasswordErrors.invalidResetToken();
  }

  console.log(`[Password Reset] Berhasil memperbarui password untuk: ${user.email} (ID: ${user.id})`);
}
