import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import type { Request } from "express";

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const MAX_EMAIL_KEY_LENGTH = 254;

function limiter(options: { windowMs: number; limit: number; message: string }) {
  const { message, ...rest } = options;
  return rateLimit({
    ...rest,
    message: { success: false, message },
    standardHeaders: true,
    legacyHeaders: false,
  });
}

function emailKey(req: Request): string {
  const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
  return email ? `email:${email.slice(0, MAX_EMAIL_KEY_LENGTH)}` : ipKeyGenerator(req.ip ?? "");
}

function userKey(req: Request): string {
  return req.user ? `user:${req.user.userId}` : ipKeyGenerator(req.ip ?? "");
}

export const contactRateLimiter = limiter({
  windowMs: 15 * MINUTE,
  limit: 3,
  message: "Terlalu banyak pesan terkirim. Silakan coba lagi dalam beberapa menit.",
});

export const registerRateLimiter = limiter({
  windowMs: HOUR,
  limit: 5,
  message: "Terlalu banyak percobaan registrasi. Silakan coba lagi nanti.",
});

export const loginIpRateLimiter = limiter({
  windowMs: 15 * MINUTE,
  limit: 30,
  message: "Terlalu banyak percobaan login. Silakan coba lagi dalam beberapa menit.",
});

export const loginAccountRateLimiter = rateLimit({
  windowMs: 15 * MINUTE,
  limit: 10,
  skipSuccessfulRequests: true,
  keyGenerator: emailKey,
  message: { success: false, message: "Terlalu banyak percobaan login untuk akun ini. Silakan coba lagi dalam 15 menit." },
  standardHeaders: true,
  legacyHeaders: false,
});

export const emailVerificationRateLimiter = limiter({
  windowMs: HOUR,
  limit: 10,
  message: "Terlalu banyak permintaan. Silakan coba lagi nanti.",
});

export const forgotPasswordIpRateLimiter = limiter({
  windowMs: HOUR,
  limit: 5,
  message: "Terlalu banyak permintaan reset password. Silakan coba lagi nanti.",
});

export const forgotPasswordEmailRateLimiter = rateLimit({
  windowMs: HOUR,
  limit: 3,
  keyGenerator: emailKey,
  message: { success: false, message: "Terlalu banyak permintaan reset password untuk email ini. Silakan coba lagi nanti." },
  standardHeaders: true,
  legacyHeaders: false,
});

export const resetPasswordRateLimiter = limiter({
  windowMs: HOUR,
  limit: 10,
  message: "Terlalu banyak percobaan reset password. Silakan coba lagi nanti.",
});

export const changePasswordRateLimiter = rateLimit({
  windowMs: 15 * MINUTE,
  limit: 5,
  skipSuccessfulRequests: true,
  keyGenerator: userKey,
  message: { success: false, message: "Terlalu banyak percobaan ubah password. Silakan coba lagi dalam 15 menit." },
  standardHeaders: true,
  legacyHeaders: false,
});