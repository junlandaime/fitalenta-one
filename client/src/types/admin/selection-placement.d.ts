import type { AdminPageMeta } from "@/types/pagination";

export type SelectionStatus = "menunggu" | "lolos" | "tidak_lolos";

export type PlacementStatus = "proses" | "lolos" | "ditempatkan";

export type SelectionPlacementSummary = {
    totalParticipants: number;
    waitingSelection: number;
    passedSelection: number;
    placed: number;
};

export type SelectionPlacementOptions = {
    selectionStatuses: SelectionStatus[];
    placementStatuses: PlacementStatus[];
};

export type Participant = {
    registrationId: number;
    registrationCode: string;
    registrationDate: string;
    participant: {
        userId: number | null;
        name: string;
        email: string;
        phone: string | null;
        photoPath: string | null;
    };
    program: {
        id: number | null;
        name: string;
        programFormat: string | null;
        duration: string | null;
    };
    selection: {
        status: SelectionStatus;
        notes: string | null;
        evaluatedAt: string | null;
    };
    placement: {
        status: PlacementStatus;
        determined: boolean;
        editable: boolean;
        companyName: string | null;
        placementDate: string | null;
        notes: string | null;
    };
};

export type ParticipantList = {
    items: Participant[];
    meta: AdminPageMeta;
};

export type ParticipantParams = {
    page: number;
    search: string;
    selectionStatus: SelectionStatus | "all";
    placementStatus: PlacementStatus | "all";
};

export type SelectionPayload = {
    status: SelectionStatus;
    notes: string | null;
};

export type PlacementPayload = {
    status: PlacementStatus;
    companyName: string | null;
    placementDate: string | null;
    notes: string | null;
};

export type ParticipantUpdatePayload = {
    selection?: SelectionPayload;
    placement?: PlacementPayload;
};
