import { body, ValidationChain } from "express-validator";
import { Role } from "../../generated/prisma/client";
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from "../config/admin.config";
import { PHONE_PATTERN } from "../config/registration.config";
import { enumQueryRule, idParamRule, paginationRules, searchRule } from "./common.validator";

const ROLE_VALUES = Object.values(Role);

function nameRule(required: boolean): ValidationChain {
  const chain = required
    ? body("name").trim().notEmpty().withMessage("Nama wajib diisi").bail()
    : body("name").optional().trim().notEmpty().withMessage("Nama tidak boleh kosong").bail();

  return chain.isLength({ max: 255 }).withMessage("Nama maksimal 255 karakter");
}

function emailRule(required: boolean): ValidationChain {
  const chain = required
    ? body("email").trim().notEmpty().withMessage("Email wajib diisi").bail()
    : body("email").optional().trim().notEmpty().withMessage("Email tidak boleh kosong").bail();

  return chain
    .isEmail()
    .withMessage("Format email tidak valid")
    .bail()
    .customSanitizer((value: string) => value.toLowerCase());
}

const phoneRule: ValidationChain = body("phone")
  .optional({ values: "falsy" })
  .trim()
  .matches(PHONE_PATTERN)
  .withMessage("Nomor telepon tidak valid (contoh: 081234567890)");

const passwordRule: ValidationChain = body("password")
  .notEmpty()
  .withMessage("Password wajib diisi")
  .bail()
  .isLength({ min: PASSWORD_MIN_LENGTH, max: PASSWORD_MAX_LENGTH })
  .withMessage(`Password harus ${PASSWORD_MIN_LENGTH} sampai ${PASSWORD_MAX_LENGTH} karakter`);

const roleRule: ValidationChain = body("role")
  .optional({ values: "falsy" })
  .isIn(ROLE_VALUES)
  .withMessage(`Role harus salah satu dari: ${ROLE_VALUES.join(", ")}`);

export const listUsersRules: ValidationChain[] = [
  ...paginationRules,
  searchRule,
  enumQueryRule("role", "Role", ROLE_VALUES),
];

export const userIdRules: ValidationChain[] = [idParamRule];

export const createUserRules: ValidationChain[] = [
  nameRule(true),
  emailRule(true),
  phoneRule,
  passwordRule,
  roleRule,
];

export const updateUserRules: ValidationChain[] = [
  idParamRule,
  nameRule(false),
  emailRule(false),
  phoneRule,
  roleRule,
];