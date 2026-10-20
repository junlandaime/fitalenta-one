import { PaymentMethod, PaymentStatus } from "../../generated/prisma/client";
import { PaginationQuery } from "../utils/pagination";

export type UserPaymentState = "awaiting_payment" | "awaiting_verification" | "paid" | "cancelled";

export interface MyPaymentFilters extends PaginationQuery {
  status?: PaymentStatus;
}

export interface MyPaymentSummary {
  totalInvoices: number;
  awaitingPayment: number;
  awaitingVerification: number;
  paid: number;
  overdue: number;
  totalAmount: string;
  totalPaid: string;
  totalRemaining: string;
}

export interface PaymentAccount {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
}

export interface MyPaymentItem {
  id: number;
  invoiceNumber: string;
  receiptNumber: string | null;
  status: PaymentStatus;
  state: UserPaymentState;
  isOverdue: boolean;
  issuedAt: Date | null;
  amount: string;
  amountPaid: string;
  remainingAmount: string;
  amountDue: string;
  paymentMethod: PaymentMethod;
  dueDate: string | null;
  nextDueDate: string | null;
  deadline: string | null;
  paymentDate: Date | null;
  proofImage: string | null;
  verifiedAt: Date | null;
  notes: string | null;
  installment: {
    current: number;
    total: number;
    amounts: string[];
  } | null;
  registration: { id: number; registrationCode: string };
  program: { id: number | null; name: string; programFormat: string | null };
  actions: { canUploadProof: boolean };
}

export interface MyPaymentHistoryItem {
  id: number;
  oldStatus: PaymentStatus | null;
  newStatus: PaymentStatus | null;
  amountChanged: string | null;
  changedAt: Date;
}

export interface MyPaymentDetail extends MyPaymentItem {
  paymentAccount: PaymentAccount | null;
  history: MyPaymentHistoryItem[];
}