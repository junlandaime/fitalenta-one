import { formatShortDate } from "@/helpers/admin/admin-helper";
import type { InvoiceFormValues } from "@/schemas/admin/admin-payment";
import type { CreateInvoicePayload, PaymentItem } from "@/types/admin/admin-payment";

const blankToUndefined = (value: string) => {
    const trimmed = value.trim();
    return trimmed === "" ? undefined : trimmed;
};

export const digitsOnly = (value: string) => value.replace(/\D/g, "").replace(/^0+(?=\d)/, "");

export function splitEvenly(total: number, parts: number): string[] {
    if (!Number.isFinite(total) || total <= 0) return Array.from({ length: parts }, () => "");

    const base = Math.floor(total / parts);
    return Array.from({ length: parts }, (_, index) =>
        String(index === parts - 1 ? total - base * (parts - 1) : base),
    );
}

export function sumAmounts(values: string[]): number {
    return values.reduce((sum, value) => sum + (Number(value) || 0), 0);
}

export function buildCreatePayload(values: InvoiceFormValues): CreateInvoicePayload {
    const dueDate = blankToUndefined(values.dueDate);
    const notes = blankToUndefined(values.notes);

    return {
        registrationId: values.registrationId as number,
        amount: Number(values.amount),
        ...(dueDate ? { dueDate } : {}),
        ...(values.useInstallments ? { installmentAmounts: values.installmentAmounts.map(Number) } : {}),
        ...(notes ? { notes } : {}),
    };
}

export function paymentPercent({ amount, amountPaid }: Pick<PaymentItem, "amount" | "amountPaid">): number {
    const total = Number(amount);
    if (!total) return 0;
    return Math.min(100, Math.max(0, Math.round((Number(amountPaid) / total) * 100)));
}

export function getDeadline(payment: Pick<PaymentItem, "nextDueDate" | "dueDate">): string | null {
    return payment.nextDueDate ?? payment.dueDate;
}

export function formatDeadline(payment: Pick<PaymentItem, "nextDueDate" | "dueDate">): string | null {
    const deadline = getDeadline(payment);
    return deadline ? formatShortDate(deadline) : null;
}

export type VerifyPreview = {
    amount: string;
    settled: boolean;
    installmentNumber: number | null;
    installmentTotal: number | null;
};

export function getVerifyPreview(payment: PaymentItem): VerifyPreview {
    const { installment } = payment;

    if (!installment) {
        return { amount: payment.remainingAmount, settled: true, installmentNumber: null, installmentTotal: null };
    }

    const number = installment.current + 1;
    return {
        amount: installment.amounts[number - 1] ?? "0",
        settled: number >= installment.total,
        installmentNumber: number,
        installmentTotal: installment.total,
    };
}

export type InstallmentStep = {
    number: number;
    amount: string;
    state: "paid" | "next" | "waiting";
};

export function getInstallmentSteps(payment: PaymentItem): InstallmentStep[] {
    const { installment } = payment;
    if (!installment) return [];

    const open = payment.status !== "cancelled";

    return installment.amounts.map((amount, index) => ({
        number: index + 1,
        amount,
        state: index < installment.current ? "paid" : index === installment.current && open ? "next" : "waiting",
    }));
}

export function saveBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
}
