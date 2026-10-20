import { PaymentMethod, PaymentStatus } from "../../generated/prisma/client";
import { INVOICE_STATE_VALUES } from "../config/payment.config";
import { PaginationQuery } from "../utils/pagination";

export type InvoiceState = (typeof INVOICE_STATE_VALUES)[number];

export interface PaymentSummary {
  totalInvoices: number;
  drafts: number;
  outstanding: number;
  paid: number;
  totalCollected: string;
}

export interface PaymentOptions {
  statuses: PaymentStatus[];
  invoiceStates: InvoiceState[];
}

export interface PaymentFilters extends PaginationQuery {
  search?: string;
  status?: PaymentStatus;
  invoiceState?: InvoiceState;
}

export interface PaymentItem {
  id: number;
  invoiceNumber: string;
  receiptNumber: string | null;
  status: PaymentStatus;
  invoiceState: InvoiceState;
  isManualInvoice: boolean;
  issuedAt: Date | null;
  amount: string;
  amountPaid: string;
  remainingAmount: string;
  paymentMethod: PaymentMethod;
  dueDate: string | null;
  nextDueDate: string | null;
  paymentDate: Date | null;
  proofImage: string | null;
  verifiedAt: Date | null;
  verifiedBy: { id: number; name: string } | null;
  notes: string | null;
  installment: {
    current: number;
    total: number;
    amounts: string[];
  } | null;
  registration: { id: number; registrationCode: string };
  participant: { userId: number | null; name: string; email: string; phone: string | null };
  program: { id: number | null; name: string; programFormat: string | null };
  actions: { canIssue: boolean; canVerify: boolean };
}

export interface PaymentHistoryItem {
  id: number;
  oldStatus: PaymentStatus | null;
  newStatus: PaymentStatus | null;
  amountChanged: string | null;
  oldAmountPaid: string | null;
  newAmountPaid: string | null;
  notes: string | null;
  changedBy: { id: number; name: string } | null;
  changedAt: Date;
}

export interface PaymentDetail extends PaymentItem {
  history: PaymentHistoryItem[];
}

export interface CreateInvoiceInput {
  registrationId: number;
  amount: number;
  dueDate?: Date | null;
  installmentAmounts?: number[] | null;
  notes?: string | null;
}

export interface IssueInvoiceInput {
  dueDate?: Date | null;
}

export interface VerifyPaymentInput {
  nextDueDate?: Date | null;
  notes?: string | null;
}