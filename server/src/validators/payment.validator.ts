import { body, query, ValidationChain } from "express-validator";
import { PaymentStatus } from "../../generated/prisma/client";
import { INVOICE_STATE_VALUES, PAYMENT_LIMITS } from "../config/payment.config";
import { enumQueryRule, idParamRule, paginationRules, searchRule } from "./common.validator";
import { dateRule, decimalRule, intRule, textRule } from "./rule-factories";

const STATUS_VALUES = Object.values(PaymentStatus);

export const listPaymentsRules: ValidationChain[] = [
  ...paginationRules,
  searchRule,
  enumQueryRule("status", "Status pembayaran", STATUS_VALUES),
  enumQueryRule("invoiceState", "Status tagihan", [...INVOICE_STATE_VALUES]),
];

export const listMyPaymentsRules: ValidationChain[] = [
  ...paginationRules,
  enumQueryRule("status", "Status pembayaran", STATUS_VALUES),
];

export const paymentIdRules: ValidationChain[] = [idParamRule];

export const exportInvoiceRules: ValidationChain[] = [
  idParamRule,
  query("download").optional({ values: "falsy" }).isBoolean().withMessage("download harus true atau false").toBoolean(),
];

export const createInvoiceRules: ValidationChain[] = [
  intRule("registrationId", { label: "ID pendaftaran", min: 1 }),
  decimalRule("amount", { label: "Total tagihan", min: 1, max: PAYMENT_LIMITS.amountMax }),
  dateRule("dueDate", { label: "Jatuh tempo", nullable: true }),
  body("installmentAmounts")
    .optional({ values: "null" })
    .isArray({ min: PAYMENT_LIMITS.installmentMin, max: PAYMENT_LIMITS.installmentMax })
    .withMessage(
      `Cicilan harus berupa daftar nominal ${PAYMENT_LIMITS.installmentMin} sampai ${PAYMENT_LIMITS.installmentMax} item`
    ),
  body("installmentAmounts.*")
    .isFloat({ min: 1, max: PAYMENT_LIMITS.amountMax })
    .withMessage("Nominal cicilan harus berupa angka lebih dari 0")
    .toFloat(),
  textRule("notes", { label: "Catatan", max: PAYMENT_LIMITS.notes, nullable: true }),
];

export const issueInvoiceRules: ValidationChain[] = [
  idParamRule,
  dateRule("dueDate", { label: "Jatuh tempo", nullable: true }),
];

export const verifyPaymentRules: ValidationChain[] = [
  idParamRule,
  dateRule("nextDueDate", { label: "Jatuh tempo cicilan berikutnya", nullable: true }),
  textRule("notes", { label: "Catatan verifikasi", max: PAYMENT_LIMITS.notes, nullable: true }),
];