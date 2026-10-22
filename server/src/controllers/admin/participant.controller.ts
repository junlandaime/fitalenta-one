import { Request, Response, NextFunction } from "express";
import type ExcelJS from "exceljs";
import { matchedData } from "express-validator";
import { XLSX_MIME } from "../../config/participant.config";
import { buildParticipantTemplateWorkbook, buildParticipantWorkbook } from "../../services/admin/participant.excel";
import { exportParticipants, importParticipants, ParticipantExportFilters } from "../../services/admin/participant.service";
import { parseParticipantImportFile } from "../../services/admin/participant.import";

const JAKARTA_OFFSET_MS = 7 * 3_600_000;
const todayStamp = () => new Date(Date.now() + JAKARTA_OFFSET_MS).toISOString().slice(0, 10).replace(/-/g, "");

async function sendWorkbook(res: Response, filename: string, workbook: ExcelJS.Workbook) {
  res.setHeader("Content-Type", XLSX_MIME);
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.setHeader("Cache-Control", "private, no-store");
  await workbook.xlsx.write(res);
  res.end();
}

export async function exportXlsx(req: Request, res: Response, next: NextFunction) {
  try {
    const filters = matchedData<ParticipantExportFilters>(req);
    const rows = await exportParticipants(filters);
    return await sendWorkbook(res, `data-peserta-${todayStamp()}.xlsx`, buildParticipantWorkbook(rows));
  } catch (err) {
    next(err);
  }
}

export async function template(_req: Request, res: Response, next: NextFunction) {
  try {
    return await sendWorkbook(res, "template-data-peserta-fitalenta.xlsx", buildParticipantTemplateWorkbook());
  } catch (err) {
    next(err);
  }
}

export async function importXlsx(req: Request, res: Response) {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "File wajib diunggah." });
  }

  const { dryRun = false } = matchedData<{ dryRun?: boolean }>(req);

  let parseResult;
  try {
    parseResult = await parseParticipantImportFile(req.file.buffer);
  } catch (err: any) {
    return res.status(422).json({ success: false, message: err.message });
  }

  if (parseResult.parseErrors.length > 0) {
    return res.status(422).json({
      success: false,
      message: "Terdapat kesalahan pada format data di file.",
      data: { committed: false, errors: parseResult.parseErrors, success: 0 },
    });
  }

  const result = await importParticipants(parseResult.rows, dryRun);

  const message = dryRun
    ? "Pemeriksaan file selesai"
    : result.committed
      ? `${result.success} data peserta berhasil diimpor`
      : "Impor dibatalkan karena ada data yang tidak valid";

  return res.status(result.errors.length > 0 ? 422 : 200).json({ success: result.errors.length === 0, message, data: result });
}
