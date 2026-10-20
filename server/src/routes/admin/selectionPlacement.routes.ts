import { Router } from "express";
import * as selectionPlacementController from "../../controllers/admin/selectionPlacement.controller";
import { superAdminAccess } from "../../middlewares/access";
import { validate } from "../../middlewares/validate";
import {
  listParticipantsRules,
  participantIdRules,
  updateParticipantRules,
} from "../../validators/selectionPlacement.validator";

const router = Router();

router.use(...superAdminAccess);
router.get("/summary", selectionPlacementController.summary);
router.get("/options", selectionPlacementController.options);
router.get("/", validate(listParticipantsRules), selectionPlacementController.index);
router.get("/:id", validate(participantIdRules), selectionPlacementController.show);
router.put("/:id", validate(updateParticipantRules), selectionPlacementController.update);

export default router;