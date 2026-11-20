import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import { feedbackRateLimiter } from "../middlewares/rateLimiter";
import { validate } from "../middlewares/validate";
import { createFeedbackRules } from "../validators/feedback.validator";
import { create } from "../controllers/feedback.controller";

const router = Router();

router.post("/", authenticate, feedbackRateLimiter, validate(createFeedbackRules), create);

export default router;
