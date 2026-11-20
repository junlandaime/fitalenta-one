import { Prisma } from "../../../generated/prisma/client";
import {
  DEFAULT_PLACEMENT_STATUS,
  DEFAULT_SELECTION_STATUS,
  PASSED_SELECTION_STATUS,
} from "../../config/selection.config";
import { ParticipantItem } from "../../types/selection-placement.types";
import { toDateOnly } from "../user/registration.mapper";
import { isPlacementDetermined } from "./selectionPlacement.policy";

const LATEST = [{ createdAt: "desc" }, { id: "desc" }] satisfies Prisma.SelectionStatusOrderByWithRelationInput[];

export const participantInclude = {
  user: { select: { id: true, name: true, email: true, phone: true } },
  program: { select: { id: true, name: true, programFormat: true, duration: true } },
  selectionStatuses: { orderBy: LATEST, take: 1 },
  placementStatuses: { orderBy: LATEST, take: 1 },
} satisfies Prisma.RegistrationInclude;

type ParticipantRecord = Prisma.RegistrationGetPayload<{ include: typeof participantInclude }>;

export function toParticipantItem(registration: ParticipantRecord): ParticipantItem {
  const { user, program } = registration;
  const [selection] = registration.selectionStatuses;
  const [placement] = registration.placementStatuses;
  const selectionStatus = selection?.status ?? DEFAULT_SELECTION_STATUS;

  return {
    registrationId: registration.id,
    registrationCode: registration.registrationCode,
    registrationDate: registration.registrationDate,
    participant: {
      userId: user?.id ?? null,
      name: user?.name ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? null,
      photoPath: registration.photoPath,
    },
    program: {
      id: program?.id ?? null,
      name: program?.name ?? "",
      programFormat: program?.programFormat ?? null,
      duration: program?.duration ?? null,
    },
    interview: { 
      status: registration.registrationStatus, 
      notes: registration.selectionNotes ?? null
    },
    selection: {
      status: selectionStatus,
      notes: selection?.notes ?? null,
      evaluatedAt: selection?.evaluatedAt ?? null,
    },
    placement: {
      status: placement?.status ?? DEFAULT_PLACEMENT_STATUS,
      determined: isPlacementDetermined(placement ?? null),
      editable: selectionStatus === PASSED_SELECTION_STATUS,
      companyName: placement?.companyName ?? null,
      placementDate: toDateOnly(placement?.placementDate ?? null),
      notes: placement?.notes ?? null,
    },
  };
}