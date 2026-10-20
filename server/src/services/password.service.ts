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
  const user = await prisma.user.findUnique({ where: { email } });
  if (user) queuePasswordResetEmail(user);
}

export async function resetPassword({ token, newPassword }: ResetPasswordInput): Promise<void> {
  const userId = readPasswordResetUserId(token);
  if (userId === null) throw PasswordErrors.invalidResetToken();

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !isPasswordResetTokenValid(token, user)) throw PasswordErrors.invalidResetToken();

  const { count } = await prisma.user.updateMany({
    where: { id: user.id, password: user.password },
    data: {
      password: await hashPassword(newPassword),
      emailVerifiedAt: user.emailVerifiedAt ?? new Date(),
    },
  });
  if (count === 0) throw PasswordErrors.invalidResetToken();
}