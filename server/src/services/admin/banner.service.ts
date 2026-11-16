import prisma from "../../config/prisma";
import { Banner, Prisma } from "../../../generated/prisma/client";
import { BANNER_UPLOAD_FOLDER } from "../../config/banner.config";
import { BannerErrors } from "../../errors/banner.errors";
import {
  BannerItem,
  BannerListFilters,
  BannerListResult,
  BannerStatus,
  BannerSummary,
  CreateBannerInput,
  UpdateBannerInput,
} from "../../types/banner.types";
import { removePublicUpload, toUploadedPath, withUploadCleanup } from "../../utils/file";
import { buildPaginationMeta, resolvePagination } from "../../utils/pagination";

const ORDER_BY: Prisma.BannerOrderByWithRelationInput[] = [{ order: "asc" }, { id: "asc" }];

export function resolveStatus(
  banner: Pick<Banner, "isActive" | "startsAt" | "endsAt">,
  now: Date
): BannerStatus {
  if (!banner.isActive) return "inactive";
  if (banner.startsAt && banner.startsAt > now) return "scheduled";
  if (banner.endsAt && banner.endsAt < now) return "expired";
  return "live";
}

function toBannerItem(banner: Banner, now: Date): BannerItem {
  return {
    id: banner.id,
    title: banner.title,
    subtitle: banner.subtitle,
    ctaLabel: banner.ctaLabel,
    linkUrl: banner.linkUrl,
    image: banner.image,
    startsAt: banner.startsAt,
    endsAt: banner.endsAt,
    order: banner.order,
    isActive: banner.isActive,
    status: resolveStatus(banner, now),
    createdAt: banner.createdAt,
    updatedAt: banner.updatedAt,
  };
}

function statusWhere(status: BannerStatus, now: Date): Prisma.BannerWhereInput {
  switch (status) {
    case "inactive":
      return { isActive: false };
    case "scheduled":
      return { isActive: true, startsAt: { gt: now } };
    case "expired":
      return { isActive: true, endsAt: { lt: now } };
    case "live":
      return {
        isActive: true,
        AND: [
          { OR: [{ startsAt: null }, { startsAt: { lte: now } }] },
          { OR: [{ endsAt: null }, { endsAt: { gte: now } }] },
        ],
      };
  }
}

function buildWhere({ search, isActive, status }: BannerListFilters, now: Date): Prisma.BannerWhereInput {
  const conditions: Prisma.BannerWhereInput[] = [];

  if (isActive !== undefined) conditions.push({ isActive });
  if (status) conditions.push(statusWhere(status, now));
  if (search) conditions.push({ OR: [{ title: { contains: search } }, { subtitle: { contains: search } }] });

  return conditions.length > 0 ? { AND: conditions } : {};
}

function emptyToNull(value?: string): string | null | undefined {
  return value === undefined ? undefined : value || null;
}

function toNullableDate(value?: Date | string | null): Date | null | undefined {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;
  return value instanceof Date ? value : new Date(value);
}

function assertSchedule(startsAt: Date | null, endsAt: Date | null): void {
  if (startsAt && endsAt && endsAt <= startsAt) throw BannerErrors.invalidSchedule();
}

async function findOrFail(id: number): Promise<Banner> {
  const banner = await prisma.banner.findUnique({ where: { id } });
  if (!banner) throw BannerErrors.notFound();
  return banner;
}

async function nextOrder(): Promise<number> {
  const { _max } = await prisma.banner.aggregate({ _max: { order: true } });
  return (_max.order ?? 0) + 1;
}

async function getSummary(now: Date): Promise<BannerSummary> {
  const [total, live, scheduled, expired, inactive] = await Promise.all([
    prisma.banner.count(),
    prisma.banner.count({ where: statusWhere("live", now) }),
    prisma.banner.count({ where: statusWhere("scheduled", now) }),
    prisma.banner.count({ where: statusWhere("expired", now) }),
    prisma.banner.count({ where: statusWhere("inactive", now) }),
  ]);
  return { total, live, scheduled, expired, inactive };
}

export async function listBanners(filters: BannerListFilters): Promise<BannerListResult> {
  const { page, limit, skip, take } = resolvePagination(filters);
  const now = new Date();
  const where = buildWhere(filters, now);

  const [banners, total, summary] = await Promise.all([
    prisma.banner.findMany({ where, orderBy: ORDER_BY, skip, take }),
    prisma.banner.count({ where }),
    getSummary(now),
  ]);

  return {
    items: banners.map((banner) => toBannerItem(banner, now)),
    meta: buildPaginationMeta(total, page, limit),
    summary,
  };
}

export async function getBannerById(id: number): Promise<BannerItem> {
  return toBannerItem(await findOrFail(id), new Date());
}

export async function createBanner(input: CreateBannerInput, file?: Express.Multer.File): Promise<BannerItem> {
  const image = toUploadedPath(BANNER_UPLOAD_FOLDER, file);
  if (!image) throw BannerErrors.imageRequired();

  return withUploadCleanup(image, async () => {
    const startsAt = toNullableDate(input.startsAt) ?? null;
    const endsAt = toNullableDate(input.endsAt) ?? null;
    assertSchedule(startsAt, endsAt);

    const banner = await prisma.banner.create({
      data: {
        title: input.title,
        subtitle: emptyToNull(input.subtitle),
        ctaLabel: emptyToNull(input.ctaLabel),
        linkUrl: emptyToNull(input.linkUrl),
        image,
        startsAt,
        endsAt,
        order: input.order ?? (await nextOrder()),
        isActive: input.isActive,
      },
    });
    return toBannerItem(banner, new Date());
  });
}

export async function updateBanner(
  id: number,
  input: UpdateBannerInput,
  file?: Express.Multer.File
): Promise<BannerItem> {
  const newImage = toUploadedPath(BANNER_UPLOAD_FOLDER, file);

  return withUploadCleanup(newImage, async () => {
    const existing = await findOrFail(id);

    const startsAt = toNullableDate(input.startsAt);
    const endsAt = toNullableDate(input.endsAt);
    assertSchedule(
      startsAt === undefined ? existing.startsAt : startsAt,
      endsAt === undefined ? existing.endsAt : endsAt
    );

    const banner = await prisma.banner.update({
      where: { id },
      data: {
        title: input.title,
        subtitle: emptyToNull(input.subtitle),
        ctaLabel: emptyToNull(input.ctaLabel),
        linkUrl: emptyToNull(input.linkUrl),
        startsAt,
        endsAt,
        order: input.order,
        isActive: input.isActive,
        image: newImage,
      },
    });

    if (newImage) await removePublicUpload(existing.image);
    return toBannerItem(banner, new Date());
  });
}

export async function deleteBanner(id: number): Promise<void> {
  const existing = await findOrFail(id);
  await prisma.banner.delete({ where: { id } });
  await removePublicUpload(existing.image);
}

export async function reorderBanners(ids: number[]): Promise<BannerItem[]> {
  const found = await prisma.banner.count({ where: { id: { in: ids } } });
  if (found !== ids.length) throw BannerErrors.someNotFound();

  await prisma.$transaction(
    ids.map((id, index) => prisma.banner.update({ where: { id }, data: { order: index + 1 } }))
  );

  const now = new Date();
  const banners = await prisma.banner.findMany({ orderBy: ORDER_BY });
  return banners.map((banner) => toBannerItem(banner, now));
}