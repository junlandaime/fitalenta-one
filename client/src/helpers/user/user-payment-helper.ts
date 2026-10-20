import { PAYMENT_PROOF_RULES } from "@/constants/user/user-payment-constant";
import { formatShortDate } from "@/helpers/admin/admin-helper";
import type { MyPaymentItem } from "@/types/user/user-payment";

export function validateProofFile(file: File): string | null {
    if (!(PAYMENT_PROOF_RULES.types as readonly string[]).includes(file.type)) {
        return "Format bukti harus JPG, PNG, atau WEBP";
    }
    if (file.size > PAYMENT_PROOF_RULES.maxSize) {
        return "Ukuran bukti maksimal 5 MB";
    }
    return null;
}

export const isOpenPayment = ({ state }: Pick<MyPaymentItem, "state">) =>
    state === "awaiting_payment" || state === "awaiting_verification";

export function formatDeadline({ deadline }: Pick<MyPaymentItem, "deadline">): string | null {
    return deadline ? formatShortDate(deadline) : null;
}

export function getDueLabel(payment: MyPaymentItem): string {
    const { installment } = payment;
    if (!installment) return "Pelunasan";
    return `Cicilan ke-${Math.min(installment.current + 1, installment.total)} dari ${installment.total}`;
}

export type InstallmentStep = {
    number: number;
    amount: string;
    state: "paid" | "verifying" | "next" | "waiting";
};

export function getInstallmentSteps(payment: MyPaymentItem): InstallmentStep[] {
    const { installment } = payment;
    if (!installment) return [];

    const open = isOpenPayment(payment);

    return installment.amounts.map((amount, index) => {
        let state: InstallmentStep["state"] = "waiting";

        if (index < installment.current) state = "paid";
        else if (index === installment.current && open) {
            state = payment.state === "awaiting_verification" ? "verifying" : "next";
        }

        return { number: index + 1, amount, state };
    });
}
