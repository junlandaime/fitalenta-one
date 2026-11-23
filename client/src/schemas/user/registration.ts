import { z } from "zod";
import {
    AVIONICS_EDUCATION_LEVELS,
    COLOR_BLIND_OPTIONS,
    CURRENT_ACTIVITIES,
    EDUCATION_LEVELS,
    GENDER_VALUES,
    GUARDIAN_RELATIONS,
    MARITAL_STATUSES,
} from "@/constants/registration-constant";
import type { FieldErrors, RegistrationDraft, RegistrationStep } from "@/types/user/registration";

export type FormTemplate = "default" | "avionics";

const required = (label: string) => z.string().trim().min(1, `${label} wajib diisi`);

const requiredFile = (label: string) =>
    z.custom<File>((value) => value instanceof File, `${label} wajib diunggah`);

const optionalFile = z.custom<File | null>((value) => value === null || value instanceof File).optional();

const phone = (label: string) =>
    required(label)
        .transform((value) => value.replace(/[\s\-().]/g, ""))
        .pipe(
            z
                .string()
                .regex(
                    /^(\+62|62|0)8\d{7,12}$/,
                    `${label} harus berupa nomor HP valid (contoh: 081234567890 atau +6281234567890)`,
                ),
        );

const choice = <T extends readonly [string, ...string[]]>(values: T, label: string) =>
    z.enum(values, { error: `${label} wajib dipilih` });

const addressSchema = z.object({
    provinceCode: z.string().min(1, "Provinsi wajib dipilih"),
    provinceName: z.string(),
    cityCode: z.string().min(1, "Kabupaten/Kota wajib dipilih"),
    cityName: z.string(),
    detail: required("Detail alamat").min(10, "Tuliskan alamat selengkap mungkin"),
});

export const programSchema = z.object({
    programId: z
        .number({ error: "Pilih salah satu program untuk melanjutkan" })
        .int()
        .positive("Pilih salah satu program untuk melanjutkan"),
});

export const personalSchema = z.object({
    photo: requiredFile("Foto profil"),
    fullName: required("Nama lengkap").min(3, "Nama lengkap minimal 3 karakter"),
    nik: z.string().regex(/^\d{16}$/, "NIK harus terdiri dari 16 digit angka"),
    gender: choice(GENDER_VALUES, "Jenis kelamin"),
    birthPlace: required("Tempat lahir"),
    birthDate: required("Tanggal lahir").refine(
        (value) => !Number.isNaN(Date.parse(value)) && new Date(value) < new Date(),
        "Tanggal lahir tidak valid",
    ),
    phone: phone("Nomor handphone"),
    lastEducation: choice(EDUCATION_LEVELS, "Pendidikan terakhir"),
    major: required("Jurusan"),
    institution: required("Asal institusi pendidikan"),
    currentActivity: choice(CURRENT_ACTIVITIES, "Pekerjaan/aktivitas"),
    maritalStatus: choice(MARITAL_STATUSES, "Status pernikahan"),
    guardianRelation: choice(GUARDIAN_RELATIONS, "Hubungan dengan orang tua/wali"),
    guardianPhone: phone("Nomor handphone orang tua/wali"),
    ktp: addressSchema,
    domicile: addressSchema,
});

export const avionicsPersonalSchema = z
    .object({
        photo: requiredFile("Foto formal"),
        fullName: required("Nama lengkap").min(3, "Nama lengkap minimal 3 karakter"),
        gender: choice(GENDER_VALUES, "Jenis kelamin"),
        birthDate: required("Tanggal lahir").refine(
            (value) => !Number.isNaN(Date.parse(value)) && new Date(value) < new Date(),
            "Tanggal lahir tidak valid",
        ),
        phone: phone("Nomor WhatsApp aktif"),
        domicileCity: required("Domisili sekarang"),
        lastEducation: choice(AVIONICS_EDUCATION_LEVELS, "Pendidikan"),
        otherEducation: z.string().trim(),
        major: required("Program studi"),
        institution: required("Perguruan tinggi"),
        gpa: required("IPK").refine(
            (value) => {
                const normalized = value.replace(",", ".");
                const num = Number(normalized);
                return /^\d([.,]\d{1,2})?$/.test(value) && num >= 0 && num <= 4;
            },
            "IPK harus berupa angka antara 0.00 sampai 4.00 (contoh: 3.50)",
        ),
        colorBlindStatus: choice(COLOR_BLIND_OPTIONS, "Status kondisi buta warna"),
        ktpFile: requiredFile("KTP"),
        diplomaFile: requiredFile("Ijazah Pendidikan Terakhir"),
        transcriptFile: requiredFile("Transkrip Nilai Akademik"),
        healthCertFile: optionalFile,
        colorBlindCertFile: optionalFile,
        drugFreeCertFile: optionalFile,
        toeicCertFile: optionalFile,
        cvFile: requiredFile("CV (Curriculum Vitae)"),
        supportingDocsFile: optionalFile,
    })
    .superRefine((data, ctx) => {
        if (data.lastEducation === "Lainnya" && !data.otherEducation.trim()) {
            ctx.addIssue({
                code: "custom",
                path: ["otherEducation"],
                message: "Sebutkan pendidikan Anda",
            });
        }
    });

export const consentSchema = z.object({
    agreed: z.literal(true, { error: "Anda harus menyetujui syarat dan ketentuan" }),
});

export const registrationSchema = z.object({
    ...programSchema.shape,
    ...personalSchema.shape,
    ...consentSchema.shape,
});

export const avionicsRegistrationSchema = z.object({
    ...programSchema.shape,
    ...avionicsPersonalSchema.shape,
    ...consentSchema.shape,
});

export type DefaultRegistrationValues = z.infer<typeof registrationSchema>;
export type AvionicsRegistrationValues = z.infer<typeof avionicsRegistrationSchema>;
export type RegistrationValues = DefaultRegistrationValues | AvionicsRegistrationValues;

export function getRegistrationSchema(template: FormTemplate = "default") {
    return template === "avionics" ? avionicsRegistrationSchema : registrationSchema;
}

export function validateStep(
    step: RegistrationStep,
    draft: RegistrationDraft,
    template: FormTemplate = "default",
): FieldErrors {
    const schema =
        step === 1
            ? programSchema
            : step === 2
              ? template === "avionics"
                  ? avionicsPersonalSchema
                  : personalSchema
              : consentSchema;

    const result = schema.safeParse(draft);
    if (result.success) return {};

    const errors: FieldErrors = {};
    for (const issue of result.error.issues) {
        errors[issue.path.join(".")] ??= issue.message;
    }
    return errors;
}
