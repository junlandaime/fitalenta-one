export type FeedbackStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";

export type FeedbackStatusFilter = FeedbackStatus | "all";

export type UserFeedback = {
    id: number;
    userId: number;
    category: string;
    subject: string;
    message: string;
    pageUrl: string | null;
    status: FeedbackStatus;
    adminNote: string | null;
    createdAt: string;
    updatedAt: string;
    user: {
        name: string;
        email: string;
    };
};

export type FeedbackCreatePayload = {
    category: string;
    subject: string;
    message: string;
    pageUrl?: string;
};

export type FeedbackUpdatePayload = {
    status: FeedbackStatus;
    adminNote?: string | null;
};

export type FeedbackParams = {
    page: number;
    status: FeedbackStatusFilter;
};

export type FeedbackList = {
    items: UserFeedback[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
};
