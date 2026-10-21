export { cn } from "cn";

const TZ = "Asia/Jakarta";
const hasTime = (iso: string) => iso.length > 10;

function toValidDate(iso?: string | null): Date | null {
    if (!iso) return null;
    const date = new Date(iso);
    return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDate(iso?: string | null, locale = "en-US") {
    const date = toValidDate(iso);
    if (!date) return "-";
    return new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: TZ,
    }).format(date);
}

export function formatTime(iso: string) {
    if (!hasTime(iso)) return undefined;
    const time = new Intl.DateTimeFormat("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
        timeZone: TZ,
    })
        .format(new Date(iso))
        .replace(".", ":");
    return `${time} WIB`;
}

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 60 * 60 * 24 * 365],
    ["month", 60 * 60 * 24 * 30],
    ["day", 60 * 60 * 24],
    ["hour", 60 * 60],
    ["minute", 60],
];

export function timeAgo(iso: string, locale = "en") {
    const diff = (new Date(iso).getTime() - Date.now()) / 1000;
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "always" });
    for (const [unit, secs] of UNITS) {
        if (Math.abs(diff) >= secs) return rtf.format(Math.trunc(diff / secs), unit);
    }
    return rtf.format(0, "minute");
}

export function isPastEvent(iso: string) {
    const date = new Date(iso);
    if (!hasTime(iso)) date.setHours(23, 59, 59, 999);
    return date.getTime() < Date.now();
}

export function stripHtml(html: string) {
    return html.replace(/<[^>]*>/g, " ").replace(/[ \t]+/g, " ").trim();
}

const ASSET_URL = process.env.NEXT_PUBLIC_ASSET_URL ?? "";

export function imageUrl(image?: string | null): string | undefined {
    if (!image) return undefined;
    if (/^https?:\/\//.test(image)) {
        try {
            return encodeURI(decodeURI(image));
        } catch {
            return encodeURI(image);
        }
    }

    const path = image.startsWith("/") ? image : `/${image}`;
    const fullUrl = ASSET_URL ? `${ASSET_URL}${path}` : path;

    try {
        return encodeURI(decodeURI(fullUrl));
    } catch {
        return encodeURI(fullUrl);
    }
}

export async function safely<T>(fn: () => Promise<T>, fallback: T, label: string): Promise<T> {
    try {
        return await fn();
    } catch (err) {
        console.error(`[${label}] gagal dimuat:`, err);
        return fallback;
    }
}

export function formatIDR(value?: number | string | null) {
    if (value === null || value === undefined || value === "") return "-";
    const number = Number(value);
    if (Number.isNaN(number)) return "-";
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(number);
}

export function toLines(text?: string | null): string[] {
    if (!text) return [];
    return text
        .split(/\r?\n/)
        .map((l) => l.replace(/^\s*(?:[-•*]|\d+[.)])\s+/, "").trim())
        .filter(Boolean);
}
