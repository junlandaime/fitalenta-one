import prisma from "../../config/prisma";
import { PlacementStage, Prisma, RegistrationStatus } from "../../../generated/prisma/client";
import { DEFAULT_PLACEMENT_STATUS, DEFAULT_SELECTION_STATUS, PASSED_SELECTION_STATUS } from "../../config/selection.config";
import { SelectionPlacementErrors } from "../../errors/selectionPlacement.errors";
import {
  ParticipantFilters,
  ParticipantItem,
  ParticipantUpdateInput,
  PlacementInput,
  PlacementState,
  SelectionInput,
  SelectionPlacementOptions,
  SelectionPlacementSummary,
} from "../../types/selection-placement.types";
import { PaginationMeta, buildPaginationMeta, resolvePagination } from "../../utils/pagination";
import { blankToNull } from "../../utils/value";
import {
  buildInterviewNotification,
  buildPlacementNotification,
  buildSelectionNotification,
  createNotification,
} from "./selectionPlacement.notifications";
import { participantInclude, toParticipantItem } from "./selectionPlacement.mapper";
import { assertPlacementAllowed, isPlacementDetermined } from "./selectionPlacement.policy";

type Tx = Prisma.TransactionClient;
type ParticipantRecord = Prisma.RegistrationGetPayload<{ include: typeof participantInclude }>;
type CurrentSelection = ParticipantRecord["selectionStatuses"][number] | undefined;
type CurrentPlacement = ParticipantRecord["placementStatuses"][number] | undefined;

interface SelectionState {
  status: RegistrationStatus;
  notes: string | null;
}

function buildWhere({ search, selectionStatus, placementStatus }: ParticipantFilters): Prisma.RegistrationWhereInput {
  return {
    ...(selectionStatus ? { selectionStatuses: { some: { status: selectionStatus } } } : {}),
    ...(placementStatus ? { placementStatuses: { some: { status: placementStatus } } } : {}),
    ...(search
      ? {
          OR: [
            { registrationCode: { contains: search } },
            { user: { name: { contains: search } } },
            { user: { email: { contains: search } } },
          ],
        }
      : {}),
  };
}

function resolveSelection(input: SelectionInput | undefined, current: CurrentSelection): SelectionState {
  if (input) return { status: input.status, notes: blankToNull(input.notes) };

  return { status: current?.status ?? DEFAULT_SELECTION_STATUS, notes: current?.notes ?? null };
}

function resolvePlacement(input: PlacementInput | undefined, current: CurrentPlacement): PlacementState {
  if (input) {
    return {
      status: input.status,
      companyName: blankToNull(input.companyName),
      placementDate: blankToNull(input.placementDate),
      notes: blankToNull(input.notes),
    };
  }

  return {
    status: current?.status ?? DEFAULT_PLACEMENT_STATUS,
    companyName: current?.companyName ?? null,
    placementDate: current?.placementDate ?? null,
    notes: current?.notes ?? null,
  };
}

async function saveSelection(
  tx: Tx,
  registrationId: number,
  current: CurrentSelection,
  next: SelectionState,
  adminId: number
): Promise<void> {
  const evaluated = next.status !== DEFAULT_SELECTION_STATUS;
  const data = {
    status: next.status,
    notes: next.notes,
    evaluatedBy: evaluated ? adminId : null,
    evaluatedAt: evaluated ? new Date() : null,
  };

  if (current) await tx.selectionStatus.update({ where: { id: current.id }, data });
  else await tx.selectionStatus.create({ data: { registrationId, ...data } });
}

async function savePlacement(
  tx: Tx,
  registrationId: number,
  current: CurrentPlacement,
  next: PlacementState
): Promise<void> {
  if (current) await tx.placementStatus.update({ where: { id: current.id }, data: next });
  else await tx.placementStatus.create({ data: { registrationId, ...next } });
}

export async function getSummary(): Promise<SelectionPlacementSummary> {
  const [totalParticipants, waitingSelection, passedSelection, placed] = await Promise.all([
    prisma.registration.count(),
    prisma.registration.count({ where: { selectionStatuses: { some: { status: "menunggu" } } } }),
    prisma.registration.count({ where: { selectionStatuses: { some: { status: "lolos" } } } }),
    prisma.registration.count({ where: { placementStatuses: { some: { status: "ditempatkan" } } } }),
  ]);

  return { totalParticipants, waitingSelection, passedSelection, placed };
}

export function getOptions(): SelectionPlacementOptions {
  return {
    selectionStatuses: Object.values(RegistrationStatus),
    placementStatuses: Object.values(PlacementStage),
  };
}

export async function listParticipants(
  filters: ParticipantFilters
): Promise<{ items: ParticipantItem[]; meta: PaginationMeta }> {
  const { page, limit, skip, take } = resolvePagination(filters);
  const where = buildWhere(filters);

  const [total, registrations] = await Promise.all([
    prisma.registration.count({ where }),
    prisma.registration.findMany({
      where,
      include: participantInclude,
      orderBy: { registrationDate: "desc" },
      skip,
      take,
    }),
  ]);

  return { items: registrations.map(toParticipantItem), meta: buildPaginationMeta(total, page, limit) };
}

export async function getParticipantById(id: number): Promise<ParticipantItem> {
  const registration = await prisma.registration.findUnique({ where: { id }, include: participantInclude });
  if (!registration) throw SelectionPlacementErrors.notFound();

  return toParticipantItem(registration);
}

export async function updateParticipant(
  id: number,
  input: ParticipantUpdateInput,
  adminId: number
): Promise<ParticipantItem> {
  if (!input.interview && !input.selection && !input.placement) throw SelectionPlacementErrors.nothingToUpdate();

  return prisma.$transaction(async (tx) => {
    const registration = await tx.registration.findUnique({ where: { id }, include: participantInclude });
    if (!registration) throw SelectionPlacementErrors.notFound();

    const [currentSelection] = registration.selectionStatuses;
    const [currentPlacement] = registration.placementStatuses;
    if (input.interview) {
      const next = input.interview.status;
      if (next !== registration.registrationStatus) {
        await tx.registrationStatusHistory.create({
          data: { registrationId: id, oldStatus: registration.registrationStatus, newStatus: next,
                  notes: blankToNull(input.interview.notes), changedBy: adminId },
        });
        if (registration.userId) {
          await createNotification(tx, registration.userId, id, buildInterviewNotification(next));
        }
      }
      await tx.registration.update({
        where: { id },
        data: { registrationStatus: next, selectionNotes: blankToNull(input.interview.notes) },
      });
    }
    const selection = resolveSelection(input.selection, currentSelection);
    let placement = resolvePlacement(input.placement, currentPlacement);

    const mustReset = selection.status !== PASSED_SELECTION_STATUS;
    if (mustReset) {
      placement = { status: DEFAULT_PLACEMENT_STATUS, companyName: null, placementDate: null, notes: null };
    }

    assertPlacementAllowed(selection.status, placement);

    if (input.selection) await saveSelection(tx, id, currentSelection, selection, adminId);
    if (input.placement || mustReset) await savePlacement(tx, id, currentPlacement, placement);

    if (registration.userId) {
      const selectionChanged = input.selection && selection.status !== (currentSelection?.status ?? DEFAULT_SELECTION_STATUS);
      const placementChanged = (input.placement || mustReset) && placement.status !== (currentPlacement?.status ?? DEFAULT_PLACEMENT_STATUS);

      if (selectionChanged) {
        await createNotification(tx, registration.userId, id, buildSelectionNotification(selection.status));
      }
      if (placementChanged) {
        await createNotification(tx, registration.userId, id, buildPlacementNotification(placement));
      }
    }

    const updated = await tx.registration.findUniqueOrThrow({ where: { id }, include: participantInclude });
    return toParticipantItem(updated);
  });
}