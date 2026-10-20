import prisma from "../../config/prisma";
import { Prisma } from "../../../generated/prisma/client";
import { PAYMENT_PROOF_HISTORY_NOTES } from "../../config/payment.config";
import { PaymentErrors } from "../../errors/payment.errors";
import { PaymentDetail } from "../../types/payment.types";
import { MyPaymentDetail, MyPaymentFilters, MyPaymentItem, MyPaymentSummary } from "../../types/userPayment.types";
import { removePublicUpload } from "../../utils/file";
import { PaginationMeta, buildPaginationMeta, resolvePagination } from "../../utils/pagination";
import { paymentDetailInclude, toPaymentDetail } from "../admin/payment.mapper";
import { hasPendingProof } from "../admin/payment.policy";
import {
  myPaymentDetailInclude,
  myPaymentInclude,
  toMyPaymentDetail,
  toMyPaymentItem,
  toPaymentSummary,
} from "./payment.mapper";
import { assertCanUploadProof } from "./payment.policy";

type Tx = Prisma.TransactionClient;

const ownedIssuedPayments = (userId: number): Prisma.PaymentWhereInput => ({
  issuedAt: { not: null },
  registration: { userId },
});

async function loadMyPayment(db: Tx | typeof prisma, userId: number, id: number): Promise<MyPaymentDetail> {
  const payment = await db.payment.findFirst({
    where: { id, ...ownedIssuedPayments(userId) },
    include: myPaymentDetailInclude,
  });
  if (!payment) throw PaymentErrors.notFound();

  return toMyPaymentDetail(payment);
}

export async function getMySummary(userId: number): Promise<MyPaymentSummary> {
  const payments = await prisma.payment.findMany({ where: ownedIssuedPayments(userId) });
  return toPaymentSummary(payments);
}

export async function listMyPayments(
  userId: number,
  filters: MyPaymentFilters
): Promise<{ items: MyPaymentItem[]; meta: PaginationMeta }> {
  const { page, limit, skip, take } = resolvePagination(filters);
  const where: Prisma.PaymentWhereInput = {
    ...ownedIssuedPayments(userId),
    ...(filters.status ? { status: filters.status } : {}),
  };

  const [total, payments] = await Promise.all([
    prisma.payment.count({ where }),
    prisma.payment.findMany({
      where,
      include: myPaymentInclude,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      skip,
      take,
    }),
  ]);

  return { items: payments.map(toMyPaymentItem), meta: buildPaginationMeta(total, page, limit) };
}

export function getMyPayment(userId: number, id: number): Promise<MyPaymentDetail> {
  return loadMyPayment(prisma, userId, id);
}

export async function getMyInvoice(userId: number, id: number): Promise<PaymentDetail> {
  const payment = await prisma.payment.findFirst({
    where: { id, ...ownedIssuedPayments(userId) },
    include: paymentDetailInclude,
  });
  if (!payment) throw PaymentErrors.notFound();

  return toPaymentDetail(payment);
}

export async function submitPaymentProof(userId: number, id: number, proofPath: string): Promise<MyPaymentDetail> {
  const { detail, replacedProof } = await prisma.$transaction(async (tx) => {
    const payment = await tx.payment.findFirst({ where: { id, ...ownedIssuedPayments(userId) } });
    if (!payment) throw PaymentErrors.notFound();
    assertCanUploadProof(payment);

    const replacing = hasPendingProof(payment);
    const { count } = await tx.payment.updateMany({
      where: { id, updatedAt: payment.updatedAt },
      data: { proofImage: proofPath, paymentDate: new Date() },
    });
    if (count === 0) throw PaymentErrors.concurrentUpdate();

    await tx.paymentHistory.create({
      data: {
        paymentId: id,
        changedBy: userId,
        oldStatus: payment.status,
        newStatus: payment.status,
        notes: replacing ? PAYMENT_PROOF_HISTORY_NOTES.replaced : PAYMENT_PROOF_HISTORY_NOTES.uploaded,
      },
    });

    return { detail: await loadMyPayment(tx, userId, id), replacedProof: replacing ? payment.proofImage : null };
  });

  await removePublicUpload(replacedProof);
  return detail;
}