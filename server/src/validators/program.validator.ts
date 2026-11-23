import { body, query, ValidationChain } from "express-validator";
import { ProgramStatus } from "../../generated/prisma/client";
import { INSTALLMENT_PLAN_PATTERN, PROGRAM_LIMITS } from "../config/program.config";
import { FORM_TEMPLATES } from "../config/registration.config";
import { enumQueryRule, idParamRule, paginationRules, searchRule } from "./common.validator";
import { booleanRule, dateRule, decimalRule, enumRule, intRule, textRule } from "./rule-factories";

const STATUS_VALUES = Object.values(ProgramStatus);

const SHORT_TEXT_FIELDS = {
  programFormat: "Format program",
  duration: "Durasi",
  location: "Lokasi",
  bridgeFund: "Dana talangan",
};

const LONG_TEXT_FIELDS = {
  description: "Deskripsi",
  requirements: "Persyaratan",
  schedule: "Jadwal",
  contactInfo: "Informasi kontak",
  trainingFeeDetails: "Rincian biaya pelatihan",
  departureFeeDetails: "Rincian biaya keberangkatan",
  timelineText: "Timeline",
  requirementsText: "Syarat pendaftaran",
};

const MONEY_FIELDS = {
  trainingCost: "Biaya pelatihan",
  departureCost: "Biaya keberangkatan",
  downPayment: "Uang muka",
  jobMatchingCost: "Biaya job matching",
};

const DATE_FIELDS = {
  registrationDeadline: "Batas pendaftaran",
  startDate: "Tanggal mulai",
  endDate: "Tanggal selesai",
};

function programFieldRules(partial: boolean): ValidationChain[] {
  return [
    textRule("name", { label: "Nama program", max: PROGRAM_LIMITS.short, optional: partial }),
    ...Object.entries(SHORT_TEXT_FIELDS).map(([field, label]) =>
      textRule(field, { label, max: PROGRAM_LIMITS.short, nullable: true })
    ),
    ...Object.entries(LONG_TEXT_FIELDS).map(([field, label]) =>
      textRule(field, { label, max: PROGRAM_LIMITS.long, nullable: true })
    ),
    ...Object.entries(MONEY_FIELDS).map(([field, label]) =>
      decimalRule(field, { label, min: 0, max: PROGRAM_LIMITS.money, optional: true })
    ),
    ...Object.entries(DATE_FIELDS).map(([field, label]) => dateRule(field, { label, nullable: true })),
    intRule("categoryId", { label: "Kategori", min: 1, nullable: true }),
    intRule("capacity", { label: "Kuota", min: 1, max: PROGRAM_LIMITS.capacity, nullable: true }),
    intRule("sortOrder", { label: "Urutan", min: 0, max: PROGRAM_LIMITS.sortOrder, optional: true }),
    enumRule("status", STATUS_VALUES, { label: "Status", optional: true }),
    enumRule("formTemplate", [...FORM_TEMPLATES], { label: "Template formulir", optional: true }),
    booleanRule(body("isRunning"), "isRunning"),
    body("installmentPlan")
      .optional()
      .matches(INSTALLMENT_PLAN_PATTERN)
      .withMessage("Skema cicilan tidak valid (contoh: none, 3_installments)"),
  ];
}

export const listProgramsRules: ValidationChain[] = [
  ...paginationRules,
  searchRule,
  query("categoryId").optional({ values: "falsy" }).isInt({ min: 1 }).withMessage("Kategori tidak valid").toInt(),
  enumQueryRule("status", "Status", STATUS_VALUES),
  booleanRule(query("isRunning"), "isRunning"),
];

export const programIdRules: ValidationChain[] = [idParamRule];
export const createProgramRules: ValidationChain[] = programFieldRules(false);
export const updateProgramRules: ValidationChain[] = [idParamRule, ...programFieldRules(true)];