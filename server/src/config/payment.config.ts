import { PaymentStatus } from "../../generated/prisma/client";
import { CodeFormat } from "./registration.config";

export const RECEIPT_CODE_FORMAT: CodeFormat = { prefix: "RCP", scope: "month", pad: 5 };

export const PAYMENT_LIMITS = {
  notes: 5000,
  amountMax: 999_999_999_999,
  installmentMin: 2,
  installmentMax: 6,
} as const;

export const PAYMENT_PROOF_UPLOAD_FOLDER = "payment-proofs";

export const PAYMENT_PROOF_HISTORY_NOTES = {
  uploaded: "Bukti pembayaran diunggah peserta",
  replaced: "Bukti pembayaran diganti peserta",
} as const;

export const SETTLED_PAYMENT_STATUSES: PaymentStatus[] = ["paid", "cancelled"];

export const INVOICE_STATE_VALUES = ["draft", "issued"] as const;

export const INVOICE_ISSUER = {
  name: "PT FAST Indo Talenta",
  addressLines: [
    "Gedung Science and Techno Park ITB",
    "Jl. Ganesa No.15E, Lb. Siliwangi, Kec. Coblong Bandung 40132",
  ],
  phone: "+62 81110119273",
  website: "fitalenta.co.id",
  city: "Bandung",
  bank: { name: "BCA", accountNumber: "2828339333" },
  signatory: { name: "Ii Ratna Yanti Kosasih, S.Si., M.Sc.", title: "General Manager" },
  motto: "Fathanah  | Amanah | Shiddiq | Tabligh",
  letterCode: "INV/FITALENTA",
  paymentDeadlineTime: "23.59",
} as const;

export const INVOICE_ASSETS = {
  folder: ["assets", "invoice"],
  logo: "logo.png",
  signature: "signature.jpg",
} as const; 