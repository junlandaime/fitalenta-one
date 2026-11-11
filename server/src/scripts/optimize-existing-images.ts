import fs from "fs/promises";
import path from "path";
import prisma from "../config/prisma";
import {
  FileResult,
  OptimizerAdapter,
  optimizeExistingImages,
  rollbackOptimization,
  RollbackEntry,
} from "../utils/image-optimizer";

const UPLOADS_ROOT = path.resolve(process.cwd(), "uploads");
const BACKUP_DIR = path.resolve(process.cwd(), "backup-uploads");
const CONTENT_FOLDERS = ["articles", "events", "gallery", "team-members", "testimonials", "banners"];
const PROTECTED_PATTERNS = [
  /team-members\/Agus Ismail.*\.png$/i,
  /team-members\/Achmad Zakaria.*\.png$/i,
  /team-members\/Anindya.*\.png$/i,
  /team-members\/(agus-ismail|achmad-zakaria|anindya-wardhani)\.png$/i,
];

const isUpload = (value: string | null): value is string => typeof value === "string" && value.startsWith("/uploads/");

const prismaAdapter: OptimizerAdapter = {
  async listImagePaths() {
    const [events, articles, galleries, members, testimonials, banners] = await Promise.all([
      prisma.event.findMany({ select: { image: true } }),
      prisma.article.findMany({ select: { image: true } }),
      prisma.gallery.findMany({ select: { image: true } }),
      prisma.teamMember.findMany({ select: { image: true } }),
      prisma.testimonial.findMany({ select: { image: true } }),
      prisma.banner.findMany({ select: { image: true } }),
    ]);
    return [events, articles, galleries, members, testimonials, banners].flat().map((row) => row.image).filter(isUpload);
  },

  async findInlineUsage(paths) {
    const [events, articles, galleries, testimonials, services, programs, categories] = await Promise.all([
      prisma.event.findMany({ select: { description: true } }),
      prisma.article.findMany({ select: { content: true } }),
      prisma.gallery.findMany({ select: { description: true } }),
      prisma.testimonial.findMany({ select: { content: true } }),
      prisma.service.findMany({ select: { content: true } }),
      prisma.program.findMany({ select: { description: true } }),
      prisma.programCategory.findMany({ select: { description: true } }),
    ]);
    const haystack = [
      ...events.map((r) => r.description),
      ...articles.map((r) => r.content),
      ...galleries.map((r) => r.description),
      ...testimonials.map((r) => r.content),
      ...services.map((r) => JSON.stringify(r.content)),
      ...programs.map((r) => r.description),
      ...categories.map((r) => r.description),
    ].filter((text): text is string => typeof text === "string").join("\n");

    return new Set(paths.filter((p) => haystack.includes(p) || haystack.includes(encodeURI(p))));
  },

  async replacePath(oldPath, newPath) {
    const data = { image: newPath };
    const where = { image: oldPath };
    const results = await prisma.$transaction([
      prisma.event.updateMany({ where, data }),
      prisma.article.updateMany({ where, data }),
      prisma.gallery.updateMany({ where, data }),
      prisma.teamMember.updateMany({ where, data }),
      prisma.testimonial.updateMany({ where, data }),
      prisma.banner.updateMany({ where, data }),
    ]);
    return results.reduce((sum, r) => sum + r.count, 0);
  },
};

const mb = (bytes = 0) => (bytes / 1048576).toFixed(2);

function printReport(results: FileResult[], apply: boolean) {
  const converted = results.filter((r) => r.status === "converted");
  const before = converted.reduce((sum, r) => sum + (r.before ?? 0), 0);
  const after = converted.reduce((sum, r) => sum + (r.after ?? 0), 0);

  console.log(`\n${apply ? "HASIL (DITERAPKAN)" : "SIMULASI (tidak ada yang diubah)"}`);
  console.log("-".repeat(78));
  for (const r of results) {
    if (r.status === "converted") console.log(`[ubah]    ${mb(r.before)} MB -> ${mb(r.after)} MB  ${r.path}`);
  }
  for (const r of results.filter((x) => x.status === "missing")) console.log(`[hilang]  ${r.path}`);
  for (const r of results.filter((x) => x.status === "error")) console.log(`[galat]   ${r.path}  (${r.reason})`);

  const reasons = new Map<string, number>();
  results.filter((r) => r.status === "skipped").forEach((r) => reasons.set(r.reason ?? "?", (reasons.get(r.reason ?? "?") ?? 0) + 1));
  console.log("-".repeat(78));
  console.log(`Diubah   : ${converted.length} berkas, ${mb(before)} MB -> ${mb(after)} MB (hemat ${before ? Math.round((1 - after / before) * 100) : 0}%)`);
  console.log(`Dilewati : ${[...reasons.values()].reduce((a, b) => a + b, 0)} berkas${reasons.size ? " (" + [...reasons].map(([k, v]) => `${k}: ${v}`).join("; ") + ")" : ""}`);
  console.log(`Hilang   : ${results.filter((r) => r.status === "missing").length} rujukan di database tanpa berkas di disk`);
  console.log(`Galat    : ${results.filter((r) => r.status === "error").length}`);
}

function argValue(name: string): string | undefined {
  const hit = process.argv.find((arg) => arg.startsWith(`--${name}=`));
  return hit?.slice(name.length + 3);
}

async function main() {
  const apply = process.argv.includes("--apply");
  const rollbackFile = argValue("rollback");
  const minKb = Number(argValue("min-kb") ?? 300);
  const folders = argValue("folders")?.split(",").map((f) => f.trim()).filter(Boolean) ?? CONTENT_FOLDERS;

  await fs.access(UPLOADS_ROOT).catch(() => {
    throw new Error(`Folder uploads tidak ditemukan di ${UPLOADS_ROOT}. Jalankan skrip dari folder server.`);
  });

  if (rollbackFile) {
    const entries: RollbackEntry[] = JSON.parse(await fs.readFile(rollbackFile, "utf8"));
    const results = await rollbackOptimization(prismaAdapter, entries, { uploadsRoot: UPLOADS_ROOT, backupDir: BACKUP_DIR });
    results.forEach((r) => console.log(`[${r.status}] ${r.path}${r.reason ? "  (" + r.reason + ")" : ""}`));
    return;
  }

  const results = await optimizeExistingImages(prismaAdapter, {
    uploadsRoot: UPLOADS_ROOT,
    backupDir: BACKUP_DIR,
    apply,
    minBytes: minKb * 1024,
    minSavingRatio: 0.1,
    folders,
    protectedPatterns: PROTECTED_PATTERNS,
  });

  printReport(results, apply);

  if (apply) {
    const entries: RollbackEntry[] = results
      .filter((r) => r.status === "converted" && r.newPath)
      .map((r) => ({ oldPath: r.path, newPath: r.newPath as string }));
    await fs.mkdir(BACKUP_DIR, { recursive: true });
    const logFile = path.join(BACKUP_DIR, `rollback-${new Date().toISOString().replace(/[:.]/g, "-")}.json`);
    await fs.writeFile(logFile, JSON.stringify(entries, null, 2));
    console.log(`\nBerkas asli dipindah ke: ${BACKUP_DIR}`);
    console.log(`Catatan rollback: ${logFile}`);
    console.log(`Untuk membatalkan: npm run images:optimize -- --rollback="${logFile}"`);
  } else {
    console.log("\nIni hanya simulasi. Tambahkan --apply untuk menerapkan.");
  }
}

main()
  .catch((error) => {
    console.error("Gagal:", error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());