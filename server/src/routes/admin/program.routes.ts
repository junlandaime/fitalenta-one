import { Router } from "express";
import * as programController from "../../controllers/admin/program.controller";
import { superAdminAccess } from "../../middlewares/access";
import { validate } from "../../middlewares/validate";
import {
  createProgramRules,
  listProgramsRules,
  programIdRules,
  updateProgramRules,
} from "../../validators/program.validator";

const router = Router();

router.use(...superAdminAccess);
router.get("/summary", programController.summary);
router.get("/options", programController.options);
router.get("/", validate(listProgramsRules), programController.index);
router.post("/", validate(createProgramRules), programController.store);
router.get("/:id", validate(programIdRules), programController.show);
router.put("/:id", validate(updateProgramRules), programController.update);
router.delete("/:id", validate(programIdRules), programController.destroy);

export default router;