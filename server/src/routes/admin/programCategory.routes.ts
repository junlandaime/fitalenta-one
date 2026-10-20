import { Router } from "express";
import * as programCategoryController from "../../controllers/admin/programCategory.controller";
import { superAdminAccess } from "../../middlewares/access";
import { validate } from "../../middlewares/validate";
import {
  createProgramCategoryRules,
  listProgramCategoryRules,
  programCategoryIdRules,
  updateProgramCategoryRules,
} from "../../validators/programCategory.validator";

const router = Router();

router.use(...superAdminAccess);
router.get("/", validate(listProgramCategoryRules), programCategoryController.index);
router.post("/", validate(createProgramCategoryRules), programCategoryController.store);
router.get("/:id", validate(programCategoryIdRules), programCategoryController.show);
router.put("/:id", validate(updateProgramCategoryRules), programCategoryController.update);
router.delete("/:id", validate(programCategoryIdRules), programCategoryController.destroy);

export default router;
