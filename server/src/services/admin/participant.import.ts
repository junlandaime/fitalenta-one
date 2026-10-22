import ExcelJS from "exceljs";
import {
  PARTICIPANT_COLUMNS,
  PARTICIPANT_REQUIRED_COLUMNS,
  IMPORT_PARTICIPANT_LIMITS,
} from "../../config/participant.config";
import { ParticipantImportInput } from "./participant.service";

type RawCell = string | number | Date | null;

function unwrapCell(value: ExcelJS.CellValue): RawCell {
  if (value === null || value === undefined) return null;
  if (value instanceof Date || typeof value === "number") return value;
  if (typeof value === "boolean") return String(value);
  if (typeof value === "string") return value.trim() === "" ? null : value.trim();

  const obj = value as unknown as Record<string, unknown>;
  if (Array.isArray(obj.richText)) {
    const text = (obj.richText as { text?: string }[]).map((p) => p.text ?? "").join("").trim();
    return text === "" ? null : text;
  }
  if ("result" in obj) return unwrapCell(obj.result as ExcelJS.CellValue);
  if ("text" in obj) return unwrapCell(obj.text as ExcelJS.CellValue);
  return null;
}

const normalizeHeader = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");

function cellToString(val: RawCell): string | null {
  if (val === null) return null;
  if (val instanceof Date) return val.toISOString().slice(0, 10);
  if (typeof val === "number") return String(val);
  return val;
}

function cellToDate(val: RawCell): string | null {
  if (val === null) return null;
  if (val instanceof Date) return val.toISOString().slice(0, 10);
  if (typeof val === "string") {
    const ddmmyyyy = val.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (ddmmyyyy) return `${ddmmyyyy[3]}-${ddmmyyyy[2].padStart(2, "0")}-${ddmmyyyy[1].padStart(2, "0")}`;
    return val;
  }
  return null;
}

export interface ImportParseResult {
  rows: ParticipantImportInput[];
  parseErrors: { row: number; reason: string }[];
}

export async function parseParticipantImportFile(buffer: Buffer): Promise<ImportParseResult> {
  const workbook = new ExcelJS.Workbook();
  try {
    await workbook.xlsx.load(buffer as unknown as ExcelJS.Buffer);
  } catch {
    throw new Error("File tidak dapat dibaca. Pastikan format file adalah .xlsx.");
  }

  const sheet = workbook.getWorksheet("Data Peserta") ?? workbook.worksheets[0];
  if (!sheet) throw new Error("Sheet tidak ditemukan di file.");

  // Map headers
  const columnIndex = new Map<string, number>();
  const headerByNormalized = new Map(
    PARTICIPANT_COLUMNS.map((c) => [normalizeHeader(c.header), c.key])
  );
  sheet.getRow(1).eachCell((cell, colNumber) => {
    const text = unwrapCell(cell.value);
    const key = typeof text === "string" ? headerByNormalized.get(normalizeHeader(text)) : undefined;
    if (key && !columnIndex.has(key)) columnIndex.set(key, colNumber);
  });

  // Check required columns
  const missing = PARTICIPANT_REQUIRED_COLUMNS.filter((key) => !columnIndex.has(key));
  if (missing.length > 0) {
    const missingHeaders = missing.map((key) => PARTICIPANT_COLUMNS.find((c) => c.key === key)?.header ?? key);
    throw new Error(`Kolom wajib tidak ditemukan: ${missingHeaders.join(", ")}`);
  }

  const rows: ParticipantImportInput[] = [];
  const parseErrors: { row: number; reason: string }[] = [];

  for (let rowNumber = 2; rowNumber <= sheet.rowCount; rowNumber++) {
    const row = sheet.getRow(rowNumber);
    const getCellVal = (key: string): RawCell => {
      const idx = columnIndex.get(key);
      return idx ? unwrapCell(row.getCell(idx).value) : null;
    };

    const emailRaw = cellToString(getCellVal("email"));
    const programNameRaw = cellToString(getCellVal("programName"));
    const fullNameRaw = cellToString(getCellVal("fullName"));

    // Skip empty rows
    if (!emailRaw && !programNameRaw && !fullNameRaw) continue;

    if (!emailRaw) {
      parseErrors.push({ row: rowNumber, reason: "Email wajib diisi." });
      continue;
    }
    if (!programNameRaw) {
      parseErrors.push({ row: rowNumber, reason: "Nama program wajib diisi." });
      continue;
    }
    if (!fullNameRaw) {
      parseErrors.push({ row: rowNumber, reason: "Nama lengkap wajib diisi." });
      continue;
    }

    const genderRaw = cellToString(getCellVal("gender"));
    const validGenders = ["L", "P", null];
    if (genderRaw && !validGenders.includes(genderRaw.toUpperCase())) {
      parseErrors.push({ row: rowNumber, reason: `Jenis kelamin tidak valid: "${genderRaw}". Gunakan L atau P.` });
      continue;
    }

    rows.push({
      fullName: fullNameRaw,
      email: emailRaw.toLowerCase(),
      phone: cellToString(getCellVal("phone")),
      nik: cellToString(getCellVal("nik")),
      gender: genderRaw ? genderRaw.toUpperCase() : null,
      birthPlace: cellToString(getCellVal("birthPlace")),
      birthDate: cellToDate(getCellVal("birthDate")),
      lastEducation: cellToString(getCellVal("lastEducation")),
      major: cellToString(getCellVal("major")),
      educationInstitution: cellToString(getCellVal("educationInstitution")),
      currentActivity: cellToString(getCellVal("currentActivity")),
      maritalStatus: cellToString(getCellVal("maritalStatus")),
      parentPhone: cellToString(getCellVal("parentPhone")),
      parentRelationship: cellToString(getCellVal("parentRelationship")),
      ktpProvinceName: cellToString(getCellVal("ktpProvinceName")),
      ktpCityName: cellToString(getCellVal("ktpCityName")),
      ktpAddress: cellToString(getCellVal("ktpAddress")),
      domicileProvinceName: cellToString(getCellVal("domicileProvinceName")),
      domicileCityName: cellToString(getCellVal("domicileCityName")),
      domicileAddress: cellToString(getCellVal("domicileAddress")),
      programName: programNameRaw,
    });

    if (rows.length > IMPORT_PARTICIPANT_LIMITS.maxRows) {
      throw new Error(`Jumlah baris melebihi batas maksimal ${IMPORT_PARTICIPANT_LIMITS.maxRows} baris.`);
    }
  }

  if (rows.length === 0 && parseErrors.length === 0) {
    throw new Error("File tidak memiliki data peserta. Pastikan data dimulai dari baris ke-2.");
  }

  return { rows, parseErrors };
}
