import { Router } from "express";
import * as adminGalleryController from "../../controllers/admin/gallery.controller";
import { cmsAccess } from "../../middlewares/access";
import { uploadGalleryImage } from "../../middlewares/upload";
import { optimizeImages } from "../../middlewares/image-pipeline";

const router = Router();
const uploadGalleryFields = uploadGalleryImage.fields([
  { name: "image", maxCount: 1 },
  { name: "images", maxCount: 30 },
]);

router.use(...cmsAccess);
router.get("/", adminGalleryController.index);
router.post("/", uploadGalleryFields, optimizeImages, adminGalleryController.store);
router.put("/:id", uploadGalleryFields, optimizeImages, adminGalleryController.update);
router.delete("/:id", adminGalleryController.destroy);

export default router;