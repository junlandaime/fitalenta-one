import type { NotificationFilter } from "@/types/user/user-notification";

export const NOTIFICATION_PREVIEW_LIMIT = 5;
export const NOTIFICATIONS_PER_PAGE = 10;
export const NOTIFICATION_POLL_INTERVAL = 60_000;

export const NOTIFICATION_FILTERS: { value: NotificationFilter; label: string }[] = [
    { value: "all", label: "Semua" },
    { value: "unread", label: "Belum dibaca" },
];
