import { Prisma } from "../../generated/prisma/client";

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Asia/Jakarta",
});

const ROMAN_MONTHS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
const JAKARTA_OFFSET_MS = 7 * 3_600_000;

export function formatRupiah(value: Prisma.Decimal | number | string): string {
  return rupiahFormatter.format(Number(value));
}

export function formatDate(value: Date | string | null | undefined): string {
  if (!value) return "-";
  return dateFormatter.format(typeof value === "string" ? new Date(value) : value);
}

export function getRomanMonthYear(date: Date): { roman: string; year: number } {
  const local = new Date(date.getTime() + JAKARTA_OFFSET_MS);
  return { roman: ROMAN_MONTHS[local.getUTCMonth()], year: local.getUTCFullYear() };
}