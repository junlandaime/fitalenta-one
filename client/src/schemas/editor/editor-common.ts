import { z } from "zod";
import { fromDateInput, fromDateTimeInput } from "@/helpers/editor/editor-content-helper";

const DATETIME_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export const requiredText = (label: string, max: number) =>
    z.string().trim().min(1, `${label} wajib diisi`).max(max, `${label} maksimal ${max} karakter`);

export const optionalText = (label: string, max: number) =>
    z.string().trim().max(max, `${label} maksimal ${max} karakter`);

export const requiredSelectId = (label: string) =>
    z
        .string()
        .trim()
        .min(1, `${label} wajib dipilih`)
        .refine((value) => /^\d+$/.test(value) && Number(value) > 0, `${label} tidak valid`)
        .transform(Number);

export const optionalPositiveInt = (label: string, max: number) =>
    z
        .string()
        .trim()
        .refine(
            (value) => value === "" || (/^\d+$/.test(value) && Number(value) >= 1 && Number(value) <= max),
            `${label} harus berupa angka 1 sampai ${max.toLocaleString("id-ID")}`,
        )
        .transform((value) => (value === "" ? null : Number(value)));

export const requiredInt = (label: string, min: number, max: number) =>
    z
        .string()
        .trim()
        .min(1, `${label} wajib diisi`)
        .refine(
            (value) => /^\d+$/.test(value) && Number(value) >= min && Number(value) <= max,
            `${label} harus berupa angka ${min} sampai ${max.toLocaleString("id-ID")}`,
        )
        .transform(Number);

const validDateTime = (value: string) => DATETIME_PATTERN.test(value) && !Number.isNaN(Date.parse(fromDateTimeInput(value)));
const validDate = (value: string) => DATE_PATTERN.test(value) && !Number.isNaN(Date.parse(fromDateInput(value)));

export const optionalDateTime = (label: string) =>
    z
        .string()
        .trim()
        .refine((value) => value === "" || validDateTime(value), `${label} tidak valid`)
        .transform((value) => (value === "" ? null : fromDateTimeInput(value)));

export const requiredDateTime = (label: string) =>
    z
        .string()
        .trim()
        .min(1, `${label} wajib diisi`)
        .refine(validDateTime, `${label} tidak valid`)
        .transform(fromDateTimeInput);

export const optionalDate = (label: string) =>
    z
        .string()
        .trim()
        .refine((value) => value === "" || validDate(value), `${label} tidak valid`)
        .transform((value) => (value === "" ? null : fromDateInput(value)));

export function collectErrors<K extends string>(issues: { path: PropertyKey[]; message: string }[]) {
    const errors: Partial<Record<K, string>> = {};
    for (const issue of issues) {
        const key = issue.path[0] as K;
        errors[key] ??= issue.message;
    }
    return errors;
}
