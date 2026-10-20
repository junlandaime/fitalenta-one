import prisma from "../../config/prisma";
import { PaymentStatus, Prisma } from "../../../generated/prisma/client";
import { INVOICE_STATE_VALUES, SETTLED_PAYMENT_STATUSES } from "../../config/payment.config";
import { PaymentErrors } from "../../errors/payment.errors";
import {
  CreateInvoiceInput,
  IssueInvoiceInput,
  PaymentDetail,
  PaymentFilters,
  PaymentItem,
  PaymentOptions,
  PaymentSummary,
  VerifyPaymentInput,
} from "../../types/payment.types";
import { nextInvoiceNumber, nextReceiptNumber } from "../../utils/code-generator";
import { PaginationMeta, buildPaginationMeta, resolvePagination } from "../../utils/pagination";
import { retryOnUnique } from "../../utils/retry";
import { blankToNull } from "../../utils/value";
import { paymentDetailInclude, paymentListInclude, toPaymentDetail, toPaymentItem } from "./payment.mapper";
import {
  buildInvoiceIssuedNotification,
  buildPaymentVerifiedNotification,
  createPaymentNotification,
} from "./payment.notifications";
import { assertCanIssue, assertCanVerify, assertInstallmentsMatchAmount, calculateVerification } from "./payment.policy";

type Tx = Prisma.TransactionClient;

interface HistoryEntry {
  oldStatus: PaymentStatus | null;
  newStatus: PaymentStatus;
  oldAmountPaid?: Prisma.Decimal;
  newAmountPaid?: Prisma.Decimal;
  amountChanged?: Prisma.Decimal;
  notes: string;
}

function buildWhere({ search, status, invoiceState }: PaymentFilters): Prisma.PaymentWhereInput {
  return {
    ...(status ? { status } : {}),
    ...(invoiceState === "draft" ? { issuedAt: null } : {}),
    ...(invoiceState === "issued" ? { issuedAt: { not: null } } : {}),
    ...(search
      ? {
          OR: [
            { invoiceNumber: { contains: search } },
            { registration: { registrationCode: { contains: search } } },
            { registration: { user: { name: { contains: search } } } },
            { registration: { user: { email: { contains: search } } } },
          ],
        }
      : {}),
  };
}

async function recordHistory(tx: Tx, paymentId: number, adminId: number, entry: HistoryEntry): Promise<void> {
  await tx.paymentHistory.create({ data: { paymentId, changedBy: adminId, ...entry } });
}

function joinNotes(...parts: (string | null | undefined)[]): string {
  return parts.filter(Boolean).join(" — ");
}

async function loadDetail(db: Tx | typeof prisma, id: number): Promise<PaymentDetail> {
  const payment = await db.payment.findUniqueOrThrow({ where: { id }, include: paymentDetailInclude });
  return toPaymentDetail(payment);
}

export async function getSummary(): Promise<PaymentSummary> {
  const [totalInvoices, drafts, outstanding, paid, collected] = await Promise.all([
    prisma.payment.count(),
    prisma.payment.count({ where: { issuedAt: null } }),
    prisma.payment.count({ where: { issuedAt: { not: null }, status: { notIn: SETTLED_PAYMENT_STATUSES } } }),
    prisma.payment.count({ where: { status: "paid" } }),
    prisma.payment.aggregate({ _sum: { amountPaid: true } }),
  ]);

  return { totalInvoices, drafts, outstanding, paid, totalCollected: (collected._sum.amountPaid ?? 0).toString() };
}

export function getOptions(): PaymentOptions {
  return { statuses: Object.values(PaymentStatus), invoiceStates: [...INVOICE_STATE_VALUES] };
}

export async function listPayments(
  filters: PaymentFilters
): Promise<{ items: PaymentItem[]; meta: PaginationMeta }> {
  const { page, limit, skip, take } = resolvePagination(filters);
  const where = buildWhere(filters);

  const [total, payments] = await Promise.all([
    prisma.payment.count({ where }),
    prisma.payment.findMany({
      where,
      include: paymentListInclude,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      skip,
      take,
    }),
  ]);

  return { items: payments.map(toPaymentItem), meta: buildPaginationMeta(total, page, limit) };
}

export async function getPaymentById(id: number): Promise<PaymentDetail> {
  const payment = await prisma.payment.findUnique({ where: { id }, include: paymentDetailInclude });
  if (!payment) throw PaymentErrors.notFound();

  return toPaymentDetail(payment);
}

export async function createInvoice(input: CreateInvoiceInput, adminId: number): Promise<PaymentDetail> {
  const { registrationId, amount, installmentAmounts } = input;
  assertInstallmentsMatchAmount(amount, installmentAmounts);

  const dueDate = blankToNull(input.dueDate);
  const notes = blankToNull(input.notes);

  return retryOnUnique(
    () =>
      prisma.$transaction(async (tx) => {
        const registration = await tx.registration.findUnique({ where: { id: registrationId }, select: { id: true } });
        if (!registration) throw PaymentErrors.registrationNotFound();

        const created = await tx.payment.create({
          data: {
            registrationId,
            invoiceNumber: await nextInvoiceNumber(tx),
            amount,
            dueDate,
            nextDueDate: dueDate,
            notes,
            isManualInvoice: true,
            ...(installmentAmounts?.length ? { installmentAmounts } : {}),
          },
        });

        await recordHistory(tx, created.id, adminId, {
          oldStatus: null,
          newStatus: created.status,
          notes: "Tagihan dibuat (draft)",
        });

        return loadDetail(tx, created.id);
      }),
    { onExhausted: PaymentErrors.codeGenerationFailed }
  );
}

export async function issueInvoice(id: number, input: IssueInvoiceInput, adminId: number): Promise<PaymentDetail> {
  return prisma.$transaction(async (tx) => {
    const payment = await tx.payment.findUnique({ where: { id }, include: { registration: { select: { userId: true } } } });
    if (!payment) throw PaymentErrors.notFound();
    assertCanIssue(payment);

    const dueDate = blankToNull(input.dueDate) ?? payment.dueDate;
    const { count } = await tx.payment.updateMany({
      where: { id, issuedAt: null },
      data: { issuedAt: new Date(), dueDate, nextDueDate: dueDate },
    });
    if (count === 0) throw PaymentErrors.alreadyIssued();

    await recordHistory(tx, id, adminId, {
      oldStatus: payment.status,
      newStatus: payment.status,
      notes: "Tagihan diterbitkan",
    });
    await createPaymentNotification(
      tx,
      payment.registration?.userId,
      id,
      buildInvoiceIssuedNotification({ invoiceNumber: payment.invoiceNumber, amount: payment.amount, dueDate })
    );

    return loadDetail(tx, id);
  });
}

export async function verifyPayment(id: number, input: VerifyPaymentInput, adminId: number): Promise<PaymentDetail> {
  const verify = () =>
    prisma.$transaction(async (tx) => {
      const payment = await tx.payment.findUnique({
        where: { id },
        include: { registration: { select: { userId: true } } },
      });
      if (!payment) throw PaymentErrors.notFound();
      assertCanVerify(payment);

      const result = calculateVerification(payment);
      const receiptNumber = await nextReceiptNumber(tx);
      const now = new Date();

      const { count } = await tx.payment.updateMany({
        where: { id, updatedAt: payment.updatedAt },
        data: {
          status: result.status,
          amountPaid: result.amountPaid,
          currentInstallmentNumber: result.currentInstallmentNumber,
          nextDueDate: result.settled ? null : (blankToNull(input.nextDueDate) ?? payment.nextDueDate),
          receiptNumber,
          verifiedBy: adminId,
          verifiedAt: now,
        },
      });
      if (count === 0) throw PaymentErrors.concurrentUpdate();

      await recordHistory(tx, id, adminId, {
        oldStatus: payment.status,
        newStatus: result.status,
        oldAmountPaid: payment.amountPaid,
        newAmountPaid: result.amountPaid,
        amountChanged: result.amountChanged,
        notes: joinNotes(`Pembayaran diverifikasi, kwitansi ${receiptNumber}`, blankToNull(input.notes)),
      });
      await createPaymentNotification(
        tx,
        payment.registration?.userId,
        id,
        buildPaymentVerifiedNotification(payment.invoiceNumber, result)
      );

      return loadDetail(tx, id);
    });

  return retryOnUnique(verify, { onExhausted: PaymentErrors.codeGenerationFailed });
}