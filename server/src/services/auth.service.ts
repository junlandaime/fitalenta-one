import prisma from "../config/prisma";
import { comparePassword, hashPassword } from "../utils/password";
import { signToken } from "../utils/jwt";
import { verifyEmailVerificationToken } from "../utils/emailVerification";
import { queueVerificationEmail } from "./authMail.service";

const PRISMA_UNIQUE_VIOLATION = "P2002";

interface RegisterInput {
  email: string;
  password: string;
  name: string;
  phone: string;
}

export async function registerUser(data: RegisterInput): Promise<void> {
  const email = data.email.trim().toLowerCase();
  const hashedPassword = await hashPassword(data.password);

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    if (!existing.emailVerifiedAt) {
      // Jika akun lama belum diverifikasi, perbarui password dan profil ke input pendaftaran terbaru
      const updatedUser = await prisma.user.update({
        where: { id: existing.id },
        data: {
          password: hashedPassword,
          name: data.name.trim(),
          phone: data.phone.trim(),
        },
      });
      queueVerificationEmail(updatedUser);
    }
    return;
  }

  try {
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: data.name.trim(),
        phone: data.phone.trim(),
        role: "user",
      },
    });
    queueVerificationEmail(user);
  } catch (error: any) {
    if (error?.code === PRISMA_UNIQUE_VIOLATION) return;
    throw error;
  }
}

export async function loginUser(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();

  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (!user) {
    console.warn(`[Auth Warning] Login gagal: Email tidak terdaftar (${normalizedEmail})`);
    throw new Error("INVALID_CREDENTIALS");
  }

  const valid = await comparePassword(password, user.password);
  if (!valid) {
    console.warn(`[Auth Warning] Login gagal: Password tidak cocok untuk email (${normalizedEmail})`);
    throw new Error("INVALID_CREDENTIALS");
  }

  if (user.role === "user" && !user.emailVerifiedAt) {
    console.warn(`[Auth Warning] Login ditolak: Email belum diverifikasi (${normalizedEmail})`);
    throw new Error("EMAIL_NOT_VERIFIED");
  }

  const token = signToken({ userId: user.id, email: user.email, role: user.role });
  return { user, token };
}

export async function verifyEmail(token: string): Promise<void> {
  let payload: { userId: number; email: string };
  try {
    payload = verifyEmailVerificationToken(token);
  } catch {
    throw new Error("INVALID_TOKEN");
  }

  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  if (!user || user.email !== payload.email) throw new Error("INVALID_TOKEN");
  if (user.emailVerifiedAt) return;

  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerifiedAt: new Date() },
  });
}

export async function resendVerification(email: string): Promise<void> {
  const user = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });
  if (user && user.role === "user" && !user.emailVerifiedAt) queueVerificationEmail(user);
}
