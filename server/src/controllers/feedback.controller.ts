import { Request, Response } from "express";
import { matchedData } from "express-validator";
import * as feedbackService from "../services/feedback.service";

export async function create(req: Request, res: Response) {
  const data = matchedData<feedbackService.CreateFeedbackInput>(req);
  const feedback = await feedbackService.createFeedback(req.user!.userId, data);
  return res.status(201).json({
    success: true,
    message: "Feedback berhasil dikirim",
    data: feedback,
  });
}
