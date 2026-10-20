import { Router } from "express";
import * as teamMemberController from "../controllers/teamMember.controller";

const router = Router();

router.get("/", teamMemberController.index);
router.get("/experts", teamMemberController.experts);

export default router;