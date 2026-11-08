import type { AdminPageMeta } from "@/types/pagination";

export type EditorBannerStatus = "live" | "scheduled" | "expired" | "inactive";

export type EditorBanner = {
    id: number;
    title: string;
    subtitle: string | null;
    ctaLabel: string | null;
    linkUrl: string | null;
    image: string;
    startsAt: string | null;
    endsAt: string | null;
    order: number;
    isActive: boolean;
    status: EditorBannerStatus;
    createdAt: string;
    updatedAt: string;
};

export type EditorBannerSummary = {
    total: number;
    live: number;
    scheduled: number;
    expired: number;
    inactive: number;
};

export type EditorBannerList = {
    items: EditorBanner[];
    meta: AdminPageMeta;
    summary: EditorBannerSummary;
};

export type EditorBannerParams = {
    page: number;
    search: string;
    status: "all" | EditorBannerStatus;
};

export type EditorBannerPayload = {
    title: string;
    subtitle: string;
    ctaLabel: string;
    linkUrl: string;
    startsAt: string | null;
    endsAt: string | null;
    isActive: boolean;
    image: File | null;
};