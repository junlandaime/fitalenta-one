import { PaymentMethod, PaymentStatus } from "../../generated/prisma/client";
import { PaginationQuery } from "../utils/pagination";

export type TerminType = "cash" | "installment";

export interface TerminInfo {
  type: TerminType;
  /** Termin yang sudah tercapai (0 = belum ada cicilan terbayar). Null untuk pembayaran tunai. */
  current: number | null;
  /** Total termin pada skema cicilan. Null jika tunai atau total tidak tercatat (mis. data impor). */
  total: number | null;
  label: string;
}

export interface ReportFilters extends PaginationQuery {
  search?: string;
  status?: PaymentStatus;
  termin?: TerminType;
  paymentMethod?: PaymentMethod;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface ReportRow {
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
  paymentDate: Date | null;
  createdAt: Date;
}

export interface ReportSummary {
  totalRecords: number;
  paidCount: number;
  cashCount: number;
  installmentCount: number;
  totalBilled: string;
  totalCollected: string;
  totalOutstanding: string;
}

export interface ImportRowError {
  row: number;
  field: string | null;
  message: string;
}

export interface ImportResult {
  dryRun: boolean;
  committed: boolean;
  totalRows: number;
  toCreate: number;
  toUpdate: number;
  created: number;
  updated: number;
  errorCount: number;
  errors: ImportRowError[];
}