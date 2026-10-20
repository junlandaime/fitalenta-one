export type StatusTone = "success" | "warning" | "danger" | "info" | "process" | "muted";
export type StatusMeta = { label: string; tone: StatusTone };
export type StatusMap = Record<string, StatusMeta>;

export const INTERVIEW_STATUS: StatusMap = {
    menunggu: { label: "Menunggu Interview", tone: "warning" },
    lolos: { label: "Lolos Interview", tone: "success" },
    tidak_lolos: { label: "Tidak Lolos", tone: "danger" },
};

export const SELECTION_STATUS: StatusMap = {
    menunggu: { label: "Menunggu", tone: "warning" },
    lolos: { label: "Lolos", tone: "success" },
    tidak_lolos: { label: "Tidak Lolos", tone: "danger" },
};

export const PLACEMENT_STATUS: StatusMap = {
    proses: { label: "Proses", tone: "process" },
    lolos: { label: "Lolos", tone: "success" },
    ditempatkan: { label: "Ditempatkan", tone: "info" },
};

export const PAYMENT_STATUS: StatusMap = {
    pending: { label: "Belum Bayar", tone: "warning" },
    installment_1: { label: "Cicilan 1", tone: "info" },
    installment_2: { label: "Cicilan 2", tone: "info" },
    installment_3: { label: "Cicilan 3", tone: "info" },
    installment_4: { label: "Cicilan 4", tone: "info" },
    installment_5: { label: "Cicilan 5", tone: "info" },
    installment_6: { label: "Cicilan 6", tone: "info" },
    paid: { label: "Lunas", tone: "success" },
    overdue: { label: "Jatuh Tempo", tone: "danger" },
    cancelled: { label: "Dibatalkan", tone: "muted" },
};

export function statusLabel(map: StatusMap, value: string) {
    return map[value]?.label ?? value;
}