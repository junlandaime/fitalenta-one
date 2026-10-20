import { Request, Response } from "express";
import { matchedData } from "express-validator";
import * as programCategoryService from "../../services/admin/programCategory.service";
import {
  CreateProgramCategoryInput,
  ProgramCategoryListFilters,
  UpdateProgramCategoryInput,
} from "../../types/program-category.types";

export async function index(req: Request, res: Response) {
  const { items, meta } = await programCategoryService.listProgramCategories(
    matchedData<ProgramCategoryListFilters>(req)
  );
  return res.json({ success: true, data: items, meta });
}

export async function show(req: Request, res: Response) {
  const { id } = matchedData<{ id: number }>(req);
  const data = await programCategoryService.getProgramCategoryById(id);
  return res.json({ success: true, data });
}

export async function store(req: Request, res: Response) {
  const data = await programCategoryService.createProgramCategory(matchedData<CreateProgramCategoryInput>(req));
  return res.status(201).json({ success: true, message: "Kategori program berhasil dibuat", data });
}

export async function update(req: Request, res: Response) {
  const { id, ...input } = matchedData<UpdateProgramCategoryInput & { id: number }>(req);
  const data = await programCategoryService.updateProgramCategory(id, input);
  return res.json({ success: true, message: "Kategori program berhasil diperbarui", data });
}

export async function destroy(req: Request, res: Response) {
  const { id } = matchedData<{ id: number }>(req);
  await programCategoryService.deleteProgramCategory(id);
  return res.json({ success: true, message: "Kategori program berhasil dihapus" });
}
