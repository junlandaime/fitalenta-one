import { PaymentStatus, Prisma } from "../../../generated/prisma/client";
import { PAYMENT_LIMITS } from "../../config/payment.config";
import { TERMIN_TYPE_LABELS } from "../../config/financial-report.config";
import { TerminInfo, TerminType } from "../../types/financial-report.types";

const INSTALLMENT_STATUS = /^installment_(\d)$/;

export const INSTALLMENT_STATUSES: PaymentStatus[] = Object.values(PaymentStatus).filter((status) =>
  INSTALLMENT_STATUS.test(status)
);

export const installmentNumberOf = (status: PaymentStatus): number | null => {
  const match = INSTALLMENT_STATUS.exec(status);
  return match ? Number(match[1]) : null;
};

interface TerminSource {
  status: PaymentStatus;
  installmentAmounts: Prisma.JsonValue | null;
  currentInstallmentNumber: number;
}

export function resolveTermin({ status, installmentAmounts, currentInstallmentNumber }: TerminSource): TerminInfo {
  const total = Array.isArray(installmentAmounts) && installmentAmounts.length > 0 ? installmentAmounts.length : null;
  const current = installmentNumberOf(status) ?? currentInstallmentNumber;

  if (total === null && current === 0) {
    return { type: "cash", current: null, total: null, label: TERMIN_TYPE_LABELS.cash };
  }

  const reached = status === "paid" && total !== null ? total : current;
  const base = total !== null ? `Cicilan ${reached}/${total}` : `Cicilan ${reached}`;
  const suffix = status === "paid" ? " (Lunas)" : status === "cancelled" ? " (Dibatalkan)" : "";

  return { type: "installment", current: reached, total, label: `${base}${suffix}` };
}

/** Kondisi Prisma untuk memfilter pembayaran berdasarkan jenis termin. Harus selaras dengan resolveTermin. */
export function terminWhere(type: TerminType): Prisma.PaymentWhereInput {
  if (type === "installment") {
    return {
      OR: [
        { installmentAmounts: { not: Prisma.DbNull } },
        { status: { in: INSTALLMENT_STATUSES } },
        { currentInstallmentNumber: { gt: 0 } },
      ],
    };
  }

  return {
    AND: [
      { installmentAmounts: { equals: Prisma.DbNull } },
      { status: { notIn: INSTALLMENT_STATUSES } },
      { currentInstallmentNumber: 0 },
    ],
  };
}

export interface ParsedTermin {
  type: TerminType;
  current: number | null;
  total: number | null;
}

const CASH_TERMIN = /^(tunai|cash|sekali\s*bayar|lunas\s*sekali\s*bayar)/i;
const INSTALLMENT_TERMIN = /^cicilan\s*(?:(\d+)\s*(?:\/\s*(\d+))?)?/i;

/** Membaca teks termin dari Excel: "Tunai", "Cicilan", "Cicilan 2", "Cicilan 2/4", "Cicilan 4/4 (Lunas)". */
export function parseTerminText(text: string): { ok: true; value: ParsedTermin } | { ok: false; message: string } {
  const value = text.trim();
  if (CASH_TERMIN.test(value)) return { ok: true, value: { type: "cash", current: null, total: null } };

  const match = INSTALLMENT_TERMIN.exec(value);
  if (!match) {
    return { ok: false, message: 'Termin tidak dikenali, gunakan "Tunai", "Cicilan 2" atau "Cicilan 2/4"' };
  }

  const current = match[1] !== undefined ? Number(match[1]) : null;
  const total = match[2] !== undefined ? Number(match[2]) : null;
  const { installmentMin, installmentMax } = PAYMENT_LIMITS;

  if (total !== null && (total < installmentMin || total > installmentMax)) {
    return { ok: false, message: `Total termin harus antara ${installmentMin} dan ${installmentMax}` };
  }
  if (current !== null && (current > installmentMax || (total !== null && current > total))) {
    return { ok: false, message: "Nomor cicilan tidak boleh melebihi total termin" };
  }

  return { ok: true, value: { type: "installment", current, total } };
}