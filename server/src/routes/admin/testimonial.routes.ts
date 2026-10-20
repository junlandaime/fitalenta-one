import { Router } from "express";
import * as adminTestimonialController from "../../controllers/admin/testimonial.controller";
import { cmsAccess } from "../../middlewares/access";
import { uploadTestimonialImage } from "../../middlewares/upload";

const router = Router();
router.use(...cmsAccess);
router.get("/", adminTestimonialController.index);
router.post("/", uploadTestimonialImage.single("image"), adminTestimonialController.store);
router.put("/:id", uploadTestimonialImage.single("image"), adminTestimonialController.update);
router.delete("/:id", adminTestimonialController.destroy);
router.patch("/:id/toggle", adminTestimonialController.toggle);
export default router;