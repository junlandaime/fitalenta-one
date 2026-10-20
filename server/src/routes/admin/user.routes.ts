import { Router } from "express";
import * as userController from "../../controllers/admin/user.controller";
import { superAdminAccess } from "../../middlewares/access";
import { validate } from "../../middlewares/validate";
import {
  createUserRules,
  listUsersRules,
  updateUserRules,
  userIdRules,
} from "../../validators/user.validator";

const router = Router();

router.use(...superAdminAccess);
router.get("/summary", userController.summary);
router.get("/", validate(listUsersRules), userController.index);
router.post("/", validate(createUserRules), userController.store);
router.get("/:id", validate(userIdRules), userController.show);
router.put("/:id", validate(updateUserRules), userController.update);
router.delete("/:id", validate(userIdRules), userController.destroy);

export default router;