import { body, query, ValidationChain } from "express-validator";
import { EXPERT_LIMITS} from "../config/team.config";
import { idParamRule, paginationRules, searchRule } from "./common.validator";
import { booleanRule, intRule, textRule } from "./rule-factories";

const expertFieldRules = (optional: boolean): ValidationChain[] => [
  textRule("name", { label: "Nama", max: EXPERT_LIMITS.name, optional }),
  textRule("position", { label: "Posisi", max: EXPERT_LIMITS.position, optional }),
  textRule("bio", { label: "Bio", max: EXPERT_LIMITS.bio, nullable: true }),
  intRule("order", { label: "Urutan", min: 0, max: EXPERT_LIMITS.order, optional: true }),
  booleanRule(body("isActive"), "isActive"),
];

export const listExpertsRules: ValidationChain[] = [
  ...paginationRules,
  searchRule,
  booleanRule(query("isActive"), "isActive"),
];

export const expertIdRules: ValidationChain[] = [idParamRule];

export const createExpertRules: ValidationChain[] = expertFieldRules(false);

export const updateExpertRules: ValidationChain[] = [
  idParamRule,
  ...expertFieldRules(true),
  booleanRule(body("removeImage"), "removeImage"),
];

export const reorderExpertsRules: ValidationChain[] = [
  body("ids")
    .isArray({ min: 1, max: EXPERT_LIMITS.reorderItems })
    .withMessage(`ids harus berupa array berisi 1 sampai ${EXPERT_LIMITS.reorderItems} ID`)
    .bail()
    .custom((ids: unknown[]) => new Set(ids.map(String)).size === ids.length)
    .withMessage("ids tidak boleh berisi ID yang sama"),
  body("ids.*").isInt({ min: 1 }).withMessage("ID tidak valid").toInt(),
];