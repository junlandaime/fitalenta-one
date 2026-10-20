import { z } from "zod";
import { PROFILE_LIMITS } from "@/constants/user/user-profile-constant";

export const PROFILE_PHONE_PATTERN = /^\+?\d[\d\s-]{7,18}\d$/;

export const getTodayISO = () => new Date().toISOString().slice(0, 10);

function isValidPastDate(value: string) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(Date.parse(value))) return false;
    return value >= "1900-01-01" && value <= getTodayISO();
}

export const profileSchema = z.object({
    name: z
        .string()
        .trim()
        .min(PROFILE_LIMITS.nameMin, `Nama minimal ${PROFILE_LIMITS.nameMin} karakter`)
        .max(PROFILE_LIMITS.nameMax, `Nama maksimal ${PROFILE_LIMITS.nameMax} karakter`),
    phone: z
        .string()
        .trim()
        .refine((value) => value === "" || PROFILE_PHONE_PATTERN.test(value), "Nomor telepon tidak valid (contoh: 081234567890)"),
    birthPlace: z
        .string()
        .trim()
        .max(PROFILE_LIMITS.birthPlaceMax, `Tempat lahir maksimal ${PROFILE_LIMITS.birthPlaceMax} karakter`),
    birthDate: z.string().refine((value) => value === "" || isValidPastDate(value), "Tanggal lahir tidak valid"),
    address: z
        .string()
        .trim()
        .max(PROFILE_LIMITS.addressMax, `Alamat maksimal ${PROFILE_LIMITS.addressMax} karakter`),
});

export type ProfileFormValues = {
    name: string;
    phone: string;
    birthPlace: string;
    birthDate: string;
    address: string;
};
