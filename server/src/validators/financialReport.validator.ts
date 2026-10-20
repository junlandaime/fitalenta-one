import { query, ValidationChain } from "express-validator";
import { PaymentMethod, PaymentStatus } from "../../generated/prisma/client";
import { TERMIN_TYPES } from "../config/financial-report.config";
import { enumQueryRule, paginationRules, searchRule } from "./common.validator";

const dateQueryRule = (field: string, label: string): ValidationChain =>
  query(field)
    .optional({ values: "falsy" })
    .isISO8601({ strict: true, strictSeparator: true })
    .withMessage(`${label} harus berformat YYYY-MM-DD`)
    .toDate();

export const reportFilterRules: ValidationChain[] = [
  searchRule,
  enumQueryRule("status", "Status pembayaran", Object.values(PaymentStatus)),
  enumQueryRule("termin", "Termin pembayaran", [...TERMIN_TYPES]),
  enumQueryRule("paymentMethod", "Metode pembayaran", Object.values(PaymentMethod)),
  dateQueryRule("dateFrom", "Tanggal awal"),
  dateQueryRule("dateTo", "Tanggal akhir"),
];

export const listReportRules: ValidationChain[] = [...paginationRules, ...reportFilterRules];

export const importReportRules: ValidationChain[] = [
  query("dryRun").optional({ values: "falsy" }).isBoolean().withMessage("dryRun harus true atau false").toBoolean(),
];