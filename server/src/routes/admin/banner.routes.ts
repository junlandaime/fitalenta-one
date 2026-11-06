import { Router } from "express";
import * as bannerController from "../../controllers/admin/banner.controller";
import { cmsAccess } from "../../middlewares/access";
import { uploadBannerImage } from "../../middlewares/upload";
import { validate } from "../../middlewares/validate";
import {
  bannerIdRules,
  createBannerRules,
  listBannersRules,
  reorderBannersRules,
  updateBannerRules,
} from "../../validators/banner.validator";

const router = Router();

router.use(...cmsAccess);

router.get("/", validate(listBannersRules), bannerController.list);
router.post("/", uploadBannerImage.single("image"), validate(createBannerRules), bannerController.store);
router.patch("/reorder", validate(reorderBannersRules), bannerController.reorder);
router.get("/:id", validate(bannerIdRules), bannerController.show);
router.put("/:id", uploadBannerImage.single("image"), validate(updateBannerRules), bannerController.update);
router.delete("/:id", validate(bannerIdRules), bannerController.destroy);

export default router;