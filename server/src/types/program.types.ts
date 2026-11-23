import { ProgramStatus } from "../../generated/prisma/client";
import { PaginationQuery } from "../utils/pagination";

export interface ProgramSummary {
  total: number;
  active: number;
  inactive: number;
  full: number;
  totalCapacity: number;
}

export interface ProgramOptions {
  categories: { id: number; name: string }[];
  programFormats: string[];
  statuses: ProgramStatus[];
}

export interface ProgramListFilters extends PaginationQuery {
  search?: string;
  categoryId?: number;
  status?: ProgramStatus;
  isRunning?: boolean;
}

export interface ProgramListItem {
  id: number;
  name: string;
  programFormat: string | null;
  formTemplate: string;
  category: { id: number; name: string } | null;
  duration: string | null;
  capacity: number | null;
  currentParticipants: number;
  remainingSlots: number | null;
  trainingCost: string;
  status: ProgramStatus;
  isRunning: boolean;
  sortOrder: number;
  registrationCount: number;
  canDelete: boolean;
}

export interface ProgramDetail extends ProgramListItem {
  categoryId: number | null;
  description: string | null;
  requirements: string | null;
  schedule: string | null;
  contactInfo: string | null;
  registrationDeadline: string | null;
  startDate: string | null;
  endDate: string | null;
  location: string | null;
  trainingFeeDetails: string | null;
  departureCost: string;
  departureFeeDetails: string | null;
  installmentPlan: string | null;
  downPayment: string;
  jobMatchingCost: string;
  bridgeFund: string | null;
  timelineText: string | null;
  requirementsText: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProgramInput {
  name?: string;
  programFormat?: string | null;
  formTemplate?: string;
  categoryId?: number | null;
  description?: string | null;
  requirements?: string | null;
  schedule?: string | null;
  duration?: string | null;
  capacity?: number | null;
  status?: ProgramStatus;
  isRunning?: boolean;
  contactInfo?: string | null;
  registrationDeadline?: Date | null;
  startDate?: Date | null;
  endDate?: Date | null;
  location?: string | null;
  trainingCost?: number;
  trainingFeeDetails?: string | null;
  departureCost?: number;
  departureFeeDetails?: string | null;
  installmentPlan?: string;
  downPayment?: number;
  jobMatchingCost?: number;
  bridgeFund?: string | null;
  timelineText?: string | null;
  requirementsText?: string | null;
  sortOrder?: number;
}

export type CreateProgramInput = ProgramInput & { name: string };
export type UpdateProgramInput = ProgramInput;