import "dotenv/config";
import fs from "fs";
import path from "path";
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

interface ScrapedTestimonial {
  client_name: string;
  company: string;
  content: string;
  rating: number;
}

interface ServiceSeed {
  slug: string;
  title: string;
  icon: string;
  summary: string;
  content: unknown;
  isFeatured?: boolean;
}

function readJson<T>(filename: string): T {
  const filePath = path.join(process.cwd(), "prisma", "data", filename);
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function seedTestimonials() {
  const testimonials = readJson<ScrapedTestimonial[]>("testimonials.json");

  let created = 0;
  for (const t of testimonials) {
    const exists = await prisma.testimonial.findFirst({
      where: { clientName: t.client_name, company: t.company },
    });
    if (exists) continue;

    await prisma.testimonial.create({
      data: {
        clientName: t.client_name,
        company: t.company,
        content: t.content,
        rating: t.rating,
        isFeatured: false,
      },
    });
    created++;
  }
  console.log(`${created} testimoni baru di-seed (${testimonials.length - created} sudah ada)`);
}

async function seedServices() {
  const services = readJson<ServiceSeed[]>("services.json");

  let count = 0;
  for (const s of services) {
    const slug = s.slug || slugify(s.title);
    const data = {
      title: s.title,
      summary: s.summary,
      icon: s.icon,
      content: s.content as any,
      isFeatured: s.isFeatured ?? false,
    };

    await prisma.service.upsert({
      where: { slug },
      update: data,
      create: { slug, ...data },
    });
    count++;
  }
  console.log(`${count} layanan berhasil di-seed`);
}

async function main() {
  await seedTestimonials();
  await seedServices();
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