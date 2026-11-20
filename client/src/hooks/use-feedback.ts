"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    createFeedback,
    getAdminFeedbacks,
    updateAdminFeedback,
} from "@/services/feedback-service";
import type { FeedbackParams, FeedbackUpdatePayload } from "@/types/feedback";

const FEEDBACK_KEY = ["feedback"] as const;

export function useCreateFeedback() {
    return useMutation({ mutationFn: createFeedback });
}

export function useAdminFeedbacks(params: FeedbackParams) {
    return useQuery({
        queryKey: [...FEEDBACK_KEY, "admin", "list", params],
        queryFn: () => getAdminFeedbacks(params),
        staleTime: 30_000,
        placeholderData: keepPreviousData,
    });
}

export function useUpdateAdminFeedback() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: FeedbackUpdatePayload }) =>
            updateAdminFeedback(id, payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: FEEDBACK_KEY }),
    });
}
