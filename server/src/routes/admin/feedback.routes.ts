import { Router } from "express";
import { superAdminAccess } from "../../middlewares/access";
import { validate } from "../../middlewares/validate";
import { listFeedbackRules, updateFeedbackRules } from "../../validators/feedback.validator";
import { list, update } from "../../controllers/admin/feedback.controller";

const router = Router();

router.use(...superAdminAccess);
router.get("/", validate(listFeedbackRules), list);
router.patch("/:id", validate(updateFeedbackRules), update);

export default router;
