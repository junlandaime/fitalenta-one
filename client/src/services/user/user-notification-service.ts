import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { MyNotificationList, NotificationItem } from "@/types/user/user-notification";

const BASE_URL = "/user/notifications";

export async function getMyNotifications(): Promise<MyNotificationList> {
    const { data } = await api.get<ApiResponse<MyNotificationList>>(BASE_URL);
    return data.data;
}

export async function markNotificationRead(id: number): Promise<NotificationItem> {
    const { data } = await api.patch<ApiResponse<NotificationItem>>(`${BASE_URL}/${id}/read`);
    return data.data;
}

export async function markAllNotificationsRead(): Promise<void> {
    await api.patch(`${BASE_URL}/read-all`);
}
