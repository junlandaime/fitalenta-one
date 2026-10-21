import "dotenv/config";
import fs from "fs";
import path from "path";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client";

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST || "127.0.0.1",
  port: process.env.DATABASE_PORT ? Number(process.env.DATABASE_PORT) : 3306,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  connectionLimit: 5,
});
const prisma = new PrismaClient({ adapter });

interface GallerySeed {
  id: number;
  title: string;
  description: string | null;
  image: string;
  categorySlug: string;
  isFeatured: boolean;
  eventDate: string | null;
  order: number;
}

const CATEGORIES = [
  { name: "Informations", slug: "informations" },
  { name: "Event", slug: "event" },
  { name: "Blogs", slug: "blogs" },
  { name: "FITALENTA", slug: "fitalenta" },
];

async function seedGalleries() {
  // Ensure categories exist
  const categoryMap = new Map<string, number>();
  for (const cat of CATEGORIES) {
    const record = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name },
      create: { name: cat.name, slug: cat.slug },
    });
    categoryMap.set(cat.slug, record.id);
  }

  const filePath = path.join(process.cwd(), "prisma", "data", "galleries.json");
  const items: GallerySeed[] = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  let count = 0;
  for (const item of items) {
    const categoryId = categoryMap.get(item.categorySlug) || categoryMap.get("event")!;

    const data = {
      title: item.title,
      description: item.description,
      image: item.image,
      categoryId,
      isFeatured: item.isFeatured,
      eventDate: item.eventDate ? new Date(item.eventDate) : null,
      order: item.order,
    };

    const existing = await prisma.gallery.findFirst({
      where: { title: item.title },
    });

    if (existing) {
      await prisma.gallery.update({
        where: { id: existing.id },
        data,
      });
    } else {
      await prisma.gallery.create({ data });
    }
    count++;
  }

  console.log(`${count} dokumentasi galeri berhasil di-seed`);
}

seedGalleries()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
