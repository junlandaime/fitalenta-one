import { Request, Response } from "express";
import * as eventService from "../../services/event.service";
import { INVALID_PAGE_RESPONSE, parsePageQuery } from "../../utils/pagination";

export async function index(req: Request, res: Response) {
  try {
    const page = parsePageQuery(typeof req.query.page === "string" ? req.query.page : undefined);
    if (page === null) return res.status(400).json(INVALID_PAGE_RESPONSE);
    const result = await eventService.getAdminEvents({ page });
    return res.json({ success: true, data: result });
  } catch (error) {
    console.error("Get admin events error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}

export async function show(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id as string);
    const event = await eventService.getEventById(id);
    return res.json({ success: true, data: event });
  } catch (error: any) {
    if (error.message === "EVENT_NOT_FOUND") {
      return res.status(404).json({ success: false, message: "Event tidak ditemukan" });
    }
    console.error("Get event error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}

export async function store(req: Request, res: Response) {
  try {
    const { title, description, eventDate, location, link, isFeatured, maxParticipants, categoryId } =
      req.body || {};

    if (!title || !description || !eventDate || !location || !categoryId) {
      return res.status(400).json({
        success: false,
        message: "Title, description, eventDate, location, dan categoryId wajib diisi",
      });
    }

    const imagePath = req.file ? `/uploads/events/${req.file.filename}` : undefined;

    const event = await eventService.createEvent(
      {
        title,
        description,
        eventDate,
        location,
        link,
        isFeatured: isFeatured === "true" || isFeatured === true,
        maxParticipants: maxParticipants ? parseInt(maxParticipants) : undefined,
        categoryId: parseInt(categoryId),
      },
      imagePath
    );

    return res.status(201).json({ success: true, message: "Event berhasil dibuat", data: event });
  } catch (error) {
    console.error("Create event error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id as string);
    const { title, description, eventDate, location, link, isFeatured, maxParticipants, categoryId } =
      req.body || {};

    if (!title || !description || !eventDate || !location || !categoryId) {
      return res.status(400).json({
        success: false,
        message: "Title, description, eventDate, location, dan categoryId wajib diisi",
      });
    }

    const imagePath = req.file ? `/uploads/events/${req.file.filename}` : undefined;

    const event = await eventService.updateEvent(
      id,
      {
        title,
        description,
        eventDate,
        location,
        link,
        isFeatured: isFeatured === "true" || isFeatured === true,
        maxParticipants: maxParticipants ? parseInt(maxParticipants) : undefined,
        categoryId: parseInt(categoryId),
      },
      imagePath
    );

    return res.json({ success: true, message: "Event berhasil diperbarui", data: event });
  } catch (error: any) {
    if (error.message === "EVENT_NOT_FOUND") {
      return res.status(404).json({ success: false, message: "Event tidak ditemukan" });
    }
    console.error("Update event error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}

export async function destroy(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id as string);
    await eventService.deleteEvent(id);
    return res.json({ success: true, message: "Event berhasil dihapus" });
  } catch (error: any) {
    if (error.message === "EVENT_NOT_FOUND") {
      return res.status(404).json({ success: false, message: "Event tidak ditemukan" });
    }
    console.error("Delete event error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}