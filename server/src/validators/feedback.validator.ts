import { body, ValidationChain } from "express-validator";
import { enumQueryRule, idParamRule, paginationRules } from "./common.validator";

export const FEEDBACK_STATUSES = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];

export const createFeedbackRules: ValidationChain[] = [
  body("category")
    .trim()
    .notEmpty()
    .withMessage("Kategori wajib diisi")
    .isLength({ max: 50 })
    .withMessage("Kategori maksimal 50 karakter"),
  body("subject")
    .trim()
    .notEmpty()
    .withMessage("Subjek wajib diisi")
    .isLength({ max: 200 })
    .withMessage("Subjek maksimal 200 karakter"),
  body("message")
    .trim()
    .notEmpty()
    .withMessage("Pesan wajib diisi")
    .isLength({ max: 2000 })
    .withMessage("Pesan maksimal 2000 karakter"),
  body("pageUrl")
    .optional({ values: "falsy" })
    .trim()
    .custom((value: string) => value.startsWith("/") || /^https?:\/\/[^\s]+$/i.test(value))
    .withMessage("pageUrl harus berupa pathname atau URL yang valid"),
];

export const listFeedbackRules: ValidationChain[] = [
  ...paginationRules,
  enumQueryRule("status", "Status", FEEDBACK_STATUSES),
];

export const updateFeedbackRules: ValidationChain[] = [
  idParamRule,
  body("status")
    .isIn(FEEDBACK_STATUSES)
    .withMessage(`Status harus salah satu dari: ${FEEDBACK_STATUSES.join(", ")}`),
  body("adminNote")
    .optional({ values: "null" })
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Catatan admin maksimal 2000 karakter"),
];
