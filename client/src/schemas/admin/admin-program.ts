import { z } from "zod";
import { INSTALLMENT_PLAN_PATTERN, PROGRAM_LIMITS } from "@/constants/admin/admin-program-constant";

const STATUS_VALUES = ["active", "inactive", "full"] as const;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const isValidDate = (value: string) => DATE_PATTERN.test(value) && !Number.isNaN(Date.parse(value));

const requiredText = (label: string, max: number) =>
    z.string().trim().min(1, `${label} wajib diisi`).max(max, `${label} maksimal ${max} karakter`);

const optionalText = (label: string, max: number) =>
    z
        .string()
        .trim()
        .max(max, `${label} maksimal ${max} karakter`)
        .transform((value) => value || null);

const optionalInt = (label: string, min: number, max: number) =>
    z
        .string()
        .trim()
        .refine(
            (value) => value === "" || (/^\d+$/.test(value) && Number(value) >= min && Number(value) <= max),
            `${label} harus berupa angka ${min} sampai ${max.toLocaleString("id-ID")}`,
        )
        .transform((value) => (value === "" ? null : Number(value)));

const requiredInt = (label: string, min: number, max: number) =>
    z
        .string()
        .trim()
        .min(1, `${label} wajib diisi`)
        .refine(
            (value) => /^\d+$/.test(value) && Number(value) >= min && Number(value) <= max,
            `${label} harus berupa angka ${min} sampai ${max.toLocaleString("id-ID")}`,
        )
        .transform(Number);

const money = (label: string) =>
    z
        .string()
        .trim()
        .min(1, `${label} wajib diisi`)
        .refine(
            (value) => /^\d+(\.\d{1,2})?$/.test(value) && Number(value) <= PROGRAM_LIMITS.money,
            `${label} harus berupa angka 0 sampai ${PROGRAM_LIMITS.money.toLocaleString("id-ID")}`,
        )
        .transform(Number);

const optionalDate = (label: string) =>
    z
        .string()
        .trim()
        .refine((value) => value === "" || isValidDate(value), `${label} tidak valid`)
        .transform((value) => value || null);

export type ProgramFormValues = {
    name: string;
    programFormat: string;
    categoryId: string;
    description: string;
    location: string;
    contactInfo: string;
    requirements: string;
    requirementsText: string;
    schedule: string;
    timelineText: string;
    duration: string;
    capacity: string;
    registrationDeadline: string;
    startDate: string;
    endDate: string;
    trainingCost: string;
    trainingFeeDetails: string;
    departureCost: string;
    departureFeeDetails: string;
    installmentPlan: string;
    downPayment: string;
    jobMatchingCost: string;
    bridgeFund: string;
    status: string;
    isRunning: boolean;
    sortOrder: string;
};

export function buildProgramSchema(currentParticipants = 0) {
    const { short, long } = PROGRAM_LIMITS;

    return z
        .object({
            name: requiredText("Nama program", short),
            programFormat: optionalText("Format program", short),
            categoryId: optionalInt("Kategori", 1, Number.MAX_SAFE_INTEGER),
            description: optionalText("Deskripsi", long),
            location: optionalText("Lokasi", short),
            contactInfo: optionalText("Informasi kontak", long),
            requirements: optionalText("Persyaratan", long),
            requirementsText: optionalText("Syarat pendaftaran", long),
            schedule: optionalText("Jadwal", long),
            timelineText: optionalText("Timeline", long),
            duration: optionalText("Durasi", short),
            capacity: optionalInt("Kuota", 1, PROGRAM_LIMITS.capacity),
            registrationDeadline: optionalDate("Batas pendaftaran"),
            startDate: optionalDate("Tanggal mulai"),
            endDate: optionalDate("Tanggal selesai"),
            trainingCost: money("Biaya pelatihan"),
            trainingFeeDetails: optionalText("Rincian biaya pelatihan", long),
            departureCost: money("Biaya keberangkatan"),
            departureFeeDetails: optionalText("Rincian biaya keberangkatan", long),
            installmentPlan: z.string().regex(INSTALLMENT_PLAN_PATTERN, "Skema pembayaran tidak valid"),
            downPayment: money("Uang muka"),
            jobMatchingCost: money("Biaya job matching"),
            bridgeFund: optionalText("Dana talangan", short),
            status: z.enum(STATUS_VALUES, { error: "Status wajib dipilih" }),
            isRunning: z.boolean(),
            sortOrder: requiredInt("Urutan", 0, PROGRAM_LIMITS.sortOrder),
        })
        .refine((data) => !data.startDate || !data.endDate || data.endDate >= data.startDate, {
            path: ["endDate"],
            message: "Tanggal selesai tidak boleh sebelum tanggal mulai",
        })
        .refine((data) => data.capacity === null || data.capacity >= currentParticipants, {
            path: ["capacity"],
            message: `Kuota tidak boleh kurang dari jumlah peserta saat ini (${currentParticipants})`,
        });
}
