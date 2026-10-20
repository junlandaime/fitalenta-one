import { Prisma } from "../../../generated/prisma/client";
import { PaymentDetail, PaymentHistoryItem, PaymentItem } from "../../types/payment.types";
import { toDateOnly } from "../user/registration.mapper";
import {
  PaymentSnapshot,
  canIssue,
  canVerify,
  getInvoiceState,
  parseInstallmentAmounts,
} from "./payment.policy";

export const paymentListInclude = {
  registration: {
    select: {
      id: true,
      registrationCode: true,
      user: { select: { id: true, name: true, email: true, phone: true } },
      program: { select: { id: true, name: true, programFormat: true } },
    },
  },
  verifiedByUser: { select: { id: true, name: true } },
} satisfies Prisma.PaymentInclude;

export const paymentDetailInclude = {
  ...paymentListInclude,
  paymentHistory: {
    orderBy: [{ changedAt: "desc" }, { id: "desc" }],
    include: { changedByUser: { select: { id: true, name: true } } },
  },
} satisfies Prisma.PaymentInclude;

type PaymentListRecord = Prisma.PaymentGetPayload<{ include: typeof paymentListInclude }>;
type PaymentDetailRecord = Prisma.PaymentGetPayload<{ include: typeof paymentDetailInclude }>;
type HistoryRecord = PaymentDetailRecord["paymentHistory"][number];

const decimalOrNull = (value: Prisma.Decimal | null) => (value ? value.toString() : null);

export function toInstallment(payment: PaymentSnapshot) {
  const amounts = parseInstallmentAmounts(payment.installmentAmounts);
  if (!amounts) return null;

  return {
    current: payment.currentInstallmentNumber,
    total: amounts.length,
    amounts: amounts.map((amount) => amount.toString()),
  };
}

export function toPaymentItem(payment: PaymentListRecord): PaymentItem {
  const { registration, verifiedByUser } = payment;
  const user = registration?.user;
  const program = registration?.program;

  return {
    id: payment.id,
    invoiceNumber: payment.invoiceNumber,
    receiptNumber: payment.receiptNumber,
    status: payment.status,
    invoiceState: getInvoiceState(payment),
    isManualInvoice: payment.isManualInvoice,
    issuedAt: payment.issuedAt,
    amount: payment.amount.toString(),
    amountPaid: payment.amountPaid.toString(),
    remainingAmount: payment.amount.minus(payment.amountPaid).toString(),
    paymentMethod: payment.paymentMethod,
    dueDate: toDateOnly(payment.dueDate),
    nextDueDate: toDateOnly(payment.nextDueDate),
    paymentDate: payment.paymentDate,
    proofImage: payment.proofImage,
    verifiedAt: payment.verifiedAt,
    verifiedBy: verifiedByUser ? { id: verifiedByUser.id, name: verifiedByUser.name } : null,
    notes: payment.notes,
    installment: toInstallment(payment),
    registration: { id: registration?.id ?? 0, registrationCode: registration?.registrationCode ?? "" },
    participant: {
      userId: user?.id ?? null,
      name: user?.name ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? null,
    },
    program: {
      id: program?.id ?? null,
      name: program?.name ?? "",
      programFormat: program?.programFormat ?? null,
    },
    actions: { canIssue: canIssue(payment), canVerify: canVerify(payment) },
  };
}

function toHistoryItem(entry: HistoryRecord): PaymentHistoryItem {
  return {
    id: entry.id,
    oldStatus: entry.oldStatus,
    newStatus: entry.newStatus,
    amountChanged: decimalOrNull(entry.amountChanged),
    oldAmountPaid: decimalOrNull(entry.oldAmountPaid),
    newAmountPaid: decimalOrNull(entry.newAmountPaid),
    notes: entry.notes,
    changedBy: entry.changedByUser ? { id: entry.changedByUser.id, name: entry.changedByUser.name } : null,
    changedAt: entry.changedAt,
  };
}

export function toPaymentDetail(payment: PaymentDetailRecord): PaymentDetail {
  return { ...toPaymentItem(payment), history: payment.paymentHistory.map(toHistoryItem) };
}