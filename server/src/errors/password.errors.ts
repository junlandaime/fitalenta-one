import { AppError } from "../utils/app-error";

export const PasswordErrors = {
  invalidCurrentPassword: () => new AppError("INVALID_CURRENT_PASSWORD", 400, "Password saat ini salah"),
  sameAsCurrent: () =>
    new AppError("PASSWORD_UNCHANGED", 400, "Password baru tidak boleh sama dengan password saat ini"),
  invalidResetToken: () =>
    new AppError("INVALID_RESET_TOKEN", 400, "Link reset password tidak valid atau sudah kedaluwarsa"),
};