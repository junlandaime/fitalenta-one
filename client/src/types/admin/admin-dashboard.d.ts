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

export type RegistrationStatus = "menunggu" | "lolos" | "tidak_lolos";

export type PlacementStage = string;

export type AdminDashboardSummary = {
    totalRegistrants: number;
    newRegistrants: { count: number; windowDays: number };
    revenue: { total: string; paidCount: number };
    pendingVerification: number;
};

export type AdminFilterOptions = {
    programs: { id: number; name: string; programFormat: string | null }[];
    paymentStatuses: PaymentStatus[];
    selectionStatuses: RegistrationStatus[];
    placementStatuses: PlacementStage[];
};

export type AdminRegistrationListItem = {
    id: number;
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
};

export type PaginationMeta = {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
};

export type AdminRegistrationList = {
    items: AdminRegistrationListItem[];
    meta: PaginationMeta;
};

export type AdminRegistrationQuery = {
    search: string;
    programId: string;
    paymentStatus: PaymentStatus | "";
    selectionStatus: RegistrationStatus | "";
    placementStatus: PlacementStage | "";
    page: number;
    limit: number;
};