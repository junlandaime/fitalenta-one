import { Banknote, CreditCard, Landmark, type LucideIcon } from "lucide-react";
import type { StatusMap } from "@/constants/admin/admin-status";
import type { InvoiceState, PaymentMethod, PaymentStatus } from "@/types/admin/admin-payment";

export const PAYMENTS_PER_PAGE = 10;

export const PAYMENT_STATUS_VALUES = [
    "pending",
    "installment_1",
    "installment_2",
    "installment_3",
    "installment_4",
    "installment_5",
    "installment_6",
    "paid",
    "overdue",
    "cancelled",
] as const satisfies readonly PaymentStatus[];

export const INVOICE_STATE_VALUES = ["draft", "issued"] as const satisfies readonly InvoiceState[];

export const INVOICE_STATE: StatusMap = {
    draft: { label: "Draft", tone: "muted" },
    issued: { label: "Diterbitkan", tone: "process" },
};

export const MIN_INSTALLMENTS = 2;
export const MAX_INSTALLMENTS = 6;

export const PAYMENT_METHOD_META: Record<PaymentMethod, { label: string; icon: LucideIcon }> = {
    transfer: { label: "Transfer Bank", icon: Landmark },
    cash: { label: "Tunai", icon: Banknote },
    credit_card: { label: "Kartu Kredit", icon: CreditCard },
};
