import prisma from "../config/prisma";
import { BANNER_LIMITS } from "../config/banner.config";
import type { PublicBannerItem } from "../types/banner.types";

export function getActiveBanners(now = new Date()): Promise<PublicBannerItem[]> {
  return prisma.banner.findMany({
    where: {
      isActive: true,
      AND: [
        { OR: [{ startsAt: null }, { startsAt: { lte: now } }] },
        { OR: [{ endsAt: null }, { endsAt: { gte: now } }] },
      ],
    },
    select: { id: true, title: true, subtitle: true, ctaLabel: true, linkUrl: true, image: true },
    orderBy: [{ order: "asc" }, { id: "asc" }],
    take: BANNER_LIMITS.publicLimit,
  });
}