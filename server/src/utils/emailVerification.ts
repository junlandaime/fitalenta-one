import crypto from "crypto";
import jwt from "jsonwebtoken";

const PURPOSE = "email_verify";

function secret(): string {
  return crypto
    .createHmac("sha256", process.env.JWT_SECRET as string)
    .update("email-verification-v1")
    .digest("hex");
}

export function signEmailVerificationToken(userId: number, email: string): string {
  return jwt.sign({ purpose: PURPOSE, userId, email }, secret(), {
    expiresIn: "24h",
    algorithm: "HS256",
  });
}

export function verifyEmailVerificationToken(token: string): { userId: number; email: string } {
  const payload = jwt.verify(token, secret(), { algorithms: ["HS256"] }) as {
    purpose?: string;
    userId?: number;
    email?: string;
  };
  if (payload.purpose !== PURPOSE || typeof payload.userId !== "number" || !payload.email) {
    throw new Error("INVALID_TOKEN");
  }
  return { userId: payload.userId, email: payload.email };
}