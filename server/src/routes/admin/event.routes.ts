import { Router } from "express";
import * as adminEventController from "../../controllers/admin/event.controller";
import { cmsAccess } from "../../middlewares/access";
import { uploadEventImage } from "../../middlewares/upload";

const router = Router();

router.use(...cmsAccess);

router.get("/", adminEventController.index);
router.get("/:id", adminEventController.show);
router.post("/", uploadEventImage.single("image"), adminEventController.store);
router.put("/:id", uploadEventImage.single("image"), adminEventController.update);
router.delete("/:id", adminEventController.destroy);

export default router;