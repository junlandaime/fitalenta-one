import { Router } from "express";
import * as teamMemberController from "../../controllers/admin/teamMember.controller";
import { cmsAccess } from "../../middlewares/access";
import { uploadTeamMemberImage } from "../../middlewares/upload";
import { optimizeImages } from "../../middlewares/image-pipeline";
import { validate } from "../../middlewares/validate";
import {
  createExpertRules,
  expertIdRules,
  listExpertsRules,
  reorderExpertsRules,
  updateExpertRules,
} from "../../validators/teamMember.validator";

const router = Router();

router.use(...cmsAccess);

function memberRouter(handlers: teamMemberController.MemberHandlers) {
  const members = Router();

  members.get("/", validate(listExpertsRules), handlers.list);
  members.post("/", uploadTeamMemberImage.single("image"), optimizeImages, validate(createExpertRules), handlers.store);
  members.patch("/reorder", validate(reorderExpertsRules), handlers.reorder);
  members.get("/:id", validate(expertIdRules), handlers.show);
members.put("/:id", uploadTeamMemberImage.single("image"), optimizeImages, validate(updateExpertRules), handlers.update);
  members.delete("/:id", validate(expertIdRules), handlers.destroy);

  return members;
}

router.get("/", validate(listExpertsRules), teamMemberController.experts.list);

router.use("/experts", memberRouter(teamMemberController.experts));
router.use("/members", memberRouter(teamMemberController.members));

export default router;