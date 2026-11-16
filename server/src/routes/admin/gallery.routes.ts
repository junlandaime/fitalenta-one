import { Router } from "express";
import * as adminGalleryController from "../../controllers/admin/gallery.controller";
import { cmsAccess } from "../../middlewares/access";
import { uploadGalleryImage } from "../../middlewares/upload";
import { optimizeImages } from "../../middlewares/image-pipeline";

const router = Router();
router.use(...cmsAccess);
router.get("/", adminGalleryController.index);
router.post("/", uploadGalleryImage.single("image"), optimizeImages, adminGalleryController.store);
router.put("/:id", uploadGalleryImage.single("image"), optimizeImages, adminGalleryController.update);
router.delete("/:id", adminGalleryController.destroy);

export default router;