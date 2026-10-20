import { PaymentMethod, PaymentStatus } from "../../generated/prisma/client";

export const REPORT_SHEET_NAME = "Laporan Keuangan";
export const REPORT_INSTRUCTION_SHEET_NAME = "Petunjuk";
export const REPORT_HEADER_FILL = "FFE6E6FA";

export const XLSX_MIME = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

export const REPORT_COLUMNS = [
  { key: "no", header: "No", width: 6 },
  { key: "invoiceNumber", header: "Invoice Number", width: 22 },
  { key: "receiptNumber", header: "Receipt Number", width: 22 },
  { key: "participantName", header: "Nama Peserta", width: 28 },
  { key: "email", header: "Email", width: 30 },
  { key: "program", header: "Program", width: 30 },
  { key: "amount", header: "Amount", width: 16 },
  { key: "amountPaid", header: "Amount Paid", width: 16 },
  { key: "status", header: "Status", width: 16 },
  { key: "termin", header: "Termin", width: 26 },
  { key: "paymentMethod", header: "Payment Method", width: 18 },
  { key: "paymentDate", header: "Payment Date", width: 18 },
  { key: "createdAt", header: "Created At", width: 20 },
] as const;

export type ReportColumnKey = (typeof REPORT_COLUMNS)[number]["key"];

export const REPORT_REQUIRED_COLUMNS: ReportColumnKey[] = ["email", "program", "amount"];

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: "Belum Bayar",
  installment_1: "Cicilan 1",
  installment_2: "Cicilan 2",
  installment_3: "Cicilan 3",
  installment_4: "Cicilan 4",
  installment_5: "Cicilan 5",
  installment_6: "Cicilan 6",
  paid: "Lunas",
  overdue: "Jatuh Tempo",
  cancelled: "Dibatalkan",
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  transfer: "Transfer",
  cash: "Tunai",
  credit_card: "Kartu Kredit",
};

export const TERMIN_TYPES = ["cash", "installment"] as const;

export const TERMIN_TYPE_LABELS: Record<(typeof TERMIN_TYPES)[number], string> = {
  cash: "Tunai (Sekali Bayar)",
  installment: "Cicilan",
};

export const IMPORT_LIMITS = {
  maxFileSizeMB: 5,
  maxRows: 500,
  maxReturnedErrors: 200,
  transactionTimeoutMs: 60_000,
} as const;

export const EXPORT_MAX_ROWS = 20_000;

export const IMPORT_HISTORY_NOTE = "Diimpor dari file Excel";