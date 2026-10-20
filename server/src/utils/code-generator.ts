import { Prisma } from "../../generated/prisma/client";
import {
  CodeFormat,
  INVOICE_CODE_FORMAT,
  REGISTRATION_CODE_FORMAT,
  REGISTRATION_TIMEZONE_OFFSET_HOURS,
} from "../config/registration.config";

import { RECEIPT_CODE_FORMAT } from "../config/payment.config";

type Db = Prisma.TransactionClient;

function periodKey(format: CodeFormat, date: Date): string {
  const local = new Date(date.getTime() + REGISTRATION_TIMEZONE_OFFSET_HOURS * 3_600_000);
  const year = String(local.getUTCFullYear());
  const month = String(local.getUTCMonth() + 1).padStart(2, "0");
  return format.scope === "year" ? year : `${year}${month}`;
}

async function nextSequentialCode(
  format: CodeFormat,
  date: Date,
  findLatest: (prefix: string) => Promise<string | null>
): Promise<string> {
  const prefix = `${format.prefix}-${periodKey(format, date)}-`;
  const latest = await findLatest(prefix);
  const lastSequence = latest ? parseInt(latest.slice(prefix.length), 10) : 0;
  const next = (Number.isNaN(lastSequence) ? 0 : lastSequence) + 1;
  return `${prefix}${String(next).padStart(format.pad, "0")}`;
}

export function nextRegistrationCode(db: Db, date = new Date()): Promise<string> {
  return nextSequentialCode(REGISTRATION_CODE_FORMAT, date, async (prefix) => {
    const latest = await db.registration.findFirst({
      where: { registrationCode: { startsWith: prefix } },
      orderBy: { registrationCode: "desc" },
      select: { registrationCode: true },
    });
    return latest?.registrationCode ?? null;
  });
}

export function nextInvoiceNumber(db: Db, date = new Date()): Promise<string> {
  return nextSequentialCode(INVOICE_CODE_FORMAT, date, async (prefix) => {
    const latest = await db.payment.findFirst({
      where: { invoiceNumber: { startsWith: prefix } },
      orderBy: { invoiceNumber: "desc" },
      select: { invoiceNumber: true },
    });
    return latest?.invoiceNumber ?? null;
  });
}

export function nextReceiptNumber(db: Db, date = new Date()): Promise<string> {
  return nextSequentialCode(RECEIPT_CODE_FORMAT, date, async (prefix) => {
    const latest = await db.payment.findFirst({
      where: { receiptNumber: { startsWith: prefix } },
      orderBy: { receiptNumber: "desc" },
      select: { receiptNumber: true },
    });
    return latest?.receiptNumber ?? null;
  });
}