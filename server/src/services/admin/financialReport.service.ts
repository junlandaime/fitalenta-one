import prisma from "../../config/prisma";
import { Prisma } from "../../../generated/prisma/client";
import { EXPORT_MAX_ROWS } from "../../config/financial-report.config";
import { FinancialReportErrors } from "../../errors/financialReport.errors";
import { ReportFilters, ReportRow, ReportSummary } from "../../types/financial-report.types";
import { PaginationMeta, buildPaginationMeta, resolvePagination } from "../../utils/pagination";
import { resolveTermin, terminWhere } from "./financialReport.termin";

const JAKARTA_OFFSET_MS = 7 * 3_600_000;
const DAY_MS = 86_400_000;

const reportInclude = {
  registration: {
    select: {
      user: { select: { name: true, email: true } },
      program: { select: { name: true } },
    },
  },
} satisfies Prisma.PaymentInclude;

type ReportRecord = Prisma.PaymentGetPayload<{ include: typeof reportInclude }>;

function toReportRow(payment: ReportRecord): ReportRow {
  return {
    id: payment.id,
    invoiceNumber: payment.invoiceNumber,
    receiptNumber: payment.receiptNumber,
    participantName: payment.registration?.user?.name ?? "",
    email: payment.registration?.user?.email ?? "",
    program: payment.registration?.program?.name ?? "",
    amount: payment.amount.toString(),
    amountPaid: payment.amountPaid.toString(),
    status: payment.status,
    termin: resolveTermin(payment),
    paymentMethod: payment.paymentMethod,
    paymentDate: payment.paymentDate,
    createdAt: payment.createdAt,
  };
}

function assertDateRange({ dateFrom, dateTo }: ReportFilters): void {
  if (dateFrom && dateTo && dateFrom > dateTo) throw FinancialReportErrors.invalidDateRange();
}

function buildWhere(filters: ReportFilters): Prisma.PaymentWhereInput {
  const { search, status, termin, paymentMethod, dateFrom, dateTo } = filters;
  const createdAt: Prisma.DateTimeFilter = {};
  if (dateFrom) createdAt.gte = new Date(dateFrom.getTime() - JAKARTA_OFFSET_MS);
  if (dateTo) createdAt.lt = new Date(dateTo.getTime() + DAY_MS - JAKARTA_OFFSET_MS);

  return {
    issuedAt: { not: null },
    ...(status ? { status } : {}),
    ...(termin ? { AND: [terminWhere(termin)] } : {}),
    ...(paymentMethod ? { paymentMethod } : {}),
    ...(dateFrom || dateTo ? { createdAt } : {}),
    ...(search
      ? {
          OR: [
            { invoiceNumber: { contains: search } },
            { receiptNumber: { contains: search } },
            { registration: { registrationCode: { contains: search } } },
            { registration: { user: { name: { contains: search } } } },
            { registration: { user: { email: { contains: search } } } },
            { registration: { program: { name: { contains: search } } } },
          ],
        }
      : {}),
  };
}

const orderBy: Prisma.PaymentOrderByWithRelationInput[] = [{ createdAt: "desc" }, { id: "desc" }];

export async function listReport(filters: ReportFilters): Promise<{ items: ReportRow[]; meta: PaginationMeta }> {
  assertDateRange(filters);
  const { page, limit, skip, take } = resolvePagination(filters);
  const where = buildWhere(filters);

  const [total, payments] = await Promise.all([
    prisma.payment.count({ where }),
    prisma.payment.findMany({ where, include: reportInclude, orderBy, skip, take }),
  ]);

  return { items: payments.map(toReportRow), meta: buildPaginationMeta(total, page, limit) };
}

export async function getReportSummary(filters: ReportFilters): Promise<ReportSummary> {
  assertDateRange(filters);
  const where = buildWhere(filters);
  const active: Prisma.PaymentWhereInput = { AND: [where, { status: { not: "cancelled" } }] };

  const [totalRecords, paidCount, cashCount, installmentCount, all, billable] = await Promise.all([
    prisma.payment.count({ where }),
    prisma.payment.count({ where: { AND: [where, { status: "paid" }] } }),
    prisma.payment.count({ where: { AND: [where, terminWhere("cash")] } }),
    prisma.payment.count({ where: { AND: [where, terminWhere("installment")] } }),
    prisma.payment.aggregate({ where, _sum: { amountPaid: true } }),
    prisma.payment.aggregate({ where: active, _sum: { amount: true, amountPaid: true } }),
  ]);

  const totalBilled = new Prisma.Decimal(billable._sum.amount ?? 0);
  const billablePaid = new Prisma.Decimal(billable._sum.amountPaid ?? 0);

  return {
    totalRecords,
    paidCount,
    cashCount,
    installmentCount,
    totalBilled: totalBilled.toString(),
    totalCollected: new Prisma.Decimal(all._sum.amountPaid ?? 0).toString(),
    totalOutstanding: totalBilled.minus(billablePaid).toString(),
  };
}

export async function listReportForExport(filters: ReportFilters): Promise<ReportRow[]> {
  assertDateRange(filters);
  const where = buildWhere(filters);

  const total = await prisma.payment.count({ where });
  if (total > EXPORT_MAX_ROWS) throw FinancialReportErrors.tooManyExportRows(EXPORT_MAX_ROWS);

  const payments = await prisma.payment.findMany({ where, include: reportInclude, orderBy });
  return payments.map(toReportRow);
}