export const REGISTRATION_STEPS = [
    { id: 1, title: "Program", description: "Pilih jalur" },
    { id: 2, title: "Data diri", description: "Data & berkas" },
    { id: 3, title: "Konfirmasi", description: "Periksa data" },
] as const;

export const STEP_HEADINGS = {
    1: {
        title: "Pilih program yang sesuai",
        description: "Formulir pendaftaran akan menyesuaikan program yang Anda pilih.",
    },
    2: {
        title: "Lengkapi data dan dokumen",
        description: "Informasi ini digunakan sebagai identitas utama selama proses seleksi.",
    },
    3: {
        title: "Periksa sebelum mengirim",
        description: "Pastikan seluruh informasi dan dokumen sudah benar sebelum dikirim.",
    },
} as const;

export const GENDERS = [
    { value: "L", label: "Laki-laki" },
    { value: "P", label: "Perempuan" },
] as const;

export const GENDER_VALUES = ["L", "P"] as const;

export const EDUCATION_LEVELS = [
    "SD",
    "SMP",
    "SMA/SMK",
    "D1",
    "D2",
    "D3",
    "D4",
    "S1",
    "S2",
    "S3",
] as const;

export const AVIONICS_EDUCATION_LEVELS = ["D3", "D4", "S1", "S2", "Lainnya"] as const;

export const COLOR_BLIND_OPTIONS = ["Tidak", "Ya", "Belum mengetahui"] as const;

export const AVIONICS_CV_TEMPLATE_URL =
    "https://drive.google.com/file/d/1Mk6gD6g2mO6ZNVfS8rT5kxwVNcZfldzF/view?usp=sharing";

export const CURRENT_ACTIVITIES = [
    "Pelajar",
    "Mahasiswa",
    "Karyawan",
    "Wiraswasta",
    "Pencari Kerja",
    "Lainnya",
] as const;

export const MARITAL_STATUSES = ["Belum Menikah", "Sudah Menikah", "Cerai"] as const;

export const GUARDIAN_RELATIONS = ["Ayah", "Ibu", "Kakak", "Wali", "Lainnya"] as const;

export const PHOTO_RULES = {
    maxSize: 5 * 1024 * 1024,
    types: ["image/jpeg", "image/png", "image/webp"],
    accept: "image/jpeg,image/png,image/webp",
    label: "JPG, PNG, atau WEBP • Maksimal 5 MB",
} as const;

export const DOCUMENT_RULES = {
    maxSize: 5 * 1024 * 1024,
    types: ["image/jpeg", "image/png", "image/webp", "application/pdf"],
    accept: "application/pdf,image/jpeg,image/png,image/webp",
    label: "PDF, JPG, PNG, atau WEBP • Maksimal 5 MB",
} as const;
