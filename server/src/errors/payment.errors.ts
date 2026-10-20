import { AppError } from "../utils/app-error";

export const PaymentErrors = {
  notFound: () => new AppError("PAYMENT_NOT_FOUND", 404, "Tagihan tidak ditemukan"),
  registrationNotFound: () => new AppError("REGISTRATION_NOT_FOUND", 404, "Data pendaftaran tidak ditemukan"),
  installmentMismatch: () =>
    new AppError("INSTALLMENT_MISMATCH", 400, "Total nominal cicilan harus sama dengan total tagihan", [
      { field: "installmentAmounts", message: "Total nominal cicilan harus sama dengan total tagihan" },
    ]),
  alreadyIssued: () => new AppError("INVOICE_ALREADY_ISSUED", 409, "Tagihan sudah diterbitkan sebelumnya"),
  notIssued: () =>
    new AppError("INVOICE_NOT_ISSUED", 409, "Tagihan belum diterbitkan sehingga belum dapat diverifikasi"),
  alreadySettled: () =>
    new AppError("PAYMENT_ALREADY_SETTLED", 409, "Tagihan sudah lunas atau dibatalkan"),
  noPendingProof: () =>
    new AppError(
      "NO_PENDING_PROOF",
      409,
      "Tidak ada bukti pembayaran baru yang menunggu verifikasi untuk tagihan ini"
    ),
  proofRequired: () =>
    new AppError("PROOF_REQUIRED", 400, "Bukti pembayaran wajib diunggah", [
      { field: "proof", message: "Bukti pembayaran wajib diunggah" },
    ]),
  concurrentUpdate: () =>
    new AppError("PAYMENT_CONFLICT", 409, "Tagihan baru saja diperbarui, silakan muat ulang lalu coba lagi"),
  codeGenerationFailed: () =>
    new AppError("CODE_GENERATION_FAILED", 503, "Gagal membuat nomor dokumen, silakan coba lagi"),
};