import type { AdminPageMeta } from "@/types/admin-common";

export type AdminProgramStatus = "active" | "inactive" | "full";

export type AdminProgram = {
    id: number;
    name: string;
    programFormat: string | null;
    category: { id: number; name: string } | null;
    duration: string | null;
    capacity: number | null;
    currentParticipants: number;
    remainingSlots: number | null;
    trainingCost: string;
    status: AdminProgramStatus;
    isRunning: boolean;
    sortOrder: number;
    registrationCount: number;
    canDelete: boolean;
};

export type AdminProgramDetail = AdminProgram & {
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
    createdAt: string;
    updatedAt: string;
};

export type AdminProgramSummary = {
    total: number;
    active: number;
    inactive: number;
    full: number;
    totalCapacity: number;
};

export type AdminProgramOptions = {
    categories: { id: number; name: string }[];
    programFormats: string[];
    statuses: AdminProgramStatus[];
};

export type AdminProgramList = {
    programs: AdminProgram[];
    meta: AdminPageMeta;
};

export type AdminProgramParams = {
    page: number;
    search: string;
    categoryId: string;
    status: AdminProgramStatus | "all";
    running: "all" | "true" | "false";
};

export type AdminProgramPayload = {
    name: string;
    programFormat: string | null;
    categoryId: number | null;
    description: string | null;
    requirements: string | null;
    requirementsText: string | null;
    schedule: string | null;
    timelineText: string | null;
    contactInfo: string | null;
    duration: string | null;
    location: string | null;
    capacity: number | null;
    registrationDeadline: string | null;
    startDate: string | null;
    endDate: string | null;
    trainingCost: number;
    trainingFeeDetails: string | null;
    departureCost: number;
    departureFeeDetails: string | null;
    installmentPlan: string;
    downPayment: number;
    jobMatchingCost: number;
    bridgeFund: string | null;
    status: AdminProgramStatus;
    isRunning: boolean;
    sortOrder: number;
};
