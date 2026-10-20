import { Request, Response } from "express";
import * as serviceService from "../../services/service.service";
import { getStringQuery } from "../../utils/request";

export async function index(req: Request, res: Response) {
  try {
    const pageParam = getStringQuery(req, "page");
    const result = await serviceService.getAdminServices({ page: pageParam ? parseInt(pageParam) : 1 });
    return res.json({ success: true, data: result });
  } catch (error) {
    console.error("Get admin services error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}

export async function show(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id as string);
    if (!Number.isInteger(id) || id < 1) {
      return res.status(404).json({ success: false, message: "Layanan tidak ditemukan" });
    }

    const service = await serviceService.getAdminServiceById(id);
    return res.json({ success: true, data: service });
  } catch (error: any) {
    if (error.message === "SERVICE_NOT_FOUND") {
      return res.status(404).json({ success: false, message: "Layanan tidak ditemukan" });
    }
    console.error("Get admin service detail error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}

export async function store(req: Request, res: Response) {
  try {
    const { slug, title, icon, summary, content, isFeatured } = req.body || {};

    if (!slug || !title || !summary || !content) {
      return res.status(400).json({ success: false, message: "Slug, title, summary, dan content wajib diisi" });
    }

    const parsedContent = typeof content === "string" ? JSON.parse(content) : content;

    const service = await serviceService.createService({
      slug,
      title,
      icon,
      summary,
      content: parsedContent,
      isFeatured: isFeatured === "true" || isFeatured === true,
    });

    return res.status(201).json({ success: true, message: "Layanan berhasil dibuat", data: service });
  } catch (error: any) {
    if (error.code === "P2002") {
      return res.status(409).json({ success: false, message: "Slug sudah digunakan" });
    }
    console.error("Create service error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id as string);
    const { slug, title, icon, summary, content, isFeatured } = req.body || {};

    if (!slug || !title || !summary || !content) {
      return res.status(400).json({ success: false, message: "Slug, title, summary, dan content wajib diisi" });
    }

    const parsedContent = typeof content === "string" ? JSON.parse(content) : content;

    const service = await serviceService.updateService(id, {
      slug,
      title,
      icon,
      summary,
      content: parsedContent,
      isFeatured: isFeatured === "true" || isFeatured === true,
    });

    return res.json({ success: true, message: "Layanan berhasil diperbarui", data: service });
  } catch (error: any) {
    if (error.message === "SERVICE_NOT_FOUND") {
      return res.status(404).json({ success: false, message: "Layanan tidak ditemukan" });
    }
    if (error.code === "P2002") {
      return res.status(409).json({ success: false, message: "Slug sudah digunakan" });
    }
    console.error("Update service error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}

export async function destroy(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id as string);
    await serviceService.deleteService(id);
    return res.json({ success: true, message: "Layanan berhasil dihapus" });
  } catch (error: any) {
    if (error.message === "SERVICE_NOT_FOUND") {
      return res.status(404).json({ success: false, message: "Layanan tidak ditemukan" });
    }
    console.error("Delete service error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}