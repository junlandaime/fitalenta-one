import { Request, Response } from "express";
import * as cmsService from "../../services/admin/cms.service";

export async function summary(_req: Request, res: Response) {
  const data = await cmsService.getSummary();
  return res.json({ success: true, data });
}