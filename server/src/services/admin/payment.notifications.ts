import { NotificationType, Prisma } from "../../../generated/prisma/client";
import { formatDate, formatRupiah } from "../../utils/format";
import { VerificationResult } from "./payment.policy";

interface NotificationDraft {
  title: string;
  message: string;
  type: NotificationType;
}

interface InvoiceInfo {
  invoiceNumber: string;
  amount: Prisma.Decimal;
  dueDate: Date | null;
}

export function buildInvoiceIssuedNotification({ invoiceNumber, amount, dueDate }: InvoiceInfo): NotificationDraft {
  const due = dueDate ? `, jatuh tempo ${formatDate(dueDate)}` : "";

  return {
    title: "Tagihan baru",
    message: `Tagihan ${invoiceNumber} sebesar ${formatRupiah(amount)} telah diterbitkan${due}.`,
    type: "info",
  };
}

export function buildPaymentVerifiedNotification(
  invoiceNumber: string,
  { settled, installmentPaid }: VerificationResult
): NotificationDraft {
  const title = "Pembayaran diverifikasi";

  if (settled) {
    return { title, message: `Pembayaran tagihan ${invoiceNumber} telah diverifikasi dan dinyatakan lunas.`, type: "success" };
  }

  return {
    title,
    message: `Pembayaran cicilan ke-${installmentPaid} untuk tagihan ${invoiceNumber} telah diverifikasi.`,
    type: "success",
  };
}

export async function createPaymentNotification(
  tx: Prisma.TransactionClient,
  userId: number | null | undefined,
  paymentId: number,
  draft: NotificationDraft
): Promise<void> {
  if (!userId) return;

  await tx.notification.create({
    data: { userId, relatedEntity: "payment", relatedEntityId: paymentId, ...draft },
  });
}