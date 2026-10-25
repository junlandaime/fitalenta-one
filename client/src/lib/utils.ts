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

const HTML_ENTITIES: Record<string, string> = {
    "&nbsp;": " ",
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#39;": "'",
    "&apos;": "'",
    "&mdash;": "—",
    "&ndash;": "–",
    "&hellip;": "…",
    "&bull;": "•",
    "&middot;": "·",
    "&rsquo;": "’",
    "&lsquo;": "‘",
    "&rdquo;": "”",
    "&ldquo;": "“",
    "&copy;": "©",
    "&reg;": "®",
    "&trade;": "™",
};

export function decodeHtmlEntities(str?: string | null): string {
    if (!str) return "";
    let text = str;
    for (const [entity, replacement] of Object.entries(HTML_ENTITIES)) {
        text = text.replaceAll(entity, replacement);
    }
    text = text.replace(/&#(\d+);/g, (_, dec) => {
        try {
            return String.fromCodePoint(Number(dec));
        } catch {
            return "";
        }
    });
    text = text.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => {
        try {
            return String.fromCodePoint(parseInt(hex, 16));
        } catch {
            return "";
        }
    });
    return text;
}

export function formatPlainText(htmlOrText?: string | null): string {
    if (!htmlOrText) return "";

    // 1. Unescape literal string escape sequences if any (\r\n, \n, \r)
    let text = htmlOrText.replace(/\\r\\n/g, "\n").replace(/\\n/g, "\n").replace(/\\r/g, "\n");

    // 2. Decode entities
    text = decodeHtmlEntities(text);

    // 3. Convert block HTML tags to appropriate newlines
    text = text
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<li[^>]*>/gi, "\n- ")
        .replace(/<\/(p|div|h[1-6]|li|ul|ol|blockquote|tr|table|section|article)>/gi, "\n\n")
        .replace(/<hr\s*\/?>/gi, "\n\n")
        .replace(/<[^>]*>/g, "");

    // 4. Handle non-breaking spaces and line cleaning
    text = text
        .replace(/\u00a0/g, " ")
        .replace(/[ \t]+\n/g, "\n")
        .replace(/\n[ \t]+/g, "\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim();

    return text;
}

export function stripHtml(htmlOrText?: string | null): string {
    if (!htmlOrText) return "";

    // Unescape literal escapes
    let text = htmlOrText.replace(/\\r\\n/g, " ").replace(/\\n/g, " ").replace(/\\r/g, " ");

    // Decode HTML entities
    text = decodeHtmlEntities(text);

    // Strip HTML tags and normalize whitespace
    return text
        .replace(/<[^>]*>/g, " ")
        .replace(/\u00a0/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

const ASSET_URL = process.env.NEXT_PUBLIC_ASSET_URL ?? "";

export function imageUrl(image?: string | null): string | undefined {
    if (!image) return undefined;

    // Normalize: strip leading/trailing whitespace
    let clean = image.trim();

    // Normalize legacy team member filenames that had commas/characters which trigger Next.js Image Optimizer 400 errors
    clean = clean.replace(/team-members\/Agus Ismail.*\.png$/i, "team-members/agus-ismail.png");
    clean = clean.replace(/team-members\/Achmad Zakaria.*\.png$/i, "team-members/achmad-zakaria.png");
    clean = clean.replace(/team-members\/Anindya.*\.png$/i, "team-members/anindya-wardhani.png");

    // If the image URL contains api.fitalenta.co.id or fitalenta.co.id or localhost,
    // strip the origin so it always resolves locally via relative path (/uploads/...)
    // This avoids external roundtrips and 503 upstream errors from Next.js Image Optimization.
    clean = clean.replace(/^https?:\/\/(?:api\.)?fitalenta\.co\.id/i, "");
    clean = clean.replace(/^https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?/i, "");

    // If it's still an external URL (e.g. from an external CDN or cloud storage), keep it
    if (/^https?:\/\//.test(clean)) {
        try {
            return encodeURI(decodeURI(clean));
        } catch {
            return encodeURI(clean);
        }
    }

    const path = clean.startsWith("/") ? clean : `/${clean}`;

    // Never prepend api.fitalenta.co.id or localhost from ASSET_URL
    let base = ASSET_URL;
    if (
        base.includes("api.fitalenta.co.id") ||
        base.includes("fitalenta.co.id") ||
        base.includes("localhost") ||
        base.includes("127.0.0.1")
    ) {
        base = "";
    }

    const fullUrl = base ? `${base}${path}` : path;

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
    return formatPlainText(text)
        .split(/\r?\n/)
        .map((l) => l.replace(/^\s*(?:[-•*]|\d+[.)])\s+/, "").trim())
        .filter(Boolean);
}
