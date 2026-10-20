export type DashboardProgram = {
    id?: number;
    name: string;
    programFormat?: string | null;
    location?: string | null;
};

export type PaymentStatus =
    | "pending"
    | "installment_1"
    | "installment_2"
    | "installment_3"
    | "installment_4"
    | "installment_5"
    | "installment_6"
    | "paid"
    | "overdue"
    | "cancelled";

export type PaymentMethod = "transfer" | "cash" | "credit_card";

export type DashboardPayment = {
    status?: PaymentStatus | null;
    method?: PaymentMethod | null;
    amount?: string | null;
    amountPaid?: string | null;
    dueDate?: string | null;
    [key: string]: unknown;
};

export type RegistrationStatus = "menunggu" | "lolos" | "tidak_lolos";
export type PlacementStage = "proses" | "lolos" | "ditempatkan";

export type DashboardSelection = {
    status: RegistrationStatus | null;
    notes?: string | null;
    evaluatedAt?: string | null;
};

export type DashboardPlacement = {
    status: PlacementStage | null;
    companyName?: string | null;
    placementDate?: string | null;
};

export type DashboardData = {
    program: DashboardProgram | null;
    registrationStatus: RegistrationStatus | null;
    registrationCode: string | null;
    selectionStatus: DashboardSelection | null;
    placementStatus: DashboardPlacement | null;
    payment: DashboardPayment | null;
    unreadNotifications: number;
    hasRegistration: boolean;
};