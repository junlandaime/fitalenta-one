import prisma from "../../config/prisma";
import { CMS_SUMMARY_KEYS } from "../../config/cms.config";
import { CmsSummary, CmsSummaryKey } from "../../types/cms.types";

const COUNTERS: Record<CmsSummaryKey, () => Promise<number>> = {
  articles: () => prisma.article.count(),
  events: () => prisma.event.count(),
  services: () => prisma.service.count(),
  gallery: () => prisma.gallery.count(),
  teamMembers: () => prisma.teamMember.count(),
  testimonials: () => prisma.testimonial.count(),
};

export async function getSummary(): Promise<CmsSummary> {
  const counts = await Promise.all(CMS_SUMMARY_KEYS.map((key) => COUNTERS[key]()));
  return Object.fromEntries(CMS_SUMMARY_KEYS.map((key, index) => [key, counts[index]])) as CmsSummary;
}