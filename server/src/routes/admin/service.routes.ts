import { Router } from "express";
import * as adminServiceController from "../../controllers/admin/service.controller";
import { cmsAccess } from "../../middlewares/access";

const router = Router();
router.use(...cmsAccess);
router.get("/", adminServiceController.index);
router.get("/:id", adminServiceController.show);
router.post("/", adminServiceController.store);
router.put("/:id", adminServiceController.update);
router.delete("/:id", adminServiceController.destroy);

export default router;