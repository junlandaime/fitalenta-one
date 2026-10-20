import { z } from "zod";
import { ADMIN_USER_ROLES } from "@/constants/admin/admin-user-constant";

export const PASSWORD_MIN = 6;
const PASSWORD_MAX = 72;

export const PHONE_PATTERN = /^(\+62|62|0)8\d{7,12}$/;

const normalizePhone = (value: string) => value.replace(/[\s().-]/g, "");

const baseShape = {
    name: z.string().trim().min(3, "Nama minimal 3 karakter").max(255, "Nama maksimal 255 karakter"),
    email: z
        .string()
        .trim()
        .min(1, "Email wajib diisi")
        .email("Masukkan email yang valid")
        .max(255, "Email maksimal 255 karakter"),
    phone: z
        .string()
        .trim()
        .transform(normalizePhone)
        .refine((value) => value === "" || PHONE_PATTERN.test(value), "Nomor telepon tidak valid (contoh: 081234567890)"),
    role: z.enum(ADMIN_USER_ROLES, { error: "Tipe user wajib dipilih" }),
};

export const createUserSchema = z.object({
    ...baseShape,
    password: z
        .string()
        .min(PASSWORD_MIN, `Password minimal ${PASSWORD_MIN} karakter`)
        .max(PASSWORD_MAX, `Password maksimal ${PASSWORD_MAX} karakter`),
});

export const updateUserSchema = z.object(baseShape);

export type UserFormValues = {
    name: string;
    email: string;
    phone: string;
    role: string;
    password: string;
};
