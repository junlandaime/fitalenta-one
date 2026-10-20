import type { MyNotificationList } from "@/types/user/user-notification";

export function applyMarkRead(list: MyNotificationList, id: number): MyNotificationList {
    const target = list.notifications.find((notification) => notification.id === id);
    if (!target || target.isRead) return list;

    return {
        notifications: list.notifications.map((notification) =>
            notification.id === id ? { ...notification, isRead: true } : notification,
        ),
        unreadCount: Math.max(0, list.unreadCount - 1),
    };
}

export function applyMarkAllRead(list: MyNotificationList): MyNotificationList {
    return {
        notifications: list.notifications.map((notification) => ({ ...notification, isRead: true })),
        unreadCount: 0,
    };
}

export function formatBadgeCount(count: number) {
    return count > 99 ? "99+" : String(count);
}
