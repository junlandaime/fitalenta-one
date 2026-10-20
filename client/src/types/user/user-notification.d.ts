export type NotificationItem = {
    id: number;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
};

export type MyNotificationList = {
    notifications: NotificationItem[];
    unreadCount: number;
};

export type NotificationFilter = "all" | "unread";
