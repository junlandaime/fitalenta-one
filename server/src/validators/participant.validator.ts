import { query, ValidationChain } from "express-validator";

export const exportParticipantRules: ValidationChain[] = [
  query("search").optional().trim().isString(),
  query("programId")
    .optional({ values: "falsy" })
    .isInt({ min: 1 })
    .withMessage("programId harus integer positif")
    .toInt(),
  query("registrationStatus")
    .optional({ values: "falsy" })
    .isIn(["menunggu", "lolos", "tidak_lolos"])
    .withMessage("registrationStatus tidak valid"),
  query("dryRun")
    .optional()
    .isBoolean()
    .toBoolean(),
];

export const importParticipantRules: ValidationChain[] = [
  query("dryRun").optional().isBoolean().toBoolean(),
];
