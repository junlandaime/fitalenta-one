import { Payment, Prisma } from "../../../generated/prisma/client";
import { INVOICE_ISSUER } from "../../config/payment.config";
import {
  MyPaymentDetail,
  MyPaymentHistoryItem,
  MyPaymentItem,
  MyPaymentSummary,
  PaymentAccount,
  UserPaymentState,
} from "../../types/userPayment.types";
import { toInstallment } from "../admin/payment.mapper";
import { isSettled } from "../admin/payment.policy";
import { toDateOnly } from "./registration.mapper";
import {
  canUploadProof,
  getAmountDue,
  getPaymentDeadline,
  getPaymentState,
  isOverdue,
} from "./payment.policy";

const Decimal = Prisma.Decimal;

export const myPaymentInclude = {
  registration: {
    select: {
      id: true,
      registrationCode: true,
      program: { select: { id: true, name: true, programFormat: true } },
    },
  },
} satisfies Prisma.PaymentInclude;

export const myPaymentDetailInclude = {
  ...myPaymentInclude,
  paymentHistory: { orderBy: [{ changedAt: "desc" }, { id: "desc" }] },
} satisfies Prisma.PaymentInclude;

type MyPaymentRecord = Prisma.PaymentGetPayload<{ include: typeof myPaymentInclude }>;
type MyPaymentDetailRecord = Prisma.PaymentGetPayload<{ include: typeof myPaymentDetailInclude }>;
type HistoryRecord = MyPaymentDetailRecord["paymentHistory"][number];

const sumDecimals = (values: Prisma.Decimal[]) => values.reduce((total, value) => total.plus(value), new Decimal(0));

function toPaymentAccount(payment: Payment): PaymentAccount | null {
  if (isSettled(payment)) return null;

  return {
    bankName: INVOICE_ISSUER.bank.name,
    accountNumber: INVOICE_ISSUER.bank.accountNumber,
    accountHolder: INVOICE_ISSUER.name,
  };
}

function toHistoryItem(entry: HistoryRecord): MyPaymentHistoryItem {
  return {
    id: entry.id,
    oldStatus: entry.oldStatus,
    newStatus: entry.newStatus,
    amountChanged: entry.amountChanged?.toString() ?? null,
    changedAt: entry.changedAt,
  };
}

export function toMyPaymentItem(payment: MyPaymentRecord): MyPaymentItem {
  const { registration } = payment;
  const program = registration?.program;

  return {
    id: payment.id,
    invoiceNumber: payment.invoiceNumber,
    receiptNumber: payment.receiptNumber,
    status: payment.status,
    state: getPaymentState(payment),
    isOverdue: isOverdue(payment),
    issuedAt: payment.issuedAt,
    amount: payment.amount.toString(),
    amountPaid: payment.amountPaid.toString(),
    remainingAmount: payment.amount.minus(payment.amountPaid).toString(),
    amountDue: getAmountDue(payment).toString(),
    paymentMethod: payment.paymentMethod,
    dueDate: toDateOnly(payment.dueDate),
    nextDueDate: toDateOnly(payment.nextDueDate),
    deadline: toDateOnly(getPaymentDeadline(payment)),
    paymentDate: payment.paymentDate,
    proofImage: payment.proofImage,
    verifiedAt: payment.verifiedAt,
    notes: payment.notes,
    installment: toInstallment(payment),
    registration: { id: registration?.id ?? 0, registrationCode: registration?.registrationCode ?? "" },
    program: {
      id: program?.id ?? null,
      name: program?.name ?? "",
      programFormat: program?.programFormat ?? null,
    },
    actions: { canUploadProof: canUploadProof(payment) },
  };
}

export function toMyPaymentDetail(payment: MyPaymentDetailRecord): MyPaymentDetail {
  return {
    ...toMyPaymentItem(payment),
    paymentAccount: toPaymentAccount(payment),
    history: payment.paymentHistory.map(toHistoryItem),
  };
}

export function toPaymentSummary(payments: Payment[]): MyPaymentSummary {
  const active = payments.filter(({ status }) => status !== "cancelled");
  const countByState = (state: UserPaymentState) => active.filter((payment) => getPaymentState(payment) === state).length;
  const totalAmount = sumDecimals(active.map(({ amount }) => amount));
  const totalPaid = sumDecimals(active.map(({ amountPaid }) => amountPaid));

  return {
    totalInvoices: active.length,
    awaitingPayment: countByState("awaiting_payment"),
    awaitingVerification: countByState("awaiting_verification"),
    paid: countByState("paid"),
    overdue: active.filter((payment) => isOverdue(payment)).length,
    totalAmount: totalAmount.toString(),
    totalPaid: totalPaid.toString(),
    totalRemaining: totalAmount.minus(totalPaid).toString(),
  };
}