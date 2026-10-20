import "dotenv/config";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client";

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  connectionLimit: 5,
});
const prisma = new PrismaClient({ adapter });

interface ScrapedAgendaItem {
  day: string | null;
  time: string | null;
  title: string;
  detail: string;
}

interface ScrapedParticipantBreakdown {
  no: number;
  program: string;
  placement: string;
  participants: number;
  departure_schedule: string;
}

interface ScrapedEvent {
  id: number;
  title: string;
  slug: string;
  start_at: string;
  location: string;
  max_participants: number | null;
  image_url: string;
  description: string;
  agenda: ScrapedAgendaItem[];
  what_to_expect: string[];
  participants_breakdown: ScrapedParticipantBreakdown[] | null;
}

interface ScrapedArticle {
  id: number;
  title: string;
  slug: string;
  author: string;
  category: string;
  published_at: string;
  image_url: string;
  excerpt: string;
  content_html: string;
}

function buildEventDescription(e: ScrapedEvent): string {
  let text = e.description.trim();

  if (e.what_to_expect?.length) {
    text += "\n\nYang Akan Didapat:\n";
    text += e.what_to_expect.map((item) => `- ${item}`).join("\n");
  }

  if (e.agenda?.length) {
    text += "\n\nAgenda:\n";
    text += e.agenda
      .map((a) => `- ${a.time ? a.time + " " : ""}${a.title}: ${a.detail}`)
      .join("\n");
  }

  if (e.participants_breakdown?.length) {
    text += "\n\nRincian Peserta:\n";
    text += e.participants_breakdown
      .map(
        (p) =>
          `${p.no}. ${p.program} - ${p.placement} (${p.participants} peserta, keberangkatan: ${p.departure_schedule})`
      )
      .join("\n");
  }

  return text;
}

async function main() {
  const eventsPath = path.join(process.cwd(), "prisma", "data", "events.json");
  const articlesPath = path.join(process.cwd(), "prisma", "data", "articles.json");

  const scrapedEvents: ScrapedEvent[] = JSON.parse(fs.readFileSync(eventsPath, "utf-8"));
  const scrapedArticles: ScrapedArticle[] = JSON.parse(fs.readFileSync(articlesPath, "utf-8"));

  const category = await prisma.category.upsert({
    where: { slug: "fitalenta" },
    update: {},
    create: { name: "FITALENTA", slug: "fitalenta" },
  });

  let author = await prisma.user.findFirst({ where: { name: "Admin User" } });
  if (!author) {
    author = await prisma.user.create({
      data: {
        name: "Admin User",
        email: "admin-user@fitalenta.co.id",
        password: await bcrypt.hash(crypto.randomUUID(), 12),
        role: "editor",
      },
    });
  }

  let eventCount = 0;
  for (const e of scrapedEvents) {
    const imagePath = e.image_url ? e.image_url.replace(/^https?:\/\/[^\/]+\/storage\/events\//, "/uploads/events/") : null;
    await prisma.event.create({
      data: {
        title: e.title,
        slug: e.slug,
        description: buildEventDescription(e),
        eventDate: new Date(e.start_at),
        location: e.location,
        maxParticipants: e.max_participants ?? undefined,
        image: imagePath,
        categoryId: category.id,
        isFeatured: false,
      },
    });
    eventCount++;
  }
  console.log(`${eventCount} event berhasil di-seed`);

  let articleCount = 0;
  for (const a of scrapedArticles) {
    const imagePath = a.image_url ? a.image_url.replace(/^https?:\/\/[^\/]+\/storage\/articles\//, "/uploads/articles/") : null;
    await prisma.article.create({
      data: {
        title: a.title,
        slug: a.slug,
        content: a.content_html,
        excerpt: a.excerpt,
        eventDate: new Date(a.published_at),
        image: imagePath,
        categoryId: category.id,
        authorId: author.id,
        isFeatured: false,
      },
    });
    articleCount++;
  }
  console.log(`${articleCount} artikel berhasil di-seed`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });