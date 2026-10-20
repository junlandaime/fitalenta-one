import { BadgeCheck, CloudUpload, FileText, Repeat, ShieldCheck, Wallet, type LucideIcon } from "lucide-react";
import { StatusTone } from "../admin/admin-status";
import type { UserPaymentState } from "@/types/user/user-payment";

export const MY_PAYMENTS_PER_PAGE = 5;

export const PAYMENT_HERO = {
    badge: "FITALENTA PAYMENT",
    title: "Manajemen Pembayaran",
    subtitle: "Kelola invoice, pembayaran cicilan, dan bukti pembayaran program magang Anda dalam satu tempat.",
} as const;

export const PAYMENT_HERO_CHIPS: { label: string; icon: LucideIcon }[] = [
    { label: "Aman & Terverifikasi", icon: ShieldCheck },
    { label: "Invoice Terintegrasi", icon: FileText },
    { label: "Pembayaran Bertahap", icon: Repeat },
];

export const PAYMENT_FLOW_STEPS: { title: string; description: string; icon: LucideIcon }[] = [
    {
        title: "Tagihan Diterbitkan",
        description: "Admin menerbitkan tagihan pertama setelah Anda lolos interview.",
        icon: FileText,
    },
    {
        title: "Lakukan Pembayaran",
        description: "Bayar sesuai nominal invoice yang telah diterbitkan.",
        icon: Wallet,
    },
    {
        title: "Upload Bukti",
        description: "Unggah bukti pembayaran melalui halaman ini.",
        icon: CloudUpload,
    },
    {
        title: "Verifikasi Admin",
        description: "Admin memeriksa pembayaran dalam 1-2 hari kerja.",
        icon: ShieldCheck,
    },
    {
        title: "Tagihan Berikutnya",
        description: "Untuk pembayaran cicilan, proses berulang hingga seluruh pembayaran dinyatakan lunas.",
        icon: BadgeCheck,
    },
];

export const PAYMENT_FLOW_NOTICE = {
    title: "Menunggu Tagihan Admin",
    description:
        "Jika status pembayaran menunjukkan “Menunggu Tagihan Admin”, Anda tidak perlu melakukan tindakan. Tagihan selanjutnya akan diterbitkan oleh admin.",
} as const;

export const USER_PAYMENT_STATE: Record<UserPaymentState, { label: string; tone: StatusTone }> = {
    awaiting_payment: { label: "Menunggu Pembayaran", tone: "warning" },
    awaiting_verification: { label: "Menunggu Verifikasi", tone: "process" },
    paid: { label: "Lunas", tone: "success" },
    cancelled: { label: "Dibatalkan", tone: "muted" },
};

export const PAYMENT_PROOF_RULES = {
    maxSize: 5 * 1024 * 1024,
    types: ["image/jpeg", "image/png", "image/webp"],
    accept: "image/jpeg,image/png,image/webp",
    label: "JPG, PNG, atau WEBP • Maksimal 5 MB",
} as const;
