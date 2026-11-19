import fs from "fs";
import path from "path";
import prisma from "../config/prisma";

function parseImageList(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((item): item is string => typeof item === "string" && item.length > 0);
}

function removeGalleryFile(publicPath: string) {
  if (!publicPath) return;
  const filePath = path.join(process.cwd(), "uploads", "gallery", path.basename(publicPath));
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

export async function getPublicGallery() {
  return prisma.gallery.findMany({
    where: { isFeatured: false },
    include: { category: true },
    orderBy: { eventDate: "desc" },
  });
}

export async function getGalleryById(id: number) {
  const image = await prisma.gallery.findUnique({ where: { id }, include: { category: true } });
  if (!image) throw new Error("GALLERY_NOT_FOUND");

  const relatedImages = await prisma.gallery.findMany({ where: { isFeatured: true }, take: 3 });

  return { image, relatedImages };
}

export async function getAdminGallery() {
  return prisma.gallery.findMany({ include: { category: true }, orderBy: { createdAt: "desc" } });
}

interface GalleryInput {
  title: string;
  categoryId: number;
  description?: string;
  eventDate?: string;
  isFeatured?: boolean;
  order?: number;
}

interface UpdateGalleryMediaOptions {
  imagePath?: string;
  keptExistingImages?: string[];
  newExtraImagePaths?: string[];
}

export async function createGalleryItem(data: GalleryInput, imagePath: string, extraImages: string[] = []) {
  return prisma.gallery.create({
    data: {
      title: data.title,
      categoryId: data.categoryId,
      description: data.description,
      eventDate: data.eventDate ? new Date(data.eventDate) : undefined,
      isFeatured: data.isFeatured ?? false,
      order: data.order ?? 0,
      image: imagePath,
      images: extraImages,
    },
  });
}

export async function updateGalleryItem(id: number, data: GalleryInput, options: UpdateGalleryMediaOptions = {}) {
  const existing = await prisma.gallery.findUnique({ where: { id } });
  if (!existing) throw new Error("GALLERY_NOT_FOUND");

  if (options.imagePath && existing.image) {
    removeGalleryFile(existing.image);
  }

  const previousExtras = parseImageList(existing.images);
  const baseExtras = options.keptExistingImages !== undefined ? options.keptExistingImages : previousExtras;

  for (const oldImg of previousExtras) {
    if (!baseExtras.includes(oldImg)) {
      removeGalleryFile(oldImg);
    }
  }

  const finalExtras = [...baseExtras, ...(options.newExtraImagePaths ?? [])];

  return prisma.gallery.update({
    where: { id },
    data: {
      title: data.title,
      categoryId: data.categoryId,
      description: data.description,
      eventDate: data.eventDate ? new Date(data.eventDate) : undefined,
      isFeatured: data.isFeatured ?? false,
      order: data.order ?? existing.order,
      ...(options.imagePath ? { image: options.imagePath } : {}),
      images: finalExtras,
    },
  });
}

export async function deleteGalleryItem(id: number) {
  const existing = await prisma.gallery.findUnique({ where: { id } });
  if (!existing) throw new Error("GALLERY_NOT_FOUND");

  removeGalleryFile(existing.image);
  for (const extraImg of parseImageList(existing.images)) {
    removeGalleryFile(extraImg);
  }

  await prisma.gallery.delete({ where: { id } });
}