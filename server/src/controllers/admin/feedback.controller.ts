import { Request, Response } from "express";
import { matchedData } from "express-validator";
import * as feedbackService from "../../services/feedback.service";

export async function list(req: Request, res: Response) {
  const filters = matchedData<feedbackService.FeedbackListFilters>(req);
  const { items, meta } = await feedbackService.listFeedbacks(filters);
  return res.json({ success: true, data: items, meta });
}

export async function update(req: Request, res: Response) {
  const { id, ...input } = matchedData<feedbackService.UpdateFeedbackInput & { id: number }>(req);
  const data = await feedbackService.updateFeedback(id, input);
  return res.json({ success: true, message: "Feedback berhasil diperbarui", data });
}
