import { Request, Response } from "express";
import type ExcelJS from "exceljs";
import { matchedData } from "express-validator";
import { XLSX_MIME } from "../../config/financial-report.config";
import { FinancialReportErrors } from "../../errors/financialReport.errors";
import { importReport } from "../../services/admin/financialReport.import";
import { buildReportWorkbook, buildTemplateWorkbook } from "../../services/admin/financialReport.excel";
import * as reportService from "../../services/admin/financialReport.service";
import { ReportFilters } from "../../types/financial-report.types";

const JAKARTA_OFFSET_MS = 7 * 3_600_000;

const todayStamp = () => new Date(Date.now() + JAKARTA_OFFSET_MS).toISOString().slice(0, 10).replace(/-/g, "");

async function sendWorkbook(res: Response, filename: string, workbook: ExcelJS.Workbook) {
  res.setHeader("Content-Type", XLSX_MIME);
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.setHeader("Cache-Control", "private, no-store");
  await workbook.xlsx.write(res);
  res.end();
}

export async function index(req: Request, res: Response) {
  const { items, meta } = await reportService.listReport(matchedData<ReportFilters>(req));
  return res.json({ success: true, data: items, meta });
}

export async function summary(req: Request, res: Response) {
  const data = await reportService.getReportSummary(matchedData<ReportFilters>(req));
  return res.json({ success: true, data });
}

export async function exportXlsx(req: Request, res: Response) {
  const rows = await reportService.listReportForExport(matchedData<ReportFilters>(req));
  return sendWorkbook(res, `laporan-keuangan-${todayStamp()}.xlsx`, buildReportWorkbook(rows));
}

export async function template(_req: Request, res: Response) {
  return sendWorkbook(res, "template-laporan-keuangan-fitalenta.xlsx", buildTemplateWorkbook());
}

export async function importXlsx(req: Request, res: Response) {
  if (!req.file) throw FinancialReportErrors.fileRequired();

  const { dryRun = false } = matchedData<{ dryRun?: boolean }>(req);
  const data = await importReport(req.file.buffer, req.user!.userId, dryRun);

  const message = dryRun
    ? "Pemeriksaan file selesai"
    : data.committed
      ? "Impor laporan keuangan berhasil"
      : "Impor dibatalkan karena ada data yang tidak valid";
  return res.json({ success: true, message, data });
}