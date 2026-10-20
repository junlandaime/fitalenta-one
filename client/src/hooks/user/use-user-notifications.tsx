"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { NOTIFICATION_POLL_INTERVAL } from "@/constants/user/user-notification-constant";
import { applyMarkAllRead, applyMarkRead } from "@/helpers/user/user-notification-helper";
import { isApiError } from "@/lib/api-error";
import {
    getMyNotifications,
    markAllNotificationsRead,
    markNotificationRead,
} from "@/services/user/user-notification-service";
import type { MyNotificationList } from "@/types/user/user-notification";

const NOTIFICATIONS_KEY = ["user", "notifications"] as const;

export function useMyNotifications() {
    return useQuery({
        queryKey: NOTIFICATIONS_KEY,
        queryFn: getMyNotifications,
        staleTime: 30_000,
        retry: (count, error) => !(isApiError(error) && error.status === 401) && count < 2,
        refetchInterval: (query) => (query.state.status === "error" ? false : NOTIFICATION_POLL_INTERVAL),
    });
}

function useNotificationMutation<TData, TVariables>(
    mutationFn: (variables: TVariables) => Promise<TData>,
    optimistic: (list: MyNotificationList, variables: TVariables) => MyNotificationList,
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn,
        onMutate: async (variables: TVariables) => {
            await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_KEY });
            const previous = queryClient.getQueryData<MyNotificationList>(NOTIFICATIONS_KEY);
            if (previous) queryClient.setQueryData(NOTIFICATIONS_KEY, optimistic(previous, variables));
            return { previous };
        },
        onError: (_error, _variables, context) => {
            if (context?.previous) queryClient.setQueryData(NOTIFICATIONS_KEY, context.previous);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY });
            queryClient.invalidateQueries({ queryKey: ["user-dashboard"] });
        },
    });
}

export function useMarkNotificationRead() {
    return useNotificationMutation(markNotificationRead, applyMarkRead);
}

export function useMarkAllNotificationsRead() {
    return useNotificationMutation<void, void>(markAllNotificationsRead, (list) => applyMarkAllRead(list));
}
