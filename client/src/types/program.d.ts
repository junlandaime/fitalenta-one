export type ProgramCategory = {
    id: number;
    name: string;
};

type Money = number | string | null;

export type ProgramStatus = "active" | "inactive" | "full";

export type Program = {
    id: number;
    categoryId?: number | null;
    category?: ProgramCategory | null;
    name: string;
    programFormat?: string | null;
    description?: string | null;
    requirements?: string | null;
    schedule?: string | null;
    duration?: string | null;
    capacity?: number | null;
    currentParticipants?: number | null;
    status: ProgramStatus;
    isRunning: boolean;
    contactInfo?: string | null;
    registrationDeadline?: string | null;
    startDate?: string | null;
    endDate?: string | null;
    location?: string | null;
    trainingCost?: Money;
    trainingFeeDetails?: string | null;
    departureCost?: Money;
    departureFeeDetails?: string | null;
    installmentPlan?: string | null;
    downPayment?: Money;
    jobMatchingCost?: Money;
    bridgeFund?: string | null;
    timelineText?: string | null;
    requirementsText?: string | null;
    sortOrder: number;
    createdAt?: string;
};

export type ProgramsListData = Program[];