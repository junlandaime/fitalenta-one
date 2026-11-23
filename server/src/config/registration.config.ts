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

export const FORM_TEMPLATES = ["default", "avionics"] as const;
export type FormTemplate = (typeof FORM_TEMPLATES)[number];

export const COLOR_BLIND_OPTIONS = ["Tidak", "Ya", "Belum mengetahui"] as const;

export type RegistrationFileColumn =
  | "photoPath"
  | "n4CertificatePath"
  | "sswCertificatePath"
  | "ktpPath"
  | "diplomaPath"
  | "transcriptPath"
  | "healthCertPath"
  | "colorBlindCertPath"
  | "drugFreeCertPath"
  | "toeicCertPath"
  | "cvPath"
  | "supportingDocsPath";

export interface RegistrationFileConfig {
  field: string;
  column: RegistrationFileColumn;
  label: string;
  requiredFor: FormTemplate[];
}

export const REGISTRATION_FILES: RegistrationFileConfig[] = [
  { field: "photo", column: "photoPath", label: "Foto formal", requiredFor: ["default", "avionics"] },
  { field: "n4Certificate", column: "n4CertificatePath", label: "Sertifikat N4", requiredFor: [] },
  { field: "sswCertificate", column: "sswCertificatePath", label: "Sertifikat SSW", requiredFor: [] },
  { field: "ktp", column: "ktpPath", label: "KTP", requiredFor: ["avionics"] },
  { field: "diploma", column: "diplomaPath", label: "Ijazah Pendidikan Terakhir", requiredFor: ["avionics"] },
  { field: "transcript", column: "transcriptPath", label: "Transkrip Nilai Akademik", requiredFor: ["avionics"] },
  { field: "healthCert", column: "healthCertPath", label: "Surat Keterangan Sehat", requiredFor: [] },
  { field: "colorBlindCert", column: "colorBlindCertPath", label: "Surat Keterangan Tidak Buta Warna", requiredFor: [] },
  { field: "drugFreeCert", column: "drugFreeCertPath", label: "Surat Keterangan Bebas Narkoba", requiredFor: [] },
  { field: "toeicCert", column: "toeicCertPath", label: "Sertifikat Bahasa Inggris TOEIC", requiredFor: [] },
  { field: "cv", column: "cvPath", label: "CV (Curriculum Vitae)", requiredFor: ["avionics"] },
  { field: "supportingDocs", column: "supportingDocsPath", label: "Sertifikat pendukung lainnya", requiredFor: [] },
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
