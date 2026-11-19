import { Request, Response } from "express";
import * as galleryService from "../../services/gallery.service";

type GalleryUploadedFiles = {
  image?: Express.Multer.File[];
  images?: Express.Multer.File[];
};

export async function index(req: Request, res: Response) {
  try {
    const gallery = await galleryService.getAdminGallery();
    return res.json({ success: true, data: gallery });
  } catch (error) {
    console.error("Get admin gallery error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}

export async function store(req: Request, res: Response) {
  try {
    const { title, categoryId, description, eventDate, isFeatured, order } = req.body || {};
    const files = req.files as GalleryUploadedFiles | undefined;
    const coverFile = files?.image?.[0];

    if (!title || !categoryId) {
      return res.status(400).json({ success: false, message: "Title dan categoryId wajib diisi" });
    }
    if (!coverFile) {
      return res.status(400).json({ success: false, message: "Gambar utama wajib diunggah" });
    }

    const imagePath = `/uploads/gallery/${coverFile.filename}`;
    const extraImagePaths = (files?.images ?? []).map((file) => `/uploads/gallery/${file.filename}`);

    const item = await galleryService.createGalleryItem(
      {
        title,
        categoryId: parseInt(categoryId),
        description,
        eventDate,
        isFeatured: isFeatured === "true" || isFeatured === true,
        order: order ? parseInt(order) : undefined,
      },
      imagePath,
      extraImagePaths
    );

    return res.status(201).json({ success: true, message: "Gambar berhasil diunggah", data: item });
  } catch (error) {
    console.error("Create gallery error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id as string);
    const { title, categoryId, description, eventDate, isFeatured, order, existingImages } = req.body || {};
    const files = req.files as GalleryUploadedFiles | undefined;
    const coverFile = files?.image?.[0];

    if (!title || !categoryId) {
      return res.status(400).json({ success: false, message: "Title dan categoryId wajib diisi" });
    }

    let keptExistingImages: string[] | undefined = undefined;
    if (typeof existingImages === "string") {
      try {
        const parsed = JSON.parse(existingImages);
        if (Array.isArray(parsed)) {
          keptExistingImages = parsed.filter((item): item is string => typeof item === "string");
        }
      } catch {
        keptExistingImages = undefined;
      }
    }

    const imagePath = coverFile ? `/uploads/gallery/${coverFile.filename}` : undefined;
    const newExtraImagePaths = (files?.images ?? []).map((file) => `/uploads/gallery/${file.filename}`);

    const item = await galleryService.updateGalleryItem(
      id,
      {
        title,
        categoryId: parseInt(categoryId),
        description,
        eventDate,
        isFeatured: isFeatured === "true" || isFeatured === true,
        order: order ? parseInt(order) : undefined,
      },
      {
        imagePath,
        keptExistingImages,
        newExtraImagePaths,
      }
    );

    return res.json({ success: true, message: "Gambar berhasil diperbarui", data: item });
  } catch (error: any) {
    if (error.message === "GALLERY_NOT_FOUND") {
      return res.status(404).json({ success: false, message: "Gambar tidak ditemukan" });
    }
    console.error("Update gallery error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}

export async function destroy(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id as string);
    await galleryService.deleteGalleryItem(id);
    return res.json({ success: true, message: "Gambar berhasil dihapus" });
  } catch (error: any) {
    if (error.message === "GALLERY_NOT_FOUND") {
      return res.status(404).json({ success: false, message: "Gambar tidak ditemukan" });
    }
    console.error("Delete gallery error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}