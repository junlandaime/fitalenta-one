import { Prisma } from "../../../generated/prisma/client";
import { PaymentErrors } from "../../errors/payment.errors";
import { UserPaymentState } from "../../types/userPayment.types";
import { endOfDeadlineDay } from "../../utils/date";
import { PaymentSnapshot, hasPendingProof, isSettled, parseInstallmentAmounts } from "../admin/payment.policy";

const Decimal = Prisma.Decimal;

export interface PayablePayment extends PaymentSnapshot {
  dueDate: Date | null;
  nextDueDate: Date | null;
}

export function getPaymentState(payment: PaymentSnapshot): UserPaymentState {
  if (payment.status === "cancelled") return "cancelled";
  if (payment.status === "paid") return "paid";
  return hasPendingProof(payment) ? "awaiting_verification" : "awaiting_payment";
}

export function getPaymentDeadline({ nextDueDate, dueDate }: Pick<PayablePayment, "dueDate" | "nextDueDate">) {
  return nextDueDate ?? dueDate;
}

export function isOverdue(payment: PayablePayment, now = new Date()): boolean {
  if (getPaymentState(payment) !== "awaiting_payment") return false;

  const deadline = getPaymentDeadline(payment);
  return !!deadline && now > endOfDeadlineDay(deadline);
}

export function getAmountDue(payment: PaymentSnapshot): Prisma.Decimal {
  if (isSettled(payment)) return new Decimal(0);

  const installments = parseInstallmentAmounts(payment.installmentAmounts);
  if (!installments) return payment.amount.minus(payment.amountPaid);

  return installments[payment.currentInstallmentNumber] ?? new Decimal(0);
}

export function canUploadProof(payment: PaymentSnapshot): boolean {
  return !!payment.issuedAt && !isSettled(payment);
}

export function assertCanUploadProof(payment: PaymentSnapshot): void {
  if (!payment.issuedAt) throw PaymentErrors.notFound();
  if (isSettled(payment)) throw PaymentErrors.alreadySettled();
}