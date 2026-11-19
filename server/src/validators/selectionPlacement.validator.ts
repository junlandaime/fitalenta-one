import { body, ValidationChain } from "express-validator";
import { PlacementStage, RegistrationStatus } from "../../generated/prisma/client";
import { SELECTION_PLACEMENT_LIMITS } from "../config/selection.config";
import { enumQueryRule, idParamRule, paginationRules, searchRule } from "./common.validator";
import { dateRule, textRule } from "./rule-factories";

const SELECTION_VALUES = Object.values(RegistrationStatus);
const PLACEMENT_VALUES = Object.values(PlacementStage);

export const listParticipantsRules: ValidationChain[] = [
  ...paginationRules,
  searchRule,
  enumQueryRule("selectionStatus", "Status seleksi", SELECTION_VALUES),
  enumQueryRule("placementStatus", "Status penyaluran", PLACEMENT_VALUES),
];

export const participantIdRules: ValidationChain[] = [idParamRule];

export const updateParticipantRules: ValidationChain[] = [
  idParamRule,

  body("interview").optional().isObject().withMessage("interview harus berupa object"),
  body("interview.status").if(body("interview").exists()).isIn(SELECTION_VALUES)
    .withMessage(`Status interview harus salah satu dari: ${SELECTION_VALUES.join(", ")}`),
  textRule("interview.notes", { label: "Catatan interview", max: SELECTION_PLACEMENT_LIMITS.notes, nullable: true }),

  body("selection").optional().isObject().withMessage("selection harus berupa object"),
  body("selection.status")
    .if(body("selection").exists())
    .isIn(SELECTION_VALUES)
    .withMessage(`Status seleksi harus salah satu dari: ${SELECTION_VALUES.join(", ")}`),
  textRule("selection.notes", { label: "Catatan seleksi", max: SELECTION_PLACEMENT_LIMITS.notes, nullable: true }),

  body("placement").optional().isObject().withMessage("placement harus berupa object"),
  body("placement.status")
    .if(body("placement").exists())
    .isIn(PLACEMENT_VALUES)
    .withMessage(`Status penyaluran harus salah satu dari: ${PLACEMENT_VALUES.join(", ")}`),
  textRule("placement.companyName", {
    label: "Nama perusahaan",
    max: SELECTION_PLACEMENT_LIMITS.companyName,
    nullable: true,
  }),
  dateRule("placement.placementDate", { label: "Tanggal penempatan", nullable: true }),
  textRule("placement.notes", { label: "Catatan penyaluran", max: SELECTION_PLACEMENT_LIMITS.notes, nullable: true }),
];