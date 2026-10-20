import "dotenv/config";
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

const FEATURED_ARTICLE_COUNT = 4;

async function main() {
    const latest = await prisma.article.findMany({
        orderBy: { eventDate: "desc" },
        take: FEATURED_ARTICLE_COUNT,
        select: { id: true, title: true },
    });

    if (latest.length === 0) {
        console.warn("Belum ada artikel di database. Jalankan seed utama dulu.");
        return;
    }

    const featuredIds = latest.map((a) => a.id);

    await prisma.$transaction([
        prisma.article.updateMany({
            where: { id: { notIn: featuredIds }, isFeatured: true },
            data: { isFeatured: false },
        }),
        prisma.article.updateMany({
            where: { id: { in: featuredIds } },
            data: { isFeatured: true },
        }),
    ]);

    console.log(`${latest.length} artikel ditandai sebagai featured:`);
    latest.forEach((a, i) => console.log(`  ${i + 1}. ${a.title}`));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());