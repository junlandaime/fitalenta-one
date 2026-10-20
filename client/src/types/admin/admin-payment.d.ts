import type { AdminPageMeta } from "@/types/pagination";
import type { PaymentStatus } from "@/types/admin/admin-dashboard";
import type { PaymentMethod } from "@/types/user/dashboard";

export type { PaymentStatus, PaymentMethod };

export type InvoiceState = "draft" | "issued";

export type PaymentSummary = {
    totalInvoices: number;
    drafts: number;
    outstanding: number;
    paid: number;
    totalCollected: string;
};

export type PaymentOptions = {
    statuses: PaymentStatus[];
    invoiceStates: InvoiceState[];
};

export type PaymentInstallment = {
    current: number;
    total: number;
    amounts: string[];
};

export type PaymentItem = {
    id: number;
    invoiceNumber: string;
    receiptNumber: string | null;
    status: PaymentStatus;
    invoiceState: InvoiceState;
    isManualInvoice: boolean;
    issuedAt: string | null;
    amount: string;
    amountPaid: string;
    remainingAmount: string;
    paymentMethod: PaymentMethod;
    dueDate: string | null;
    nextDueDate: string | null;
    paymentDate: string | null;
    proofImage: string | null;
    verifiedAt: string | null;
    verifiedBy: { id: number; name: string } | null;
    notes: string | null;
    installment: PaymentInstallment | null;
    registration: { id: number; registrationCode: string };
    participant: { userId: number | null; name: string; email: string; phone: string | null, photoPath: string | null };
    program: { id: number | null; name: string; programFormat: string | null };
    actions: { canIssue: boolean; canVerify: boolean };
};

export type PaymentHistoryItem = {
    id: number;
    oldStatus: PaymentStatus | null;
    newStatus: PaymentStatus | null;
    amountChanged: string | null;
    oldAmountPaid: string | null;
    newAmountPaid: string | null;
    notes: string | null;
    changedBy: { id: number; name: string } | null;
    changedAt: string;
};

export type PaymentDetail = PaymentItem & {
    history: PaymentHistoryItem[];
};

export type PaymentList = {
    items: PaymentItem[];
    meta: AdminPageMeta;
};

export type PaymentParams = {
    page: number;
    search: string;
    status: PaymentStatus | "all";
    invoiceState: InvoiceState | "all";
};

export type CreateInvoicePayload = {
    registrationId: number;
    amount: number;
    dueDate?: string;
    installmentAmounts?: number[];
    notes?: string;
};

export type IssueInvoicePayload = {
    dueDate?: string;
};

export type VerifyPaymentPayload = {
    nextDueDate?: string;
    notes?: string;
};

export type InvoiceFile = {
    blob: Blob;
    filename: string;
};
