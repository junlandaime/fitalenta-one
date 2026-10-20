import { z } from "zod";
import {
    CURRENT_ACTIVITIES,
    EDUCATION_LEVELS,
    GENDER_VALUES,
    GUARDIAN_RELATIONS,
    MARITAL_STATUSES,
} from "@/constants/registration-constant";
import type { FieldErrors, RegistrationDraft, RegistrationStep } from "@/types/user/registration";

const required = (label: string) => z.string().trim().min(1, `${label} wajib diisi`);

const phone = (label: string) =>
    required(label).regex(/^\+?\d[\d\s-]{7,18}\d$/, `${label} tidak valid`);

const choice = <T extends readonly [string, ...string[]]>(values: T, label: string) =>
    z.enum(values, { error: `${label} wajib dipilih` });

const addressSchema = z.object({
    provinceCode: z.string().min(1, "Provinsi wajib dipilih"),
    provinceName: z.string(),
    cityCode: z.string().min(1, "Kabupaten/Kota wajib dipilih"),
    cityName: z.string(),
    detail: required("Detail alamat").min(10, "Tuliskan alamat selengkap mungkin"),
});

export const personalSchema = z.object({
    photo: z.custom<File>((value) => value instanceof File, "Foto profil wajib diunggah"),
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

export const programSchema = z.object({
    programId: z
        .number({ error: "Pilih salah satu program untuk melanjutkan" })
        .int()
        .positive("Pilih salah satu program untuk melanjutkan"),
});

export const consentSchema = z.object({
    agreed: z.literal(true, { error: "Anda harus menyetujui syarat dan ketentuan" }),
});

export const registrationSchema = z.object({
    ...personalSchema.shape,
    ...programSchema.shape,
    ...consentSchema.shape,
});

export type RegistrationValues = z.infer<typeof registrationSchema>;

const STEP_SCHEMAS = {
    1: personalSchema,
    2: programSchema,
    3: consentSchema,
} satisfies Record<RegistrationStep, z.ZodType>;

export function validateStep(step: RegistrationStep, draft: RegistrationDraft): FieldErrors {
    const result = STEP_SCHEMAS[step].safeParse(draft);
    if (result.success) return {};

    const errors: FieldErrors = {};
    for (const issue of result.error.issues) {
        errors[issue.path.join(".")] ??= issue.message;
    }
    return errors;
}
