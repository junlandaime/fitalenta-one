import type { AdminProgramStatus } from "@/types/admin/admin-program";

export const PROGRAMS_PER_PAGE = 10;

type StatusMeta = {
    label: string;
    className: string;
};

export const PROGRAM_STATUS_META: Record<AdminProgramStatus, StatusMeta> = {
    active: {
        label: "Aktif",
        className:
            "border-transparent bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    },
    inactive: {
        label: "Nonaktif",
        className:
            "border-transparent bg-muted text-muted-foreground",
    },
    full: {
        label: "Penuh",
        className:
            "border-transparent bg-amber-500/10 text-amber-700 dark:text-amber-400",
    },
};

export const PROGRAM_STATUS_OPTIONS: { value: AdminProgramStatus; label: string }[] = [
    { value: "active", label: PROGRAM_STATUS_META.active.label },
    { value: "inactive", label: PROGRAM_STATUS_META.inactive.label },
    { value: "full", label: PROGRAM_STATUS_META.full.label },
];

export const RUNNING_FILTER_OPTIONS = [
    { value: "all", label: "Semua jadwal" },
    { value: "true", label: "Sedang berjalan" },
    { value: "false", label: "Tidak berjalan" },
] as const;

export const PROGRAM_LIMITS = {
    short: 191,
    long: 20000,
    capacity: 100000,
    sortOrder: 9999,
    money: 99_999_999.99,
} as const;

export const INSTALLMENT_PLAN_PATTERN = /^(none|\d{1,2}_installments)$/;

export const INSTALLMENT_PLANS = ["none", ...[2, 3, 4, 5, 6, 8, 10, 12].map((count) => `${count}_installments`)];

export const NEW_PROGRAM_DEFAULTS = {
    location: "Jakarta, Indonesia & Jepang",
    bridgeFund: "Tersedia",
    trainingCost: "16000000",
    departureCost: "30000000",
    sortOrder: "999",
} as const;
