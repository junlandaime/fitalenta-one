import prisma from "../../config/prisma";
import { PaymentMethod, PaymentStatus, Prisma } from "../../../generated/prisma/client";
import {
  IMPORT_HISTORY_NOTE,
  IMPORT_LIMITS,
  PAYMENT_STATUS_LABELS,
  REPORT_COLUMNS,
  ReportColumnKey,
} from "../../config/financial-report.config";
import { PaymentErrors } from "../../errors/payment.errors";
import { ImportResult, ImportRowError } from "../../types/financial-report.types";
import { nextInvoiceNumber } from "../../utils/code-generator";
import { retryOnUnique } from "../../utils/retry";
import { RawImportRow, readImportSheet } from "./financialReport.excel";
import {
  Parsed,
  normalizeName,
  parseDate,
  parseMethod,
  parseMoney,
  parseStatus,
  parseText,
  parseTermin,
} from "./financialReport.parsers";
import { ParsedTermin, installmentNumberOf } from "./financialReport.termin";

const Decimal = Prisma.Decimal;
const HEADER = Object.fromEntries(REPORT_COLUMNS.map(({ key, header }) => [key, header])) as Record<ReportColumnKey, string>;
const AMOUNT_CHANGED_LIMIT = new Decimal(100_000_000);

interface PreparedRow {
  rowNumber: number;
  invoiceNumber: string | null;
  receiptNumber: string | null;
  email: string;
  programName: string;
  amount: number;
  amountPaid: number | null;
  status: PaymentStatus | null;
  termin: ParsedTermin | null;
  paymentMethod: PaymentMethod | null;
  paymentDate: Date | null;
  createdAt: Date | null;
}

interface PlannedWrite {
  row: PreparedRow;
  registrationId: number;
  paymentId: number | null;
  previous: { status: PaymentStatus; amountPaid: Prisma.Decimal } | null;
  status: PaymentStatus;
  amountPaid: number;
}

type Report = (row: number, field: ReportColumnKey | null, message: string) => void;

const cents = (value: number) => Math.round(value * 100);

function parseRow(raw: RawImportRow, report: Report): PreparedRow | null {
  const { rowNumber, cells } = raw;
  let valid = true;

  const read = <T>(field: ReportColumnKey, parsed: Parsed<T>): T | null => {
    if (parsed.ok) return parsed.value;
    report(rowNumber, field, parsed.message);
    valid = false;
    return null;
  };
  const required = <T>(field: ReportColumnKey, parsed: Parsed<T>): T | null => {
    if (parsed.ok && parsed.value === null) {
      report(rowNumber, field, `${HEADER[field]} wajib diisi`);
      valid = false;
      return null;
    }
    return read(field, parsed);
  };

  const invoiceNumber = read("invoiceNumber", parseText(cells.invoiceNumber, HEADER.invoiceNumber));
  const receiptNumber = read("receiptNumber", parseText(cells.receiptNumber, HEADER.receiptNumber));
  const email = required("email", parseText(cells.email, HEADER.email, 191));
  const programName = required("program", parseText(cells.program, HEADER.program, 191));
  const amount = required("amount", parseMoney(cells.amount, HEADER.amount));
  const amountPaid = read("amountPaid", parseMoney(cells.amountPaid, HEADER.amountPaid));
  const status = read("status", parseStatus(cells.status));
  const termin = read("termin", parseTermin(cells.termin));
  const paymentMethod = read("paymentMethod", parseMethod(cells.paymentMethod));
  const paymentDate = read("paymentDate", parseDate(cells.paymentDate, HEADER.paymentDate));
  const createdAt = read("createdAt", parseDate(cells.createdAt, HEADER.createdAt));

  if (email && !/^\S+@\S+\.\S+$/.test(email)) {
    report(rowNumber, "email", "Format email tidak valid");
    valid = false;
  }
  if (amount !== null && amount <= 0) {
    report(rowNumber, "amount", "Amount harus lebih dari 0");
    valid = false;
  }

  if (!valid || !email || !programName || amount === null) return null;
  return { rowNumber, invoiceNumber, receiptNumber, email, programName, amount, amountPaid, status, termin, paymentMethod, paymentDate, createdAt };
}

function statusFromTermin(termin: ParsedTermin | null, amount: number, amountPaid: number): PaymentStatus | null {
  if (termin?.type !== "installment" || !termin.current) return null;
  if (cents(amountPaid) >= cents(amount)) return "paid";
  if (cents(amountPaid) > 0) return `installment_${termin.current}` as PaymentStatus;
  return null;
}

function checkTermin(termin: ParsedTermin, status: PaymentStatus, hasInstallmentPlan: boolean): string | null {
  const label = PAYMENT_STATUS_LABELS[status];
  const statusNumber = installmentNumberOf(status);

  if (termin.type === "cash") {
    if (statusNumber) return `Termin Tunai tidak sesuai dengan status ${label}`;
    if (hasInstallmentPlan) return "Tagihan ini memakai skema cicilan, Termin tidak boleh Tunai";
    return null;
  }

  if (status === "pending" && termin.current) return `Termin Cicilan ${termin.current} tetapi status ${label}`;
  if (statusNumber && termin.current !== null && termin.current !== statusNumber) {
    return `Termin Cicilan ${termin.current} tidak sesuai dengan status ${label}`;
  }
  if (status === "paid" && termin.total !== null && termin.current !== null && termin.current !== termin.total) {
    return `Status ${label} mensyaratkan cicilan terakhir (${termin.total}/${termin.total})`;
  }
  return null;
}

function checkConsistency(status: PaymentStatus, amount: number, amountPaid: number): string | null {
  const label = PAYMENT_STATUS_LABELS[status];
  if (cents(amountPaid) > cents(amount)) return "Amount Paid tidak boleh melebihi Amount";
  if (status === "paid" && cents(amountPaid) !== cents(amount)) {
    return `Status ${label} mensyaratkan Amount Paid sama dengan Amount`;
  }
  if (status === "pending" && amountPaid > 0) return `Status ${label} tetapi Amount Paid lebih dari 0`;
  if (installmentNumberOf(status) !== null && (amountPaid <= 0 || cents(amountPaid) >= cents(amount))) {
    return `Status ${label} mensyaratkan Amount Paid lebih dari 0 dan kurang dari Amount`;
  }
  return null;
}

async function planWrites(rows: PreparedRow[], report: Report): Promise<PlannedWrite[]> {
  const emails = [...new Set(rows.map((row) => row.email.toLowerCase()))];
  const invoiceNumbers = rows.flatMap((row) => (row.invoiceNumber ? [row.invoiceNumber] : []));
  const receiptNumbers = rows.flatMap((row) => (row.receiptNumber ? [row.receiptNumber] : []));

  const [registrations, payments, receiptOwners] = await Promise.all([
    prisma.registration.findMany({
      where: { user: { email: { in: emails } } },
      select: { id: true, user: { select: { email: true } }, program: { select: { name: true } } },
    }),
    prisma.payment.findMany({
      where: { invoiceNumber: { in: invoiceNumbers } },
      select: {
        id: true,
        invoiceNumber: true,
        registrationId: true,
        status: true,
        amountPaid: true,
        installmentAmounts: true,
      },
    }),
    prisma.payment.findMany({
      where: { receiptNumber: { in: receiptNumbers } },
      select: { invoiceNumber: true, receiptNumber: true },
    }),
  ]);

  const registrationIds = new Map<string, number>();
  for (const { id, user, program } of registrations) {
    if (user && program) registrationIds.set(`${user.email.toLowerCase()}|${normalizeName(program.name)}`, id);
  }
  const existingByInvoice = new Map(payments.map((payment) => [payment.invoiceNumber, payment]));
  const invoiceByReceipt = new Map(receiptOwners.map((payment) => [payment.receiptNumber, payment.invoiceNumber]));

  const seenInvoices = new Map<string, number>();
  const seenReceipts = new Map<string, number>();
  const plan: PlannedWrite[] = [];

  for (const row of rows) {
    const problems = { count: 0 };
    const fail = (field: ReportColumnKey | null, message: string) => {
      problems.count++;
      report(row.rowNumber, field, message);
    };

    if (row.invoiceNumber) {
      const firstRow = seenInvoices.get(row.invoiceNumber);
      if (firstRow) fail("invoiceNumber", `Invoice ${row.invoiceNumber} muncul ganda (sudah ada di baris ${firstRow})`);
      seenInvoices.set(row.invoiceNumber, firstRow ?? row.rowNumber);
    }
    if (row.receiptNumber) {
      const firstRow = seenReceipts.get(row.receiptNumber);
      if (firstRow) fail("receiptNumber", `Receipt ${row.receiptNumber} muncul ganda (sudah ada di baris ${firstRow})`);
      seenReceipts.set(row.receiptNumber, firstRow ?? row.rowNumber);

      const owner = invoiceByReceipt.get(row.receiptNumber);
      if (owner !== undefined && owner !== row.invoiceNumber) {
        fail("receiptNumber", `Receipt ${row.receiptNumber} sudah dipakai oleh invoice ${owner}`);
      }
    }

    const registrationId = registrationIds.get(`${row.email.toLowerCase()}|${normalizeName(row.programName)}`);
    if (!registrationId) {
      fail("email", `Peserta ${row.email} belum terdaftar pada program "${row.programName}"`);
      continue;
    }

    const existing = row.invoiceNumber ? existingByInvoice.get(row.invoiceNumber) : undefined;
    if (existing && existing.registrationId !== registrationId) {
      fail("invoiceNumber", `Invoice ${existing.invoiceNumber} milik peserta atau program lain`);
    }

    const amountPaid = row.amountPaid ?? (existing ? Number(existing.amountPaid.toString()) : 0);
    let status = row.status ?? statusFromTermin(row.termin, row.amount, amountPaid) ?? existing?.status ?? null;
    if (!status) {
      if (cents(amountPaid) === 0) status = "pending";
      else if (cents(amountPaid) >= cents(row.amount)) status = "paid";
      else fail("status", "Status wajib diisi untuk pembayaran sebagian (mis. Cicilan 1)");
    }

    if (status) {
      const problem = checkConsistency(status, row.amount, amountPaid);
      if (problem) fail("amountPaid", problem);

      if (row.termin) {
        const plan = existing?.installmentAmounts;
        const hasPlan = Array.isArray(plan) && plan.length > 0;
        const terminProblem = checkTermin(row.termin, status, hasPlan);
        if (terminProblem) fail("termin", terminProblem);
      }
    }

    if (problems.count > 0 || !status) continue;
    plan.push({
      row,
      registrationId,
      paymentId: existing?.id ?? null,
      previous: existing ? { status: existing.status, amountPaid: existing.amountPaid } : null,
      status,
      amountPaid,
    });
  }

  return plan;
}

async function applyWrites(plan: PlannedWrite[], adminId: number): Promise<{ created: number; updated: number }> {
  const execute = () =>
    prisma.$transaction(
      async (tx) => {
        let created = 0;
        let updated = 0;

        for (const { row, registrationId, paymentId, previous, status, amountPaid } of plan) {
          const installmentNo =
            installmentNumberOf(status) ?? (row.termin?.type === "installment" ? row.termin.current : null);
          const change = new Decimal(amountPaid).minus(previous?.amountPaid ?? 0);
          const safeChange = change.abs().lt(AMOUNT_CHANGED_LIMIT) ? change : null;
          let targetId: number;

          if (paymentId === null) {
            const issuedAt = row.createdAt ?? new Date();
            const payment = await tx.payment.create({
              data: {
                registrationId,
                invoiceNumber: row.invoiceNumber ?? (await nextInvoiceNumber(tx, issuedAt)),
                receiptNumber: row.receiptNumber,
                amount: row.amount,
                amountPaid,
                status,
                paymentMethod: row.paymentMethod ?? "transfer",
                paymentDate: row.paymentDate,
                currentInstallmentNumber: installmentNo ?? 0,
                isManualInvoice: true,
                issuedAt,
                ...(row.createdAt ? { createdAt: row.createdAt } : {}),
              },
            });
            targetId = payment.id;
            created++;
          } else {
            await tx.payment.update({
              where: { id: paymentId },
              data: {
                amount: row.amount,
                amountPaid,
                status,
                ...(row.paymentMethod ? { paymentMethod: row.paymentMethod } : {}),
                ...(row.paymentDate ? { paymentDate: row.paymentDate } : {}),
                ...(row.receiptNumber ? { receiptNumber: row.receiptNumber } : {}),
                ...(installmentNo ? { currentInstallmentNumber: installmentNo } : {}),
              },
            });
            targetId = paymentId;
            updated++;
          }

          await tx.paymentHistory.create({
            data: {
              paymentId: targetId,
              oldStatus: previous?.status ?? null,
              newStatus: status,
              oldAmountPaid: previous?.amountPaid ?? null,
              newAmountPaid: amountPaid,
              amountChanged: safeChange,
              notes: IMPORT_HISTORY_NOTE,
              changedBy: adminId,
            },
          });
        }

        return { created, updated };
      },
      { timeout: IMPORT_LIMITS.transactionTimeoutMs, maxWait: 10_000 }
    );

  return retryOnUnique(execute, { onExhausted: PaymentErrors.codeGenerationFailed });
}

export async function importReport(buffer: Buffer, adminId: number, dryRun: boolean): Promise<ImportResult> {
  const rawRows = await readImportSheet(buffer);
  const errors: ImportRowError[] = [];
  const report: Report = (row, field, message) => errors.push({ row, field: field ? HEADER[field] : null, message });

  const parsed = rawRows.flatMap((raw) => parseRow(raw, report) ?? []);
  const plan = await planWrites(parsed, report);

  const toUpdate = plan.filter((item) => item.paymentId !== null).length;
  const base = {
    dryRun,
    totalRows: rawRows.length,
    toCreate: plan.length - toUpdate,
    toUpdate,
    errorCount: errors.length,
    errors: errors.sort((a, b) => a.row - b.row).slice(0, IMPORT_LIMITS.maxReturnedErrors),
  };

  if (dryRun || errors.length > 0) return { ...base, committed: false, created: 0, updated: 0 };

  const { created, updated } = await applyWrites(plan, adminId);
  return { ...base, committed: true, created, updated };
}