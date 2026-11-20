import { AppError } from "../utils/app-error";

export const FeedbackErrors = {
  notFound: () => new AppError("FEEDBACK_NOT_FOUND", 404, "Feedback tidak ditemukan"),
};
