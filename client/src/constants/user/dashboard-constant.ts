export type Tone = "neutral" | "info" | "warning" | "success" | "danger";
export type StatusKind = "registration" | "placement" | "payment";

type Entry = { label: string; tone: Tone };

const INSTALLMENTS: Record<string, Entry> = Object.fromEntries(
    Array.from({ length: 6 }, (_, i) => [
        `installment_${i + 1}`,
        { label: `Cicilan ke-${i + 1}`, tone: "info" as Tone },
    ]),
);

const STATUS: Record<StatusKind, Record<string, Entry>> = {
    registration: {
        menunggu: { label: "Menunggu", tone: "warning" },
        lolos: { label: "Lolos", tone: "success" },
        tidak_lolos: { label: "Tidak Lolos", tone: "danger" },
    },
    placement: {
        proses: { label: "Dalam Proses", tone: "info" },
        lolos: { label: "Lolos", tone: "success" },
        ditempatkan: { label: "Ditempatkan", tone: "success" },
    },
    payment: {
        pending: { label: "Menunggu Pembayaran", tone: "warning" },
        ...INSTALLMENTS,
        paid: { label: "Lunas", tone: "success" },
        overdue: { label: "Jatuh Tempo", tone: "danger" },
        cancelled: { label: "Dibatalkan", tone: "neutral" },
    },
};

export const TONE_CLASS: Record<Tone, string> = {
    neutral: "border-slate-200 bg-slate-100 text-slate-700",
    info: "border-blue-200 bg-blue-50 text-blue-700",
    warning: "border-amber-200 bg-amber-50 text-amber-700",
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
    danger: "border-red-200 bg-red-50 text-red-700",
};

const normalize = (s: string) => s.trim().toLowerCase().replace(/[\s-]+/g, "_");

const prettify = (s: string) => {
    const t = s.replace(/[_-]+/g, " ").trim().toLowerCase();
    return t.charAt(0).toUpperCase() + t.slice(1);
};

export function getStatus(value: unknown, kind: StatusKind): Entry | undefined {
    if (value === null || value === undefined || value === "") return undefined;

    const str = String(value);
    return STATUS[kind][normalize(str)] ?? { label: prettify(str), tone: "neutral" };
}

export const statusLabel = (value: unknown, kind: StatusKind) =>
    getStatus(value, kind)?.label;

export const PAYMENT_METHOD_LABEL: Record<string, string> = {
    transfer: "Transfer Bank",
    cash: "Tunai",
    credit_card: "Kartu Kredit",
};