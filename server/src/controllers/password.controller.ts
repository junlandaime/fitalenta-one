import { Request, Response } from "express";
import { matchedData } from "express-validator";
import { ChangePasswordInput, ForgotPasswordInput, ResetPasswordInput } from "../types/password.types";
import * as passwordService from "../services/password.service";

export async function change(req: Request, res: Response) {
  await passwordService.changePassword(req.user!.userId, matchedData<ChangePasswordInput>(req));
  return res.json({ success: true, message: "Password berhasil diubah" });
}

export async function forgot(req: Request, res: Response) {
  await passwordService.requestPasswordReset(matchedData<ForgotPasswordInput>(req));
  return res.json({
    success: true,
    message: "Jika email terdaftar, link reset password telah dikirim. Silakan cek inbox Anda.",
  });
}

export async function reset(req: Request, res: Response) {
  await passwordService.resetPassword(matchedData<ResetPasswordInput>(req));
  return res.json({ success: true, message: "Password berhasil direset. Silakan login dengan password baru." });
}