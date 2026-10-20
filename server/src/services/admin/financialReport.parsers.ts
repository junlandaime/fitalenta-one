import { PaymentMethod, PaymentStatus } from "../../../generated/prisma/client";
import { PAYMENT_LIMITS } from "../../config/payment.config";
import { PAYMENT_METHOD_LABELS, PAYMENT_STATUS_LABELS } from "../../config/financial-report.config";
import { RawCell } from "./financialReport.excel";
import { ParsedTermin, parseTerminText } from "./financialReport.termin";

export type Parsed<T> = { ok: true; value: T | null } | { ok: false; message: string };

const JAKARTA_OFFSET_MS = 7 * 3_600_000;
const TEXT_MAX_LENGTH = 100;

const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");
const blank = <T>(): Parsed<T> => ({ ok: true, value: null });
const fail = <T>(message: string): Parsed<T> => ({ ok: false, message });

function buildLookup<T extends string>(labels: Record<T, string>, aliases: Record<string, T> = {}): Map<string, T> {
  const lookup = new Map<string, T>();
  (Object.entries(labels) as [T, string][]).forEach(([key, label]) => {
    lookup.set(normalize(key), key);
    lookup.set(normalize(label), key);
  });
  Object.entries(aliases).forEach(([alias, key]) => lookup.set(normalize(alias), key));
  return lookup;
}

const STATUS_LOOKUP = buildLookup<PaymentStatus>(PAYMENT_STATUS_LABELS, { batal: "cancelled", terlambat: "overdue" });
const METHOD_LOOKUP = buildLookup<PaymentMethod>(PAYMENT_METHOD_LABELS, { tf: "transfer", kredit: "credit_card" });

export function parseText(cell: RawCell, label: string, maxLength = TEXT_MAX_LENGTH): Parsed<string> {
  if (cell === null) return blank();
  if (cell instanceof Date) return fail(`${label} harus berupa teks`);

  const text = String(cell).trim();
  if (text === "") return blank();
  if (text.length > maxLength) return fail(`${label} maksimal ${maxLength} karakter`);
  return { ok: true, value: text };
}

export function parseStatus(cell: RawCell): Parsed<PaymentStatus> {
  if (cell === null) return blank();
  const status = typeof cell === "string" ? STATUS_LOOKUP.get(normalize(cell)) : undefined;
  if (!status) return fail(`Status tidak dikenali, gunakan salah satu: ${Object.values(PAYMENT_STATUS_LABELS).join(", ")}`);
  return { ok: true, value: status };
}

export function parseTermin(cell: RawCell): Parsed<ParsedTermin> {
  if (cell === null) return blank();
  if (typeof cell !== "string") return fail('Termin harus berupa teks, contoh: "Tunai" atau "Cicilan 2/4"');

  const parsed = parseTerminText(cell);
  return parsed.ok ? { ok: true, value: parsed.value } : fail(parsed.message);
}

export function parseMethod(cell: RawCell): Parsed<PaymentMethod> {
  if (cell === null) return blank();
  const method = typeof cell === "string" ? METHOD_LOOKUP.get(normalize(cell)) : undefined;
  if (!method) {
    return fail(`Metode pembayaran tidak dikenali, gunakan salah satu: ${Object.values(PAYMENT_METHOD_LABELS).join(", ")}`);
  }
  return { ok: true, value: method };
}

function parseNumberText(text: string): number {
  const cleaned = text.replace(/rp/gi, "").replace(/\s/g, "");
  if (/^\d{1,3}(\.\d{3})+(,\d+)?$/.test(cleaned)) return Number(cleaned.replace(/\./g, "").replace(",", "."));
  if (/^\d{1,3}(,\d{3})+(\.\d+)?$/.test(cleaned)) return Number(cleaned.replace(/,/g, ""));
  return Number(cleaned.replace(",", "."));
}

export function parseMoney(cell: RawCell, label: string): Parsed<number> {
  if (cell === null) return blank();
  if (cell instanceof Date) return fail(`${label} harus berupa angka`);

  const value = typeof cell === "number" ? cell : parseNumberText(cell);
  if (!Number.isFinite(value)) return fail(`${label} harus berupa angka`);
  if (value < 0 || value > PAYMENT_LIMITS.amountMax) {
    return fail(`${label} harus antara 0 dan ${PAYMENT_LIMITS.amountMax.toLocaleString("id-ID")}`);
  }
  return { ok: true, value: Math.round(value * 100) / 100 };
}

const ISO_DATE = /^(\d{4})-(\d{1,2})-(\d{1,2})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?)?$/;
const LOCAL_DATE = /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/;

/** Waktu tanpa zona pada file dianggap waktu WIB. */
function fromWallClock(y: number, m: number, d: number, hh = 0, mm = 0, ss = 0): Date | null {
  const utc = new Date(Date.UTC(y, m - 1, d, hh, mm, ss));
  const valid =
    utc.getUTCFullYear() === y &&
    utc.getUTCMonth() === m - 1 &&
    utc.getUTCDate() === d &&
    hh < 24 &&
    mm < 60 &&
    ss < 60;
  return valid ? new Date(utc.getTime() - JAKARTA_OFFSET_MS) : null;
}

export function parseDate(cell: RawCell, label: string): Parsed<Date> {
  if (cell === null) return blank();
  if (cell instanceof Date) {
    return Number.isNaN(cell.getTime())
      ? fail(`${label} tidak valid`)
      : { ok: true, value: new Date(cell.getTime() - JAKARTA_OFFSET_MS) };
  }

  if (typeof cell === "string") {
    const iso = ISO_DATE.exec(cell);
    const local = iso ? null : LOCAL_DATE.exec(cell);
    const parts = iso
      ? [iso[1], iso[2], iso[3], iso[4], iso[5], iso[6]]
      : local
        ? [local[3], local[2], local[1], local[4], local[5], local[6]]
        : null;

    if (parts) {
      const [y, m, d, hh, mm, ss] = parts.map((part) => (part === undefined ? undefined : Number(part)));
      const date = fromWallClock(y!, m!, d!, hh, mm, ss);
      if (date) return { ok: true, value: date };
    }
  }

  return fail(`${label} harus berformat YYYY-MM-DD atau DD/MM/YYYY`);
}

export const normalizeName = (value: string) => value.trim().toLowerCase().replace(/\s+/g, " ");