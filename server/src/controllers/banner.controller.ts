import { Request, Response } from "express";
import * as bannerService from "../services/banner.service";

export async function index(_req: Request, res: Response) {
  const data = await bannerService.getActiveBanners();
  return res.json({ success: true, data });
}