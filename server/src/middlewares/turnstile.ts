import { Request, Response, NextFunction } from "express";

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function verifyTurnstile(req: Request, res: Response, next: NextFunction) {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      console.error("TURNSTILE_SECRET_KEY belum di-set");
      return res.status(503).json({ success: false, message: "Layanan verifikasi tidak tersedia" });
    }
    return next();
  }

  const token = req.body?.turnstileToken;
  if (typeof token !== "string" || token.length === 0 || token.length > 2048) {
    return res.status(400).json({
      success: false,
      code: "CAPTCHA_REQUIRED",
      message: "Verifikasi CAPTCHA wajib diselesaikan",
    });
  }

  try {
    const body = new URLSearchParams({ secret, response: token });
    if (req.ip) body.set("remoteip", req.ip);

    const response = await fetch(VERIFY_URL, {
      method: "POST",
      body,
      signal: AbortSignal.timeout(5000),
    });
    const result = (await response.json()) as { success?: boolean };

    if (!result.success) {
      return res.status(400).json({
        success: false,
        code: "CAPTCHA_FAILED",
        message: "Verifikasi CAPTCHA gagal, silakan coba lagi",
      });
    }
    return next();
  } catch (error) {
    console.error("Turnstile verify error:", error);
    return res.status(503).json({ success: false, message: "Layanan verifikasi tidak tersedia" });
  }
}