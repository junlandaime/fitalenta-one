import { Router } from "express";
import * as adminGalleryController from "../../controllers/admin/gallery.controller";
import { cmsAccess } from "../../middlewares/access";
import { uploadGalleryImage } from "../../middlewares/upload";

const router = Router();
router.use(...cmsAccess);
router.get("/", adminGalleryController.index);
router.post("/", uploadGalleryImage.single("image"), adminGalleryController.store);
router.put("/:id", uploadGalleryImage.single("image"), adminGalleryController.update);
router.delete("/:id", adminGalleryController.destroy);

export default router;