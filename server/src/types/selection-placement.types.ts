import { PlacementStage, RegistrationStatus } from "../../generated/prisma/client";
import { PaginationQuery } from "../utils/pagination";

export interface SelectionPlacementSummary {
  totalParticipants: number;
  waitingSelection: number;
  passedSelection: number;
  placed: number;
}

export interface SelectionPlacementOptions {
  selectionStatuses: RegistrationStatus[];
  placementStatuses: PlacementStage[];
}

export interface ParticipantFilters extends PaginationQuery {
  search?: string;
  selectionStatus?: RegistrationStatus;
  placementStatus?: PlacementStage;
}

export interface PlacementState {
  status: PlacementStage;
  companyName: string | null;
  placementDate: Date | null;
  notes: string | null;
}

export interface ParticipantItem {
  registrationId: number;
  registrationCode: string;
  registrationDate: Date;
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
  interview: {
  status: RegistrationStatus;
  notes: string | null;
  };
  selection: {
    status: RegistrationStatus;
    notes: string | null;
    evaluatedAt: Date | null;
  };
  placement: {
    status: PlacementStage;
    determined: boolean;
    editable: boolean;
    companyName: string | null;
    placementDate: string | null;
    notes: string | null;
  };
}

export interface SelectionInput {
  status: RegistrationStatus;
  notes?: string | null;
}

export interface PlacementInput {
  status: PlacementStage;
  companyName?: string | null;
  placementDate?: Date | null;
  notes?: string | null;
}

export interface ParticipantUpdateInput {
  interview?: SelectionInput;
  selection?: SelectionInput;
  placement?: PlacementInput;
}