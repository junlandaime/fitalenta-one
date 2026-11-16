import type { EditorBannerStatus } from "@/types/editor/editor-banner";

export const BANNERS_PER_PAGE = 50;

export const BANNER_LIMITS = {
    title: 191,
    subtitle: 500,
    ctaLabel: 60,
    linkUrl: 500,
} as const;

export const BANNER_STATUS_OPTIONS = [
    { value: "all", label: "Semua status" },
    { value: "live", label: "Tayang" },
    { value: "scheduled", label: "Terjadwal" },
    { value: "expired", label: "Berakhir" },
    { value: "inactive", label: "Nonaktif" },
] as const;

export const BANNER_STATUS_BADGE: Record<
    EditorBannerStatus,
    { label: string; variant: "default" | "secondary" | "outline" }
> = {
    live: { label: "Tayang", variant: "default" },
    scheduled: { label: "Terjadwal", variant: "secondary" },
    expired: { label: "Berakhir", variant: "outline" },
    inactive: { label: "Nonaktif", variant: "outline" },
};