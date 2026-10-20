import { Request, Response } from "express";
import { matchedData } from "express-validator";
import { PAYMENT_PROOF_UPLOAD_FOLDER } from "../../config/payment.config";
import { PaymentErrors } from "../../errors/payment.errors";
import { sendInvoicePdf } from "../../services/admin/admin.invoicePdf";
import * as paymentService from "../../services/user/payment.service";
import { MyPaymentFilters } from "../../types/userPayment.types";
import { toPublicUploadPath, withUploadCleanup } from "../../utils/file";

const currentUserId = (req: Request) => req.user!.userId;

export async function summary(req: Request, res: Response) {
  const data = await paymentService.getMySummary(currentUserId(req));
  return res.json({ success: true, data });
}

export async function index(req: Request, res: Response) {
  const { items, meta } = await paymentService.listMyPayments(currentUserId(req), matchedData<MyPaymentFilters>(req));
  return res.json({ success: true, data: items, meta });
}

export async function show(req: Request, res: Response) {
  const { id } = matchedData<{ id: number }>(req);
  const data = await paymentService.getMyPayment(currentUserId(req), id);
  return res.json({ success: true, data });
}

export async function invoicePdf(req: Request, res: Response) {
  const { id, download } = matchedData<{ id: number; download?: boolean }>(req);
  const invoice = await paymentService.getMyInvoice(currentUserId(req), id);
  sendInvoicePdf(res, invoice, download);
}

export async function uploadProof(req: Request, res: Response) {
  const { id } = matchedData<{ id: number }>(req);
  if (!req.file) throw PaymentErrors.proofRequired();

  const proofPath = toPublicUploadPath(PAYMENT_PROOF_UPLOAD_FOLDER, req.file.filename);
  const data = await withUploadCleanup(proofPath, () =>
    paymentService.submitPaymentProof(currentUserId(req), id, proofPath)
  );

  return res.json({ success: true, message: "Bukti pembayaran berhasil diunggah", data });
}