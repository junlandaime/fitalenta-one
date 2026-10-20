import { Router } from "express";
import * as reportController from "../../controllers/admin/financialReport.controller";
import { superAdminAccess } from "../../middlewares/access";
import { uploadReportSpreadsheet } from "../../middlewares/upload";
import { validate } from "../../middlewares/validate";
import {
  importReportRules,
  listReportRules,
  reportFilterRules,
} from "../../validators/financialReport.validator";

const router = Router();

router.use(...superAdminAccess);
router.get("/", validate(listReportRules), reportController.index);
router.get("/summary", validate(reportFilterRules), reportController.summary);
router.get("/export", validate(reportFilterRules), reportController.exportXlsx);
router.get("/template", reportController.template);
router.post(
  "/import",
  uploadReportSpreadsheet.single("file"),
  validate(importReportRules),
  reportController.importXlsx
);

export default router;