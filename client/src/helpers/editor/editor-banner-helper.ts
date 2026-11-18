import { toDateTimeInput } from "@/helpers/editor/editor-content-helper";
import type { BannerFormValues } from "@/schemas/editor/editor-banner";
import type { EditorBanner } from "@/types/editor/editor-banner";

const scheduleFormatter = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
});

function formatDateTime(iso: string | null): string | null {
    if (!iso) return null;
    const date = new Date(iso);
    return Number.isNaN(date.getTime()) ? null : scheduleFormatter.format(date);
}

export function describeSchedule({ startsAt, endsAt }: Pick<EditorBanner, "startsAt" | "endsAt">): string {
    const start = formatDateTime(startsAt);
    const end = formatDateTime(endsAt);

    if (start && end) return `${start} - ${end} WIB`;
    if (start) return `Mulai ${start} WIB`;
    if (end) return `Sampai ${end} WIB`;
    return "Selalu tayang";
}

export function createEmptyBannerForm(): BannerFormValues {
    return { title: "", subtitle: "", ctaLabel: "", linkUrl: "", startsAt: "", endsAt: "", isActive: true };
}

export function toBannerFormValues(banner: EditorBanner): BannerFormValues {
    return {
        title: banner.title,
        subtitle: banner.subtitle ?? "",
        ctaLabel: banner.ctaLabel ?? "",
        linkUrl: banner.linkUrl ?? "",
        startsAt: toDateTimeInput(banner.startsAt),
        endsAt: toDateTimeInput(banner.endsAt),
        isActive: banner.isActive,
    };
}