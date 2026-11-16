import { AppError } from "../utils/app-error";

export const BannerErrors = {
  notFound: () => new AppError("BANNER_NOT_FOUND", 404, "Banner tidak ditemukan"),
  someNotFound: () =>
    new AppError("BANNER_NOT_FOUND", 404, "Sebagian banner yang diurutkan tidak ditemukan"),
  imageRequired: () => new AppError("IMAGE_REQUIRED", 400, "File gambar wajib diunggah (field: image)"),
  invalidSchedule: () =>
    new AppError("INVALID_SCHEDULE", 400, "Waktu berakhir harus setelah waktu mulai"),
};