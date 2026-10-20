import crypto from "crypto";
import jwt from "jsonwebtoken";
import { PASSWORD_RESET_TTL_MINUTES } from "../config/password.config";

const TOKEN_PURPOSE = "password_reset";

interface ResetTokenUser {
  id: number;
  password: string;
}

function deriveSecret(passwordHash: string): string {
  return crypto
    .createHmac("sha256", process.env.JWT_SECRET as string)
    .update(`password-reset-v1:${passwordHash}`)
    .digest("hex");
}

export function signPasswordResetToken(user: ResetTokenUser): string {
  return jwt.sign({ purpose: TOKEN_PURPOSE, userId: user.id }, deriveSecret(user.password), {
    algorithm: "HS256",
    expiresIn: PASSWORD_RESET_TTL_MINUTES * 60,
  });
}

export function readPasswordResetUserId(token: string): number | null {
  const payload = jwt.decode(token);
  if (!payload || typeof payload === "string" || typeof payload.userId !== "number") return null;
  return payload.userId;
}

export function isPasswordResetTokenValid(token: string, user: ResetTokenUser): boolean {
  try {
    const payload = jwt.verify(token, deriveSecret(user.password), { algorithms: ["HS256"] });
    return typeof payload !== "string" && payload.purpose === TOKEN_PURPOSE && payload.userId === user.id;
  } catch {
    return false;
  }
}