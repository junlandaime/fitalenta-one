export function getInitials(name?: string | null) {
    if (!name) return "?";
    return name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join("");
}

const TZ = "Asia/Jakarta";

const dateFormat = new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", year: "numeric", timeZone: TZ });
const timeFormat = new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: TZ });

export const formatShortDate = (iso: string) => dateFormat.format(new Date(iso));
export const formatShortTime = (iso: string) => timeFormat.format(new Date(iso));
