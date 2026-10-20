import { Router } from "express";
import * as paymentController from "../../controllers/user/payment.controller";
import { authenticate } from "../../middlewares/authenticate";
import { uploadPaymentProof } from "../../middlewares/upload";
import { validate } from "../../middlewares/validate";
import { exportInvoiceRules, listMyPaymentsRules, paymentIdRules } from "../../validators/payment.validator";

const router = Router();

router.use(authenticate);
router.get("/summary", paymentController.summary);
router.get("/", validate(listMyPaymentsRules), paymentController.index);
router.get("/:id", validate(paymentIdRules), paymentController.show);
router.get("/:id/invoice", validate(exportInvoiceRules), paymentController.invoicePdf);
router.post("/:id/proof", uploadPaymentProof.single("proof"), validate(paymentIdRules), paymentController.uploadProof);

export default router;