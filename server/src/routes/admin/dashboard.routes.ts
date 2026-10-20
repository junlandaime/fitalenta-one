import { Router } from "express";
import * as dashboardController from "../../controllers/admin/dashboard.controller";
import { superAdminAccess } from "../../middlewares/access";
import { validate } from "../../middlewares/validate";
import { listRegistrationsRules, registrationDetailRules } from "../../validators/dashboard.validator";

const router = Router();

router.use(...superAdminAccess);
router.get("/summary", dashboardController.summary);
router.get("/filters", dashboardController.filters);
router.get("/registrations", validate(listRegistrationsRules), dashboardController.registrations);
router.get("/registrations/:id", validate(registrationDetailRules), dashboardController.registrationDetail);

export default router;