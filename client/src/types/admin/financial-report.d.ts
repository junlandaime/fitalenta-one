import type { AdminPageMeta } from "@/types/pagination";
import type { PaymentMethod, PaymentStatus } from "@/types/admin/admin-payment";

export type TerminType = "cash" | "installment";

export type TerminInfo = {
    type: TerminType;
    current: number | null;
    total: number | null;
    label: string;
};

export type ReportRow = {
    id: number;
    invoiceNumber: string;
    receiptNumber: string | null;
    participantName: string;
    email: string;
    program: string;
    amount: string;
    amountPaid: string;
    status: PaymentStatus;
    termin: TerminInfo;
    paymentMethod: PaymentMethod;
    paymentDate: string | null;
    createdAt: string;
};

export type ReportSummary = {
    totalRecords: number;
    paidCount: number;
    cashCount: number;
    installmentCount: number;
    totalBilled: string;
    totalCollected: string;
    totalOutstanding: string;
};

export type ReportFilters = {
    search: string;
    status: PaymentStatus | "all";
    termin: TerminType | "all";
    paymentMethod: PaymentMethod | "all";
    dateFrom: string;
    dateTo: string;
};

export type ReportParams = ReportFilters & { page: number };

export type ReportList = {
    items: ReportRow[];
    meta: AdminPageMeta;
};

export type ImportRowError = {
    row: number;
    field: string | null;
    message: string;
};

export type ImportResult = {
    dryRun: boolean;
    committed: boolean;
    totalRows: number;
    toCreate: number;
    toUpdate: number;
    created: number;
    updated: number;
    errorCount: number;
    errors: ImportRowError[];
};

export type DownloadedFile = {
    blob: Blob;
    filename: string;
};
