import fs from "fs";
import path from "path";
import prisma from "../config/prisma";
import { slugify } from "../utils/slug";

async function generateUniqueSlug(title: string, excludeId?: number): Promise<string> {
  const base = slugify(title);
  let slug = base;
  let counter = 2;

  while (
    await prisma.event.findFirst({
      where: { slug, ...(excludeId ? { id: { not: excludeId } } : {}) },
    })
  ) {
    slug = `${base}-${counter}`;
    counter++;
  }

  return slug;
}

interface PublicEventQuery {
  search?: string;
  page?: number;
}

export async function getPublicEvents({ search, page = 1 }: PublicEventQuery) {
  const perPage = 9;
  const skip = (page - 1) * perPage;

  const where = search
    ? {
        OR: [{ title: { contains: search } }, { description: { contains: search } }],
      }
    : {};

  const [events, total] = await Promise.all([
    prisma.event.findMany({
      where,
      include: { category: true },
      orderBy: { eventDate: "desc" },
      skip,
      take: perPage,
    }),
    prisma.event.count({ where }),
  ]);

  return {
    events,
    pagination: { page, perPage, total, totalPages: Math.ceil(total / perPage) },
  };
}

export async function getFeaturedEvents(limit = 3, upcomingOnly = false) {
  return prisma.event.findMany({
    where: { isFeatured: true,
      ...(upcomingOnly ? { eventDate: { gte: new Date() } } : {}), },
    orderBy: { eventDate: "asc" },
    take: limit,
    include: { category: true },
  });
}

export async function getEventBySlug(slug: string, ipAddress: string, userAgent: string) {
  const event = await prisma.event.findUnique({
    where: { slug },
    include: { category: true },
  });
  if (!event) throw new Error("EVENT_NOT_FOUND");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const alreadyViewed = await prisma.eventView.findFirst({
    where: { eventId: event.id, ipAddress, createdAt: { gte: today } },
  });

  if (!alreadyViewed) {
    await prisma.eventView.create({ data: { eventId: event.id, ipAddress, userAgent } });
    await prisma.event.update({ where: { id: event.id }, data: { views: { increment: 1 } } });
    event.views += 1;
  }

  return event;
}

interface AdminEventQuery {
  page?: number;
}

export async function getAdminEvents({ page = 1 }: AdminEventQuery) {
  const perPage = 10;
  const skip = (page - 1) * perPage;

  const [events, total] = await Promise.all([
    prisma.event.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
      skip,
      take: perPage,
    }),
    prisma.event.count(),
  ]);

  return { events, pagination: { page, perPage, total, totalPages: Math.ceil(total / perPage) } };
}

export async function getEventById(id: number) {
  const event = await prisma.event.findUnique({ where: { id }, include: { category: true } });
  if (!event) throw new Error("EVENT_NOT_FOUND");
  return event;
}

interface EventInput {
  title: string;
  description: string;
  eventDate: string;
  location: string;
  link?: string;
  isFeatured?: boolean;
  maxParticipants?: number;
  categoryId: number;
}

export async function createEvent(data: EventInput, imagePath?: string) {
  const slug = await generateUniqueSlug(data.title);

  return prisma.event.create({
    data: {
      title: data.title,
      slug,
      description: data.description,
      eventDate: new Date(data.eventDate),
      location: data.location,
      link: data.link,
      isFeatured: data.isFeatured ?? false,
      maxParticipants: data.maxParticipants,
      categoryId: data.categoryId,
      image: imagePath,
    },
  });
}

export async function updateEvent(id: number, data: EventInput, imagePath?: string) {
  const existing = await prisma.event.findUnique({ where: { id } });
  if (!existing) throw new Error("EVENT_NOT_FOUND");

  const slug = await generateUniqueSlug(data.title, id);

  if (imagePath && existing.image) {
    const oldPath = path.join(process.cwd(), "uploads", "events", path.basename(existing.image));
    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
  }

  return prisma.event.update({
    where: { id },
    data: {
      title: data.title,
      slug,
      description: data.description,
      eventDate: new Date(data.eventDate),
      location: data.location,
      link: data.link,
      isFeatured: data.isFeatured ?? false,
      maxParticipants: data.maxParticipants,
      categoryId: data.categoryId,
      ...(imagePath ? { image: imagePath } : {}),
    },
  });
}

export async function deleteEvent(id: number) {
  const existing = await prisma.event.findUnique({ where: { id } });
  if (!existing) throw new Error("EVENT_NOT_FOUND");

  if (existing.image) {
    const imgPath = path.join(process.cwd(), "uploads", "events", path.basename(existing.image));
    if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
  }

  await prisma.event.delete({ where: { id } });
}

export function generateGoogleCalendarUrl(event: {
  title: string;
  description: string;
  eventDate: Date;
  location: string;
  slug: string;
}) {
  const formatDate = (date: Date) => date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const params = new URLSearchParams({
    text: event.title,
    dates: `${formatDate(event.eventDate)}/${formatDate(event.eventDate)}`,
    details: `${event.description}\n\nDetail: /events/${event.slug}`,
    location: event.location,
  });

  return `https://calendar.google.com/calendar/r/eventedit?${params.toString()}`;
}