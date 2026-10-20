import { Request, Response } from "express";
import { registerUser, loginUser, verifyEmail, resendVerification } from "../services/auth.service";
import { setAuthCookie, clearAuthCookie } from "../utils/cookie";
import prisma from "../config/prisma";

export async function register(req: Request, res: Response) {
  try {
    const { email, password, confirmPassword, name, phone } = req.body || {};

    if (!name || !email || !phone || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Nama, email, phone, password, dan konfirmasi password wajib diisi",
      });
    }

    if ([name, email, phone, password, confirmPassword].some((v) => typeof v !== "string")) {
      return res.status(400).json({ success: false, message: "Format data tidak valid" });
    }

    if (password.length < 6 || password.length > 128) {
      return res.status(400).json({ success: false, message: "Password harus 6-128 karakter" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Konfirmasi password tidak cocok" });
    }

    await registerUser({ email, password, name, phone });

    return res.status(200).json({
      success: true,
      message: "Jika email tersedia, link verifikasi telah dikirim. Silakan cek inbox Anda.",
    });
  } catch (error: any) {
    console.error("Register error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email dan password wajib diisi" });
    }
    if (typeof email !== "string" || typeof password !== "string" || password.length > 128) {
      return res.status(400).json({ success: false, message: "Format data tidak valid" });
    }

    const { user, token } = await loginUser(email, password);
    setAuthCookie(res, token);

    return res.json({
      success: true,
      message: "Login berhasil",
      data: { user: { id: user.id, email: user.email, name: user.name, role: user.role } },
    });
  } catch (error: any) {
    if (error.message === "INVALID_CREDENTIALS") {
      return res.status(401).json({ success: false, message: "Email atau password salah" });
    }
    if (error.message === "EMAIL_NOT_VERIFIED") {
      return res.status(403).json({
        success: false,
        code: "EMAIL_NOT_VERIFIED",
        message: "Email belum diverifikasi. Silakan cek inbox Anda atau kirim ulang link verifikasi.",
      });
    }
    console.error("Login error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}

export async function verifyEmailToken(req: Request, res: Response) {
  try {
    const { token } = req.body || {};
    if (typeof token !== "string" || !token || token.length > 2048) {
      return res.status(400).json({ success: false, message: "Token tidak valid" });
    }
    await verifyEmail(token);
    return res.json({ success: true, message: "Email berhasil diverifikasi. Silakan login." });
  } catch (error: any) {
    if (error.message === "INVALID_TOKEN") {
      return res.status(400).json({ success: false, message: "Link verifikasi tidak valid atau sudah kedaluwarsa" });
    }
    console.error("Verify email error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}

export async function resendVerificationEmail(req: Request, res: Response) {
  try {
    const { email } = req.body || {};
    if (typeof email === "string" && email) await resendVerification(email);
    return res.json({
      success: true,
      message: "Jika email terdaftar dan belum terverifikasi, link verifikasi telah dikirim.",
    });
  } catch (error) {
    console.error("Resend verification error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}

export async function logout(req: Request, res: Response) {
  clearAuthCookie(res);
  return res.json({ success: true, message: "Logout berhasil" });
}

export async function me(req: Request, res: Response) {
  try {
    const { userId, email, role } = req.user!;
    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    });

    return res.json({
      success: true,
      data: {
        user: {
          userId,
          email,
          role,
          name: dbUser?.name ?? null,
        },
      },
    });
  } catch (error) {
    console.error("Me error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}