import fs from "fs/promises";
import path from "path";
import { NextFunction, Request, Response } from "express";
import sharp from "sharp";
import { IMAGE_PIPELINE } from "../config/image.config";
import { AppError } from "../utils/app-error";
import { collectUploadedFiles, removeFiles } from "../utils/file";

sharp.cache(false);
sharp.concurrency(1);

export type ImageProfile = "content" | "document";

const FORMAT_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpeg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

const PDF_MIME = "application/pdf";
const PDF_SIGNATURE = "%PDF-";

const invalidContent = () =>
  new AppError("INVALID_FILE_CONTENT", 400, "Isi file tidak valid atau tidak sesuai dengan format yang dipilih");

async function hasPdfSignature(filePath: string): Promise<boolean> {
  const handle = await fs.open(filePath, "r");
  try {
    const { buffer, bytesRead } = await handle.read(Buffer.alloc(PDF_SIGNATURE.length), 0, PDF_SIGNATURE.length, 0);
    return buffer.subarray(0, bytesRead).toString("latin1") === PDF_SIGNATURE;
  } finally {
    await handle.close();
  }
}

async function optimizeContentImage(file: Express.Multer.File, format: string): Promise<void> {
  if (format === "gif") return;

  const targetName = `${path.parse(file.filename).name}.webp`;
  const targetPath = path.join(path.dirname(file.path), targetName);

  try {
    const info = await sharp(file.path, { failOn: "error", limitInputPixels: IMAGE_PIPELINE.maxInputPixels })
      .rotate()
      .resize({
        width: IMAGE_PIPELINE.maxDimension,
        height: IMAGE_PIPELINE.maxDimension,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: IMAGE_PIPELINE.webpQuality })
      .toFile(targetPath);

    if (info.size >= file.size) {
      await fs.unlink(targetPath).catch(() => undefined);
      return;
    }

    await fs.unlink(file.path).catch(() => undefined);
    file.filename = targetName;
    file.path = targetPath;
    file.mimetype = "image/webp";
    file.size = info.size;
  } catch (error) {
    await fs.unlink(targetPath).catch(() => undefined);
    throw error;
  }
}

async function verifyDocumentImage(file: Express.Multer.File, format: string): Promise<void> {
  const metadata = await sharp(file.path, { failOn: "error", limitInputPixels: IMAGE_PIPELINE.maxInputPixels }).metadata();
  if (metadata.format !== format || !metadata.width || !metadata.height) throw invalidContent();
}

async function processFile(file: Express.Multer.File, profile: ImageProfile): Promise<void> {
  if (file.mimetype === PDF_MIME) {
    if (!(await hasPdfSignature(file.path))) throw invalidContent();
    return;
  }

  const format = FORMAT_BY_MIME[file.mimetype];
  if (!format) throw invalidContent();

  if (profile === "document") return verifyDocumentImage(file, format);

  const metadata = await sharp(file.path, { failOn: "error", limitInputPixels: IMAGE_PIPELINE.maxInputPixels }).metadata();
  if (!metadata.format || !Object.values(FORMAT_BY_MIME).includes(metadata.format)) throw invalidContent();
  return optimizeContentImage(file, metadata.format);
}

export function processUploadedImages(profile: ImageProfile = "content") {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const files = collectUploadedFiles(req);
    if (files.length === 0) return next();

    try {
      for (const file of files) {
        await processFile(file, profile);
      }
    } catch (error) {
      await removeFiles(files);
      throw error instanceof AppError ? error : invalidContent();
    }

    next();
  };
}

export const optimizeImages = processUploadedImages("content");
export const verifyDocuments = processUploadedImages("document");