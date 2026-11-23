import { AppError } from "../utils/app-error";

export const RegistrationErrors = {
  userNotFound: () => new AppError("USER_NOT_FOUND", 404, "Pengguna tidak ditemukan"),
  programNotFound: () =>
    new AppError("PROGRAM_NOT_FOUND", 404, "Program tidak ditemukan atau tidak aktif"),
  programNotActive: () =>
    new AppError("PROGRAM_NOT_ACTIVE", 400, "Program ini sedang tidak membuka pendaftaran"),
  programFull: () => new AppError("PROGRAM_FULL", 409, "Kuota program sudah penuh"),
  deadlinePassed: () =>
    new AppError("REGISTRATION_DEADLINE_PASSED", 400, "Pendaftaran program ini sudah ditutup"),
  alreadyRegistered: () =>
    new AppError("ALREADY_REGISTERED", 409, "Anda sudah terdaftar di program ini"),
  missingFiles: (labels: string[]) =>
    new AppError("MISSING_FILES", 400, `Dokumen wajib diunggah: ${labels.join(", ")}`),
  missingFields: (labels: string[]) =>
    new AppError("VALIDATION_ERROR", 400, `Data wajib diisi: ${labels.join(", ")}`),
  codeGenerationFailed: () =>
    new AppError("CODE_GENERATION_FAILED", 500, "Gagal membuat nomor pendaftaran, silakan coba lagi"),
};