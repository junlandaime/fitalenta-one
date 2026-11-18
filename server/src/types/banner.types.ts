import { PaginationMeta, PaginationQuery } from "../utils/pagination";

export type BannerStatus = "live" | "scheduled" | "expired" | "inactive";

export interface BannerItem {
  id: number;
  title: string;
  subtitle: string | null;
  ctaLabel: string | null;
  linkUrl: string | null;
  image: string;
  startsAt: Date | null;
  endsAt: Date | null;
  order: number;
  isActive: boolean;
  status: BannerStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface BannerListFilters extends PaginationQuery {
  search?: string;
  isActive?: boolean;
  status?: BannerStatus;
}

export interface BannerSummary {
  total: number;
  live: number;
  scheduled: number;
  expired: number;
  inactive: number;
}

export interface BannerListResult {
  items: BannerItem[];
  meta: PaginationMeta;
  summary: BannerSummary;
}

export interface CreateBannerInput {
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  linkUrl?: string;
  startsAt?: Date | string | null;
  endsAt?: Date | string | null;
  order?: number;
  isActive?: boolean;
}

export interface UpdateBannerInput {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  linkUrl?: string;
  startsAt?: Date | string | null;
  endsAt?: Date | string | null;
  order?: number;
  isActive?: boolean;
}

export interface PublicBannerItem {
  id: number;
  title: string;
  subtitle: string | null;
  ctaLabel: string | null;
  linkUrl: string | null;
  image: string;
}