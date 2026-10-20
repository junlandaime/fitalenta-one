import { Request, Response } from "express";
import * as articleService from "../../services/article.service";
import { getStringQuery } from "../../utils/request";
import { INVALID_PAGE_RESPONSE, parsePageQuery } from "../../utils/pagination";

export async function index(req: Request, res: Response) {
  try {
    const page = parsePageQuery(getStringQuery(req, "page"));
    if (page === null) return res.status(400).json(INVALID_PAGE_RESPONSE);
    const result = await articleService.getAdminArticles({ page });
    return res.json({ success: true, data: result });
  } catch (error) {
    console.error("Get admin articles error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}

export async function show(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id as string);
    const article = await articleService.getArticleById(id);
    return res.json({ success: true, data: article });
  } catch (error: any) {
    if (error.message === "ARTICLE_NOT_FOUND") {
      return res.status(404).json({ success: false, message: "Artikel tidak ditemukan" });
    }
    console.error("Get article error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}

export async function store(req: Request, res: Response) {
  try {
    const { title, content, excerpt, eventDate, isFeatured, categoryId } = req.body || {};

    if (!title || !content || !excerpt) {
      return res.status(400).json({
        success: false,
        message: "Title, content, dan excerpt wajib diisi",
      });
    }

    const imagePath = req.file ? `/uploads/articles/${req.file.filename}` : undefined;

    const article = await articleService.createArticle(
      {
        title,
        content,
        excerpt,
        eventDate,
        isFeatured: isFeatured === "true" || isFeatured === true,
        categoryId: categoryId ? parseInt(categoryId) : undefined,
        authorId: req.user!.userId,
      },
      imagePath
    );

    return res.status(201).json({ success: true, message: "Artikel berhasil dibuat", data: article });
  } catch (error) {
    console.error("Create article error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id as string);
    const { title, content, excerpt, eventDate, isFeatured, categoryId } = req.body || {};

    if (!title || !content || !excerpt) {
      return res.status(400).json({
        success: false,
        message: "Title, content, dan excerpt wajib diisi",
      });
    }

    const imagePath = req.file ? `/uploads/articles/${req.file.filename}` : undefined;

    const article = await articleService.updateArticle(
      id,
      {
        title,
        content,
        excerpt,
        eventDate,
        isFeatured: isFeatured === "true" || isFeatured === true,
        categoryId: categoryId ? parseInt(categoryId) : undefined,
        authorId: req.user!.userId,
      },
      imagePath
    );

    return res.json({ success: true, message: "Artikel berhasil diperbarui", data: article });
  } catch (error: any) {
    if (error.message === "ARTICLE_NOT_FOUND") {
      return res.status(404).json({ success: false, message: "Artikel tidak ditemukan" });
    }
    console.error("Update article error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}

export async function destroy(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id as string);
    await articleService.deleteArticle(id);
    return res.json({ success: true, message: "Artikel berhasil dihapus" });
  } catch (error: any) {
    if (error.message === "ARTICLE_NOT_FOUND") {
      return res.status(404).json({ success: false, message: "Artikel tidak ditemukan" });
    }
    console.error("Delete article error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}