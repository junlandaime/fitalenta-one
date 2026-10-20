import ExcelJS from "exceljs";
import {
  IMPORT_LIMITS,
  PAYMENT_METHOD_LABELS,
  PAYMENT_STATUS_LABELS,
  REPORT_COLUMNS,
  REPORT_HEADER_FILL,
  REPORT_INSTRUCTION_SHEET_NAME,
  REPORT_REQUIRED_COLUMNS,
  REPORT_SHEET_NAME,
  ReportColumnKey,
} from "../../config/financial-report.config";
import { FinancialReportErrors } from "../../errors/financialReport.errors";
import { ReportRow } from "../../types/financial-report.types";

const JAKARTA_OFFSET_MS = 7 * 3_600_000;

export type RawCell = string | number | Date | null;
export interface RawImportRow {
  rowNumber: number;
  cells: Record<ReportColumnKey, RawCell>;
}

const toExcelDate = (date: Date) => new Date(date.getTime() + JAKARTA_OFFSET_MS);

const normalizeHeader = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");

function createWorkbook(): { workbook: ExcelJS.Workbook; sheet: ExcelJS.Worksheet } {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Fitalenta";
  workbook.created = new Date();

  const sheet = workbook.addWorksheet(REPORT_SHEET_NAME, { views: [{ state: "frozen", ySplit: 1 }] });
  sheet.columns = REPORT_COLUMNS.map(({ key, header, width }) => ({ key, header, width }));

  const header = sheet.getRow(1);
  header.font = { bold: true };
  header.alignment = { vertical: "middle" };
  header.height = 20;
  header.eachCell((cell) => {
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: REPORT_HEADER_FILL } };
  });

  sheet.getColumn("amount").numFmt = "#,##0";
  sheet.getColumn("amountPaid").numFmt = "#,##0";
  sheet.getColumn("paymentDate").numFmt = "yyyy-mm-dd";
  sheet.getColumn("createdAt").numFmt = "yyyy-mm-dd hh:mm";
  sheet.getColumn("no").alignment = { horizontal: "center" };

  return { workbook, sheet };
}

export function buildReportWorkbook(rows: ReportRow[]): ExcelJS.Workbook {
  const { workbook, sheet } = createWorkbook();

  rows.forEach((row, index) => {
    sheet.addRow({
      no: index + 1,
      invoiceNumber: row.invoiceNumber,
      receiptNumber: row.receiptNumber,
      participantName: row.participantName,
      email: row.email,
      program: row.program,
      amount: Number(row.amount),
      amountPaid: Number(row.amountPaid),
      status: PAYMENT_STATUS_LABELS[row.status],
      termin: row.termin.label,
      paymentMethod: PAYMENT_METHOD_LABELS[row.paymentMethod],
      paymentDate: row.paymentDate ? toExcelDate(row.paymentDate) : null,
      createdAt: toExcelDate(row.createdAt),
    });
  });

  sheet.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: REPORT_COLUMNS.length } };
  return workbook;
}

const INSTRUCTIONS: [string, string][] = [
  ["No", "Opsional, diabaikan saat impor."],
  ["Invoice Number", "Opsional. Jika sudah ada di sistem, data tagihan diperbarui. Jika kosong, nomor dibuat otomatis."],
  ["Receipt Number", "Opsional. Harus unik. Jika kosong pada tagihan yang sudah ada, nomor lama dipertahankan."],
  ["Nama Peserta", "Opsional, hanya sebagai referensi. Peserta dicocokkan lewat Email."],
  ["Email", "WAJIB. Email akun peserta yang sudah terdaftar."],
  ["Program", "WAJIB. Nama program persis seperti di sistem; peserta harus sudah mendaftar ke program tersebut."],
  ["Amount", "WAJIB. Total tagihan dalam rupiah, contoh: 16000000."],
  ["Amount Paid", "Opsional. Jumlah yang sudah dibayar. Default 0 untuk data baru."],
  ["Status", `Opsional. Pilihan: ${Object.values(PAYMENT_STATUS_LABELS).join(", ")}.`],
  [
    "Termin",
    'Opsional. Isi "Tunai" untuk pembayaran sekali bayar, atau "Cicilan 2" / "Cicilan 2/4" (cicilan ke-2 dari 4) untuk pembayaran bertahap. Harus sesuai dengan Status dan Amount Paid. Jika Status kosong, status Cicilan diturunkan dari Termin. Total termin hanya untuk keterangan dan tidak disimpan.',
  ],
  ["Payment Method", `Opsional. Pilihan: ${Object.values(PAYMENT_METHOD_LABELS).join(", ")}. Default Transfer.`],
  ["Payment Date", "Opsional. Format YYYY-MM-DD atau DD/MM/YYYY."],
  ["Created At", "Opsional. Tanggal tagihan dibuat; default hari impor. Tidak mengubah tagihan yang sudah ada."],
];

export function buildTemplateWorkbook(): ExcelJS.Workbook {
  const { workbook, sheet } = createWorkbook();

  const statusList = `"${Object.values(PAYMENT_STATUS_LABELS).join(",")}"`;
  const methodList = `"${Object.values(PAYMENT_METHOD_LABELS).join(",")}"`;
  for (let row = 2; row <= IMPORT_LIMITS.maxRows + 1; row++) {
    sheet.getCell(row, REPORT_COLUMNS.findIndex((c) => c.key === "status") + 1).dataValidation = {
      type: "list",
      allowBlank: true,
      formulae: [statusList],
    };
    sheet.getCell(row, REPORT_COLUMNS.findIndex((c) => c.key === "paymentMethod") + 1).dataValidation = {
      type: "list",
      allowBlank: true,
      formulae: [methodList],
    };
  }

  const guide = workbook.addWorksheet(REPORT_INSTRUCTION_SHEET_NAME);
  guide.columns = [
    { header: "Kolom", key: "column", width: 20 },
    { header: "Keterangan", key: "note", width: 100 },
  ];
  guide.getRow(1).font = { bold: true };
  INSTRUCTIONS.forEach(([column, note]) => guide.addRow({ column, note }));
  guide.addRow({});
  guide.addRow({
    column: "Catatan",
    note: `Maksimal ${IMPORT_LIMITS.maxRows} baris per impor. Jika ada satu baris yang tidak valid, seluruh impor dibatalkan.`,
  });

  return workbook;
}

function unwrapCell(value: ExcelJS.CellValue): RawCell {
  if (value === null || value === undefined) return null;
  if (value instanceof Date || typeof value === "number") return value;
  if (typeof value === "boolean") return String(value);
  if (typeof value === "string") return value.trim() === "" ? null : value.trim();

  const object = value as unknown as Record<string, unknown>;
  if (Array.isArray(object.richText)) {
    const text = (object.richText as { text?: string }[]).map((part) => part.text ?? "").join("").trim();
    return text === "" ? null : text;
  }
  if ("result" in object) return unwrapCell(object.result as ExcelJS.CellValue);
  if ("text" in object) return unwrapCell(object.text as ExcelJS.CellValue);
  return null;
}

export async function readImportSheet(buffer: Buffer): Promise<RawImportRow[]> {
  const workbook = new ExcelJS.Workbook();
  try {
    await workbook.xlsx.load(buffer as unknown as ExcelJS.Buffer);
  } catch {
    throw FinancialReportErrors.unreadableFile();
  }

  const sheet = workbook.getWorksheet(REPORT_SHEET_NAME) ?? workbook.worksheets[0];
  if (!sheet) throw FinancialReportErrors.emptySheet();

  const columnIndex = new Map<ReportColumnKey, number>();
  const headerByNormalized = new Map(REPORT_COLUMNS.map((column) => [normalizeHeader(column.header), column.key]));
  sheet.getRow(1).eachCell((cell, colNumber) => {
    const text = unwrapCell(cell.value);
    const key = typeof text === "string" ? headerByNormalized.get(normalizeHeader(text)) : undefined;
    if (key && !columnIndex.has(key)) columnIndex.set(key, colNumber);
  });

  const missing = REPORT_REQUIRED_COLUMNS.filter((key) => !columnIndex.has(key));
  if (missing.length > 0) {
    throw FinancialReportErrors.missingColumns(
      missing.map((key) => REPORT_COLUMNS.find((column) => column.key === key)!.header)
    );
  }

  const rows: RawImportRow[] = [];
  for (let rowNumber = 2; rowNumber <= sheet.rowCount; rowNumber++) {
    const row = sheet.getRow(rowNumber);
    const cells = {} as Record<ReportColumnKey, RawCell>;
    let hasData = false;

    for (const { key } of REPORT_COLUMNS) {
      const index = columnIndex.get(key);
      cells[key] = index ? unwrapCell(row.getCell(index).value) : null;
      if (key !== "no" && cells[key] !== null) hasData = true;
    }

    if (!hasData) continue;
    rows.push({ rowNumber, cells });
    if (rows.length > IMPORT_LIMITS.maxRows) throw FinancialReportErrors.tooManyRows(IMPORT_LIMITS.maxRows);
  }

  if (rows.length === 0) throw FinancialReportErrors.emptySheet();
  return rows;
}