import "dotenv/config";
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

const HTML_ENTITIES: Record<string, string> = {
  "&nbsp;": " ",
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&apos;": "'",
  "&mdash;": "—",
  "&ndash;": "–",
  "&hellip;": "…",
  "&bull;": "•",
  "&middot;": "·",
  "&rsquo;": "’",
  "&lsquo;": "‘",
  "&rdquo;": "”",
  "&ldquo;": "“",
  "&copy;": "©",
  "&reg;": "®",
  "&trade;": "™",
};

export function cleanToPlainText(input?: string | null): string {
  if (!input) return "";
  let text = input.replace(/\\r\\n/g, "\n").replace(/\\n/g, "\n").replace(/\\r/g, "\n");
  for (const [entity, replacement] of Object.entries(HTML_ENTITIES)) {
    text = text.replaceAll(entity, replacement);
  }
  text = text.replace(/&#(\d+);/g, (_, dec) => {
    try {
      return String.fromCodePoint(Number(dec));
    } catch {
      return "";
    }
  });
  text = text.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => {
    try {
      return String.fromCodePoint(parseInt(hex, 16));
    } catch {
      return "";
    }
  });
  text = text
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<li[^>]*>/gi, "\n- ")
    .replace(/<\/(p|div|h[1-6]|li|ul|ol|blockquote|tr|table|section|article)>/gi, "\n\n")
    .replace(/<hr\s*\/?>/gi, "\n\n")
    .replace(/<[^>]*>/g, "");
  text = text
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return text;
}

function hasIssues(text?: string | null): boolean {
  if (!text) return false;
  return /<[a-z]/i.test(text) || /&[a-z0-9#]+;/i.test(text) || /\\r|\\n/.test(text);
}

async function main() {
  console.log("=== CLEAN CONTENT DATA SCRIPT ===");

  // 1. Clean Events
  const events = await prisma.event.findMany({ select: { id: true, title: true, description: true } });
  let eventsUpdated = 0;
  for (const ev of events) {
    if (hasIssues(ev.description)) {
      const cleaned = cleanToPlainText(ev.description);
      await prisma.event.update({
        where: { id: ev.id },
        data: { description: cleaned },
      });
      eventsUpdated++;
      console.log(`[Event ${ev.id}] Cleaned description for: ${ev.title.slice(0, 40)}`);
    }
  }
  console.log(`Total events updated: ${eventsUpdated} / ${events.length}`);

  // 2. Clean Articles
  const articles = await prisma.article.findMany({ select: { id: true, title: true, content: true } });
  let articlesUpdated = 0;
  for (const art of articles) {
    if (hasIssues(art.content)) {
      const cleaned = cleanToPlainText(art.content);
      await prisma.article.update({
        where: { id: art.id },
        data: { content: cleaned },
      });
      articlesUpdated++;
      console.log(`[Article ${art.id}] Cleaned content for: ${art.title.slice(0, 40)}`);
    }
  }
  console.log(`Total articles updated: ${articlesUpdated} / ${articles.length}`);

  console.log("=== CLEANUP FINISHED SUCCESSFULLY ===");
}

main()
  .catch((e) => {
    console.error("Cleanup error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
