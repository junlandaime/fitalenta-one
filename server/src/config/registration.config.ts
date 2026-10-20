export type CodeScope = "year" | "month";

export interface CodeFormat {
  prefix: string;
  scope: CodeScope;
  pad: number;
}

export const REGISTRATION_CODE_FORMAT: CodeFormat = { prefix: "FTL", scope: "year", pad: 4 };
export const INVOICE_CODE_FORMAT: CodeFormat = { prefix: "INV", scope: "month", pad: 5 };

export const REGISTRATION_TIMEZONE_OFFSET_HOURS = 7;
export const MAX_CODE_COLLISION_RETRIES = 3;

export const NIK_PATTERN = /^\d{16}$/;
export const PHONE_PATTERN = /^(\+62|62|0)8\d{7,12}$/;

export type RegistrationFileColumn = "photoPath" | "n4CertificatePath" | "sswCertificatePath";

export interface RegistrationFileConfig {
  field: string;
  column: RegistrationFileColumn;
  label: string;
  required: boolean;
}

export const REGISTRATION_FILES: RegistrationFileConfig[] = [
  { field: "photo", column: "photoPath", label: "Pas foto", required: true },
  { field: "n4Certificate", column: "n4CertificatePath", label: "Sertifikat N4", required: false },
  { field: "sswCertificate", column: "sswCertificatePath", label: "Sertifikat SSW", required: false },
];

export const REGISTRATION_UPLOAD_FOLDER = "registrations";

export const REGISTRATION_ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];

/** Biaya pendaftaran untuk setiap program (Rp 300.000) */
export const REGISTRATION_FEE = {
  amount: 300_000,
  description: (programName: string) => `Biaya pendaftaran program ${programName}`,
  defaultNotes: (programName: string) =>
    `Biaya pendaftaran program ${programName}. Pembayaran ini merupakan biaya pendaftaran awal dan administrasi seleksi peserta.`,
} as const;
