import { PaymentStatus, Prisma } from "../../../generated/prisma/client";
import { SETTLED_PAYMENT_STATUSES } from "../../config/payment.config";
import { PaymentErrors } from "../../errors/payment.errors";
import { InvoiceState } from "../../types/payment.types";

const Decimal = Prisma.Decimal;

export interface PaymentSnapshot {
  status: PaymentStatus;
  amount: Prisma.Decimal;
  amountPaid: Prisma.Decimal;
  installmentAmounts: Prisma.JsonValue | null;
  currentInstallmentNumber: number;
  issuedAt: Date | null;
  proofImage: string | null;
  paymentDate: Date | null;
  verifiedAt: Date | null;
}

export interface VerificationResult {
  status: PaymentStatus;
  amountPaid: Prisma.Decimal;
  amountChanged: Prisma.Decimal;
  currentInstallmentNumber: number;
  settled: boolean;
  installmentPaid: number | null;
}

export function parseInstallmentAmounts(value: Prisma.JsonValue | null): Prisma.Decimal[] | null {
  if (!Array.isArray(value) || value.length === 0) return null;
  return value.map((item) => new Decimal(String(item)));
}

export function getInvoiceState({ issuedAt }: Pick<PaymentSnapshot, "issuedAt">): InvoiceState {
  return issuedAt ? "issued" : "draft";
}

export function isSettled({ status }: Pick<PaymentSnapshot, "status">): boolean {
  return SETTLED_PAYMENT_STATUSES.includes(status);
}

export function hasPendingProof({ proofImage, paymentDate, verifiedAt }: PaymentSnapshot): boolean {
  if (!proofImage || !paymentDate) return false;
  return !verifiedAt || paymentDate > verifiedAt;
}

export function canIssue(payment: PaymentSnapshot): boolean {
  return !payment.issuedAt && !isSettled(payment);
}

export function canVerify(payment: PaymentSnapshot): boolean {
  return !!payment.issuedAt && !isSettled(payment) && hasPendingProof(payment);
}

export function assertInstallmentsMatchAmount(amount: number, installmentAmounts?: number[] | null): void {
  if (!installmentAmounts?.length) return;

  const total = installmentAmounts.reduce((sum, item) => sum.plus(item), new Decimal(0));
  if (!total.equals(amount)) throw PaymentErrors.installmentMismatch();
}

export function assertCanIssue(payment: PaymentSnapshot): void {
  if (payment.issuedAt) throw PaymentErrors.alreadyIssued();
  if (isSettled(payment)) throw PaymentErrors.alreadySettled();
}

export function assertCanVerify(payment: PaymentSnapshot): void {
  if (!payment.issuedAt) throw PaymentErrors.notIssued();
  if (isSettled(payment)) throw PaymentErrors.alreadySettled();
  if (!hasPendingProof(payment)) throw PaymentErrors.noPendingProof();
}

export function calculateVerification(payment: PaymentSnapshot): VerificationResult {
  const installments = parseInstallmentAmounts(payment.installmentAmounts);

  if (!installments) {
    return {
      status: "paid",
      amountPaid: payment.amount,
      amountChanged: payment.amount.minus(payment.amountPaid),
      currentInstallmentNumber: payment.currentInstallmentNumber,
      settled: true,
      installmentPaid: null,
    };
  }

  const installmentNumber = payment.currentInstallmentNumber + 1;
  if (installmentNumber > installments.length) throw PaymentErrors.alreadySettled();

  const installmentAmount = installments[installmentNumber - 1];
  const settled = installmentNumber === installments.length;

  return {
    status: settled ? "paid" : (`installment_${installmentNumber}` as PaymentStatus),
    amountPaid: settled ? payment.amount : payment.amountPaid.plus(installmentAmount),
    amountChanged: installmentAmount,
    currentInstallmentNumber: installmentNumber,
    settled,
    installmentPaid: installmentNumber,
  };
}