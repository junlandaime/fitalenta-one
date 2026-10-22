import { PaymentStatus, PlacementStage, RegistrationStatus, Role } from "../../generated/prisma/client";
import { PaginationQuery } from "../utils/pagination";
import { RegistrationResult } from "./registration.types";

export interface DashboardSummary {
  totalRegistrants: number;
  newRegistrants: { count: number; windowDays: number };
  revenue: { total: string; paidCount: number };
  pendingVerification: number;
}

export interface DashboardFilterOptions {
  programs: { id: number; name: string; programFormat: string | null }[];
  paymentStatuses: PaymentStatus[];
  selectionStatuses: RegistrationStatus[];
  placementStatuses: PlacementStage[];
}

export interface RegistrationFilters extends PaginationQuery {
  search?: string;
  programId?: number;
  paymentStatus?: PaymentStatus;
  selectionStatus?: RegistrationStatus;
  placementStatus?: PlacementStage;
}

export interface RegistrationListItem {
  id: number;
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
    trainingCost: string;
  };
  payment: {
    invoiceNumber: string;
    status: PaymentStatus;
    amount: string;
    amountPaid: string;
    nextDueDate: string | null;
    installment: { current: number; total: number } | null;
  } | null;
  progress: {
    interview: RegistrationStatus;
    selection: RegistrationStatus | null;
    placement: PlacementStage | null;
  };
  documents: {
    n4CertificatePath: string | null;
    sswCertificatePath: string | null;
  };
}

export interface RegistrationDetail {
  registrationId: number;
  registrationCode: string;
  registrationDate: Date;
  registrationStatus: RegistrationStatus;
  selectionNotes: string | null;
  program: {
    id: number | null;
    name: string;
    programFormat: string | null;
    trainingCost: string;
    installmentPlan: string | null;
  };
  applicant: RegistrationResult["applicant"];
  documents: RegistrationResult["documents"];
  payments: {
    id: number;
    invoiceNumber: string;
    status: PaymentStatus;
    amount: string;
    amountPaid: string;
    paymentMethod: string;
    dueDate: string | null;
    nextDueDate: string | null;
    paymentDate: Date | null;
    proofImage: string | null;
    notes: string | null;
  }[];
  selections: {
    status: RegistrationStatus;
    notes: string | null;
    evaluatedAt: Date | null;
  }[];
  placements: {
    status: PlacementStage;
    companyName: string | null;
    placementDate: string | null;
    notes: string | null;
  }[];
  statusHistory: {
    oldStatus: RegistrationStatus | null;
    newStatus: RegistrationStatus | null;
    notes: string | null;
    changedAt: Date;
  }[];
}

export interface UserSummary {
  total: number;
  participants: number;
  superAdmins: number;
  administrators: number;
  editors: number;
  withPhone: number;
}

export interface UserListFilters extends PaginationQuery {
  search?: string;
  role?: Role;
}

export interface UserItem {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
  registrationsCount: number;
  relatedDataCount: number;
  canDelete: boolean;
}

export interface CreateUserInput {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role?: Role;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  phone?: string;
  role?: Role;
}