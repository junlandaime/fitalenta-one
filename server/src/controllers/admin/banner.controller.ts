import { Request, Response } from "express";
import { matchedData } from "express-validator";
import * as bannerService from "../../services/admin/banner.service";
import { BannerListFilters, CreateBannerInput, UpdateBannerInput } from "../../types/banner.types";

export async function list(req: Request, res: Response) {
  const { items, meta, summary } = await bannerService.listBanners(matchedData<BannerListFilters>(req));
  return res.json({ success: true, data: items, meta, summary });
}

export async function show(req: Request, res: Response) {
  const { id } = matchedData<{ id: number }>(req);
  const data = await bannerService.getBannerById(id);
  return res.json({ success: true, data });
}

export async function store(req: Request, res: Response) {
  const data = await bannerService.createBanner(matchedData<CreateBannerInput>(req), req.file);
  return res.status(201).json({ success: true, message: "Banner berhasil dibuat", data });
}

export async function update(req: Request, res: Response) {
  const { id, ...input } = matchedData<UpdateBannerInput & { id: number }>(req);
  const data = await bannerService.updateBanner(id, input, req.file);
  return res.json({ success: true, message: "Banner berhasil diperbarui", data });
}

export async function destroy(req: Request, res: Response) {
  const { id } = matchedData<{ id: number }>(req);
  await bannerService.deleteBanner(id);
  return res.json({ success: true, message: "Banner berhasil dihapus" });
}

export async function reorder(req: Request, res: Response) {
  const { ids } = matchedData<{ ids: number[] }>(req);
  const data = await bannerService.reorderBanners(ids);
  return res.json({ success: true, message: "Urutan banner berhasil diperbarui", data });
}