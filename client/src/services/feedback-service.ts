import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type {
    FeedbackCreatePayload,
    FeedbackList,
    FeedbackParams,
    FeedbackUpdatePayload,
    UserFeedback,
} from "@/types/feedback";

export async function createFeedback(payload: FeedbackCreatePayload): Promise<UserFeedback> {
    const { data } = await api.post<ApiResponse<UserFeedback>>("/feedback", payload);
    return data.data;
}

export async function getAdminFeedbacks({ page, status }: FeedbackParams): Promise<FeedbackList> {
    const { data } = await api.get<{ success: boolean; data: UserFeedback[]; meta: FeedbackList["meta"] }>(
        "/admin/feedback",
        {
            params: {
                page,
                limit: 10,
                status: status === "all" ? undefined : status,
            },
        },
    );
    return { items: data.data, meta: data.meta };
}

export async function updateAdminFeedback(id: number, payload: FeedbackUpdatePayload): Promise<UserFeedback> {
    const { data } = await api.patch<ApiResponse<UserFeedback>>(`/admin/feedback/${id}`, payload);
    return data.data;
}
