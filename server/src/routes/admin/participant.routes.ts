import { Router } from "express";
import * as participantController from "../../controllers/admin/participant.controller";
import { superAdminAccess } from "../../middlewares/access";
import { validate } from "../../middlewares/validate";
import { exportParticipantRules, importParticipantRules } from "../../validators/participant.validator";
import { uploadParticipantSpreadsheet } from "../../middlewares/upload";

const router = Router();

router.use(...superAdminAccess);
router.get("/export", validate(exportParticipantRules), participantController.exportXlsx);
router.get("/template", participantController.template);
router.post(
  "/import",
  uploadParticipantSpreadsheet.single("file"),
  validate(importParticipantRules),
  participantController.importXlsx
);

export default router;
