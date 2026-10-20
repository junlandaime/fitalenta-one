import { ValidationChain } from "express-validator";
import { idParamRule, paginationRules, searchRule } from "./common.validator";
import { textRule } from "./rule-factories";

const NAME_MAX = 100;
const DESC_MAX = 500;

function programCategoryFieldRules(partial: boolean): ValidationChain[] {
  return [
    textRule("name", { label: "Nama kategori", max: NAME_MAX, optional: partial }),
    textRule("description", { label: "Deskripsi", max: DESC_MAX, nullable: true }),
  ];
}

export const listProgramCategoryRules: ValidationChain[] = [...paginationRules, searchRule];

export const programCategoryIdRules: ValidationChain[] = [idParamRule];

export const createProgramCategoryRules: ValidationChain[] = programCategoryFieldRules(false);

export const updateProgramCategoryRules: ValidationChain[] = [idParamRule, ...programCategoryFieldRules(true)];
