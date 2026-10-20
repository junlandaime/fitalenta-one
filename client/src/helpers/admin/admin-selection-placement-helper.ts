import { PASSED_SELECTION_STATUS } from "@/constants/admin/selection-placement-constant";
import type { SelectionPlacementFormValues } from "@/schemas/admin/admin-selection-placement";
import type { Participant, ParticipantUpdatePayload } from "@/types/admin/selection-placement";

const blankToNull = (value: string) => {
    const trimmed = value.trim();
    return trimmed === "" ? null : trimmed;
};

export function getInitials(name: string) {
    return (
        name
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((word) => word[0]?.toUpperCase())
            .join("") || "?"
    );
}

export function toFormValues(participant: Participant): SelectionPlacementFormValues {
    const { selection, placement } = participant;

    return {
        selectionStatus: selection.status,
        selectionNotes: selection.notes ?? "",
        placementStatus: placement.status,
        companyName: placement.companyName ?? "",
        placementDate: placement.placementDate ?? "",
        placementNotes: placement.notes ?? "",
    };
}

export function buildUpdatePayload(
    participant: Participant,
    values: SelectionPlacementFormValues,
): ParticipantUpdatePayload {
    const { selection, placement } = participant;
    const payload: ParticipantUpdatePayload = {};

    const selectionNotes = blankToNull(values.selectionNotes);
    if (values.selectionStatus !== selection.status || selectionNotes !== selection.notes) {
        payload.selection = { status: values.selectionStatus, notes: selectionNotes };
    }

    if (values.selectionStatus !== PASSED_SELECTION_STATUS) return payload;

    const next = {
        status: values.placementStatus,
        companyName: blankToNull(values.companyName),
        placementDate: blankToNull(values.placementDate),
        notes: blankToNull(values.placementNotes),
    };
    const placementChanged =
        next.status !== placement.status ||
        next.companyName !== placement.companyName ||
        next.placementDate !== placement.placementDate ||
        next.notes !== placement.notes;

    if (placementChanged) payload.placement = next;
    return payload;
}
