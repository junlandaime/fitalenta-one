import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import { IMAGE_PIPELINE } from "../config/image.config";

sharp.cache(false);
sharp.concurrency(1);

export interface OptimizerAdapter {
  listImagePaths(): Promise<string[]>;
  findInlineUsage(paths: string[]): Promise<Set<string>>;
  replacePath(oldPath: string, newPath: string): Promise<number>;
}

export interface OptimizerOptions {
  uploadsRoot: string;
  backupDir: string;
  apply: boolean;
  minBytes: number;
  minSavingRatio: number;
  folders?: string[];
  protectedPatterns: RegExp[];
}

export type FileStatus = "converted" | "skipped" | "missing" | "error";

export interface FileResult {
  path: string;
  status: FileStatus;
  reason?: string;
  before?: number;
  after?: number;
  newPath?: string;
  rows?: number;
}

export interface RollbackEntry {
  oldPath: string;
  newPath: string;
}

const CONVERTIBLE = new Set([".png", ".jpg", ".jpeg"]);
const PUBLIC_PREFIX = "/uploads/";

function toRelative(publicPath: string): string {
  return publicPath.slice(PUBLIC_PREFIX.length);
}

function resolveInside(root: string, relative: string): string | null {
  const target = path.resolve(root, relative);
  return target.startsWith(root + path.sep) ? target : null;
}

function slugify(name: string): string {
  const slug = name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return slug || "gambar";
}

function targetName(relative: string): string {
  const stem = path.parse(relative).name;
  const hash = crypto.createHash("sha1").update(relative).digest("hex").slice(0, 8);
  return `${slugify(stem)}-${hash}.webp`;
}

async function moveFile(from: string, to: string): Promise<void> {
  await fs.mkdir(path.dirname(to), { recursive: true });
  try {
    await fs.rename(from, to);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "EXDEV") throw error;
    await fs.copyFile(from, to);
    await fs.unlink(from);
  }
}

async function exists(file: string): Promise<boolean> {
  return fs.access(file).then(() => true, () => false);
}

async function processOne(
  publicPath: string,
  inline: Set<string>,
  adapter: OptimizerAdapter,
  options: OptimizerOptions
): Promise<FileResult> {
  const skip = (reason: string): FileResult => ({ path: publicPath, status: "skipped", reason });

  if (!publicPath.startsWith(PUBLIC_PREFIX)) return skip("alamat bukan /uploads/");
  const relative = toRelative(publicPath);
  const folder = relative.split("/")[0];

  if (options.folders && !options.folders.includes(folder)) return skip("folder dikecualikan");
  if (!CONVERTIBLE.has(path.extname(relative).toLowerCase())) return skip("bukan PNG atau JPEG");
  if (options.protectedPatterns.some((pattern) => pattern.test(publicPath))) return skip("dirujuk aturan khusus di frontend");
  if (inline.has(publicPath)) return skip("dipakai di dalam teks atau konten");

  const source = resolveInside(options.uploadsRoot, relative);
  if (!source) return skip("alamat di luar folder uploads");
  if (!(await exists(source))) return { path: publicPath, status: "missing", reason: "berkas tidak ada di disk" };

  const before = (await fs.stat(source)).size;

  try {
    const input = sharp(source, { failOn: "error", limitInputPixels: IMAGE_PIPELINE.maxInputPixels });
    const meta = await input.metadata();
    const longestSide = Math.max(meta.width ?? 0, meta.height ?? 0);
    if (before < options.minBytes && longestSide <= IMAGE_PIPELINE.maxDimension) return { ...skip("sudah kecil"), before };

    const buffer = await input
      .rotate()
      .resize({ width: IMAGE_PIPELINE.maxDimension, height: IMAGE_PIPELINE.maxDimension, fit: "inside", withoutEnlargement: true })
      .webp({ quality: IMAGE_PIPELINE.webpQuality })
      .toBuffer();

    if (buffer.length > before * (1 - options.minSavingRatio)) return { ...skip("penghematan terlalu kecil"), before, after: buffer.length };

    const newName = targetName(relative);
    const newPublic = `${PUBLIC_PREFIX}${folder}/${newName}`;
    const result: FileResult = { path: publicPath, status: "converted", before, after: buffer.length, newPath: newPublic };
    if (!options.apply) return result;

    const target = path.join(path.dirname(source), newName);
    await fs.writeFile(target, buffer, { flag: "wx" });
    try {
      result.rows = await adapter.replacePath(publicPath, newPublic);
    } catch (error) {
      await fs.unlink(target).catch(() => undefined);
      throw error;
    }
    await moveFile(source, path.join(options.backupDir, relative));
    return result;
  } catch (error) {
    return { path: publicPath, status: "error", reason: error instanceof Error ? error.message : String(error), before };
  }
}

export async function optimizeExistingImages(adapter: OptimizerAdapter, options: OptimizerOptions): Promise<FileResult[]> {
  const paths = [...new Set(await adapter.listImagePaths())];
  const inline = await adapter.findInlineUsage(paths);
  const results: FileResult[] = [];

  for (const publicPath of paths) {
    results.push(await processOne(publicPath, inline, adapter, options));
  }
  return results;
}

export async function rollbackOptimization(
  adapter: OptimizerAdapter,
  entries: RollbackEntry[],
  options: Pick<OptimizerOptions, "uploadsRoot" | "backupDir">
): Promise<FileResult[]> {
  const results: FileResult[] = [];

  for (const { oldPath, newPath } of entries) {
    const backup = resolveInside(options.backupDir, toRelative(oldPath));
    const current = resolveInside(options.uploadsRoot, toRelative(newPath));
    const original = resolveInside(options.uploadsRoot, toRelative(oldPath));

    if (!backup || !current || !original || !(await exists(backup))) {
      results.push({ path: oldPath, status: "error", reason: "cadangan tidak ditemukan" });
      continue;
    }
    if (await exists(original)) {
      results.push({ path: oldPath, status: "skipped", reason: "berkas asli sudah ada" });
      continue;
    }

    try {
      const rows = await adapter.replacePath(newPath, oldPath);
      await moveFile(backup, original);
      await fs.unlink(current).catch(() => undefined);
      results.push({ path: oldPath, status: "converted", newPath, rows });
    } catch (error) {
      results.push({ path: oldPath, status: "error", reason: error instanceof Error ? error.message : String(error) });
    }
  }
  return results;
}