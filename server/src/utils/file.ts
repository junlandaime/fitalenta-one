import fs from "fs/promises";
import path from "path";
import { Request } from "express";

const UPLOADS_ROOT = path.resolve(process.cwd(), "uploads");

export function collectUploadedFiles(req: Request): Express.Multer.File[] {
  if (req.files) {
    return Array.isArray(req.files) ? req.files : Object.values(req.files).flat();
  }
  return req.file ? [req.file] : [];
}

export async function removeFiles(files: Express.Multer.File[]): Promise<void> {
  await Promise.allSettled(files.flatMap((file) => (file.path ? [fs.unlink(file.path)] : [])));
}

export function toPublicUploadPath(folder: string, filename: string): string {
  return `/uploads/${folder}/${filename}`;
}

export function toUploadedPath(folder: string, file?: Express.Multer.File): string | undefined {
  return file ? toPublicUploadPath(folder, file.filename) : undefined;
}

export async function removePublicUpload(publicPath?: string | null): Promise<void> {
  if (!publicPath || !publicPath.startsWith("/uploads/")) return;

  const target = path.resolve(process.cwd(), publicPath.slice(1));
  if (!target.startsWith(UPLOADS_ROOT + path.sep)) return;

  await fs.unlink(target).catch(() => undefined);
}

export async function withUploadCleanup<T>(
  uploadedPath: string | null | undefined,
  task: () => Promise<T>
): Promise<T> {
  try {
    return await task();
  } catch (error) {
    await removePublicUpload(uploadedPath);
    throw error;
  }
}