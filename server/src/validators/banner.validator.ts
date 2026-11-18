import { body, query, ValidationChain } from "express-validator";
import { BANNER_LIMITS } from "../config/banner.config";
import { enumQueryRule, idParamRule, paginationRules, searchRule } from "./common.validator";
import { booleanRule, intRule, textRule } from "./rule-factories";

const LINK_PATTERN = /^(https?:\/\/\S+|\/(?!\/)\S*)$/i;
const BANNER_STATUSES = ["live", "scheduled", "expired", "inactive"];

const isFilled = (value: unknown) => value !== null && value !== "";

function dateTimeRule(field: string, label: string): ValidationChain {
  return body(field)
    .optional({ values: "undefined" })
    .if(isFilled)
    .isISO8601()
    .withMessage(`${label} harus berformat ISO 8601 (contoh: 2026-11-20T08:00:00+07:00)`)
    .toDate();
}

const linkRule = textRule("linkUrl", { label: "Tautan", max: BANNER_LIMITS.linkUrl, nullable: true })
  .matches(LINK_PATTERN)
  .withMessage("Tautan harus diawali http://, https://, atau / (halaman internal)");

const bannerFieldRules = (optional: boolean): ValidationChain[] => [
  textRule("title", { label: "Judul", max: BANNER_LIMITS.title, optional }),
  textRule("subtitle", { label: "Subjudul", max: BANNER_LIMITS.subtitle, nullable: true }),
  textRule("ctaLabel", { label: "Teks tombol", max: BANNER_LIMITS.ctaLabel, nullable: true }),
  linkRule,
  dateTimeRule("startsAt", "Waktu mulai"),
  dateTimeRule("endsAt", "Waktu berakhir"),
  intRule("order", { label: "Urutan", min: 0, max: BANNER_LIMITS.order, optional: true }),
  booleanRule(body("isActive"), "isActive"),
];

export const listBannersRules: ValidationChain[] = [
  ...paginationRules,
  searchRule,
  booleanRule(query("isActive"), "isActive"),
  enumQueryRule("status", "Status", BANNER_STATUSES),
];

export const bannerIdRules: ValidationChain[] = [idParamRule];

export const createBannerRules: ValidationChain[] = bannerFieldRules(false);

export const updateBannerRules: ValidationChain[] = [idParamRule, ...bannerFieldRules(true)];

export const reorderBannersRules: ValidationChain[] = [
  body("ids")
    .isArray({ min: 1, max: BANNER_LIMITS.reorderItems })
    .withMessage(`ids harus berupa array berisi 1 sampai ${BANNER_LIMITS.reorderItems} ID`)
    .bail()
    .custom((ids: unknown[]) => new Set(ids.map(String)).size === ids.length)
    .withMessage("ids tidak boleh berisi ID yang sama"),
  body("ids.*").isInt({ min: 1 }).withMessage("ID tidak valid").toInt(),
];