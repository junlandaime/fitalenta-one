import { body, ValidationChain } from "express-validator";
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from "../config/admin.config";

const TOKEN_MAX_LENGTH = 2048;

const currentPasswordRule: ValidationChain = body("currentPassword")
  .isString()
  .withMessage("Password saat ini wajib diisi")
  .bail()
  .notEmpty()
  .withMessage("Password saat ini wajib diisi")
  .bail()
  .isLength({ max: PASSWORD_MAX_LENGTH })
  .withMessage("Password saat ini tidak valid");

const newPasswordRule: ValidationChain = body("newPassword")
  .isString()
  .withMessage("Password baru wajib diisi")
  .bail()
  .isLength({ min: PASSWORD_MIN_LENGTH, max: PASSWORD_MAX_LENGTH })
  .withMessage(`Password baru harus ${PASSWORD_MIN_LENGTH} sampai ${PASSWORD_MAX_LENGTH} karakter`);

const confirmPasswordRule: ValidationChain = body("confirmPassword")
  .custom((value, { req }) => value === req.body.newPassword)
  .withMessage("Konfirmasi password tidak cocok");

const emailRule: ValidationChain = body("email")
  .isString()
  .withMessage("Email wajib diisi")
  .bail()
  .trim()
  .isEmail()
  .withMessage("Format email tidak valid")
  .bail()
  .customSanitizer((value: string) => value.toLowerCase());

const tokenRule: ValidationChain = body("token")
  .isString()
  .withMessage("Token wajib diisi")
  .bail()
  .isLength({ min: 1, max: TOKEN_MAX_LENGTH })
  .withMessage("Token tidak valid");

export const changePasswordRules: ValidationChain[] = [currentPasswordRule, newPasswordRule, confirmPasswordRule];

export const forgotPasswordRules: ValidationChain[] = [emailRule];

export const resetPasswordRules: ValidationChain[] = [tokenRule, newPasswordRule, confirmPasswordRule];