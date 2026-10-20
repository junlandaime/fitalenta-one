import { Router } from "express";
import * as cmsController from "../../controllers/admin/cms.controller";
import { cmsAccess } from "../../middlewares/access";

const router = Router();

router.use(...cmsAccess);
router.get("/summary", cmsController.summary);

export default router;