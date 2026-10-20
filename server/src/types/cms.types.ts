import { CMS_SUMMARY_KEYS } from "../config/cms.config";

export type CmsSummaryKey = (typeof CMS_SUMMARY_KEYS)[number];

export type CmsSummary = Record<CmsSummaryKey, number>;