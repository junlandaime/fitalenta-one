import { Request, Response } from "express";
import { matchedData } from "express-validator";
import * as paymentService from "../../services/admin/payment.service";
import { sendInvoicePdf } from "../../services/admin/admin.invoicePdf";
import {
  CreateInvoiceInput,
  IssueInvoiceInput,
  PaymentFilters,
  VerifyPaymentInput,
} from "../../types/payment.types";

const currentUserId = (req: Request) => req.user!.userId;

export async function summary(_req: Request, res: Response) {
  const data = await paymentService.getSummary();
  return res.json({ success: true, data });
}

export function options(_req: Request, res: Response) {
  return res.json({ success: true, data: paymentService.getOptions() });
}

export async function index(req: Request, res: Response) {
  const { items, meta } = await paymentService.listPayments(matchedData<PaymentFilters>(req));
  return res.json({ success: true, data: items, meta });
}

export async function show(req: Request, res: Response) {
  const { id } = matchedData<{ id: number }>(req);
  const data = await paymentService.getPaymentById(id);
  return res.json({ success: true, data });
}

export async function store(req: Request, res: Response) {
  const data = await paymentService.createInvoice(matchedData<CreateInvoiceInput>(req), currentUserId(req));
  return res.status(201).json({ success: true, message: "Tagihan berhasil dibuat sebagai draft", data });
}

export async function issue(req: Request, res: Response) {
  const { id, ...input } = matchedData<IssueInvoiceInput & { id: number }>(req);
  const data = await paymentService.issueInvoice(id, input, currentUserId(req));
  return res.json({ success: true, message: "Tagihan berhasil diterbitkan", data });
}

export async function verify(req: Request, res: Response) {
  const { id, ...input } = matchedData<VerifyPaymentInput & { id: number }>(req);
  const data = await paymentService.verifyPayment(id, input, currentUserId(req));
  return res.json({ success: true, message: "Pembayaran berhasil diverifikasi", data });
}

  export async function invoicePdf(req: Request, res: Response) {
    const { id, download } = matchedData<{ id: number; download?: boolean }>(req);
    const invoice = await paymentService.getPaymentById(id);
    sendInvoicePdf(res, invoice, download);
  }