import { Request, Response } from "express";
import * as articleService from "../services/article.service";
import { getStringParam, getStringQuery } from '../utils/request';
import { INVALID_PAGE_RESPONSE, parsePageQuery } from "../utils/pagination";


export async function index(req: Request, res: Response) {
  try {
    const search = getStringQuery(req, "search");
    const categoryId = getStringQuery(req, "categoryId");

    const page =  parsePageQuery(getStringQuery(req, "page"));
    if (page === null) return res.status(400).json(INVALID_PAGE_RESPONSE);

    const result = await articleService.getPublicArticles({
      search,
      categoryId: categoryId ? parseInt(categoryId) : undefined,
      page: page ? parseInt(page.toString()) : 1,
    });

    return res.json({ success: true, data: result });
  } catch (error) {
    console.error("Get articles error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}

export async function featured(req: Request, res: Response) {
  try {
    const articles = await articleService.getFeaturedArticles(3);
    return res.json({ success: true, data: articles });
  } catch (error) {
    console.error("Get featured articles error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}

export async function show(req: Request, res: Response) {
  try {
    const slug = getStringParam(req, "slug");
    const ipAddress = req.ip || "unknown";
    const userAgent = (req.headers["user-agent"] as string) || "unknown";

    const result = await articleService.getArticleBySlug(slug, ipAddress, userAgent);
    return res.json({ success: true, data: result });
  } catch (error: any) {
    if (error.message === "ARTICLE_NOT_FOUND") {
      return res.status(404).json({ success: false, message: "Artikel tidak ditemukan" });
    }
    console.error("Get article detail error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}