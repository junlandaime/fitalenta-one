"use client";

import Link from "next/link";
import { Bell, CheckCheck, CircleAlert, RefreshCw } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { NOTIFICATION_PREVIEW_LIMIT } from "@/constants/user/user-notification-constant";
import { formatBadgeCount } from "@/helpers/user/user-notification-helper";
import { useMarkAllNotificationsRead, useMarkNotificationRead, useMyNotifications } from "@/hooks/user/use-user-notifications";
import { cn, timeAgo } from "@/lib/utils";

function PreviewSkeleton() {
    return (
        <div aria-busy="true" aria-label="Memuat notifikasi" className="space-y-3 p-2">
            {Array.from({ length: 3 }, (_, index) => (
                <div key={index} className="space-y-2">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-3 w-full" />
                </div>
            ))}
        </div>
    );
}

export function NotificationBell() {
    const query = useMyNotifications();
    const markRead = useMarkNotificationRead();
    const markAll = useMarkAllNotificationsRead();

    const unread = query.data?.unreadCount ?? 0;
    const preview = query.data?.notifications.slice(0, NOTIFICATION_PREVIEW_LIMIT);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                aria-label={unread > 0 ? `Notifikasi, ${unread} belum dibaca` : "Notifikasi"}
                className={cn(
                    "relative grid size-9 place-items-center rounded-md text-white",
                    "outline-none transition-colors hover:bg-muted-foreground/30",
                    "focus-visible:ring-2 focus-visible:ring-primary",
                )}
            >
                <Bell className="size-5" aria-hidden />
                {unread > 0 && (
                    <span
                        aria-hidden
                        className="absolute -top-0.5 -right-0.5 grid h-4.5 min-w-4.5 place-items-center rounded-full bg-secondary px-1 text-[10px] leading-none font-bold text-white"
                    >
                        {formatBadgeCount(unread)}
                    </span>
                )}
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-80 sm:w-96">
                <DropdownMenuLabel className="flex items-center justify-between">
                    Notifikasi
                    {unread > 0 && (
                        <span className="text-xs font-normal text-muted-foreground">{unread} belum dibaca</span>
                    )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {query.isError ? (
                    <div className="space-y-1 p-2">
                        <p className="flex items-center gap-2 text-sm text-destructive">
                            <CircleAlert className="size-4 shrink-0" aria-hidden />
                            Notifikasi gagal dimuat.
                        </p>
                        <DropdownMenuItem
                            disabled={query.isFetching}
                            onSelect={(event) => {
                                event.preventDefault();
                                query.refetch();
                            }}
                        >
                            <RefreshCw className={query.isFetching ? "animate-spin" : undefined} aria-hidden />
                            Coba lagi
                        </DropdownMenuItem>
                    </div>
                ) : !preview ? (
                    <PreviewSkeleton />
                ) : preview.length === 0 ? (
                    <p className="px-2 py-8 text-center text-sm text-muted-foreground">Belum ada notifikasi.</p>
                ) : (
                    preview.map((notification) => (
                        <DropdownMenuItem
                            key={notification.id}
                            onSelect={() => {
                                if (!notification.isRead) markRead.mutate(notification.id);
                            }}
                            className="items-start gap-3 py-2"
                        >
                            <span
                                aria-hidden
                                className={cn(
                                    "mt-1.5 size-2 shrink-0 rounded-full",
                                    notification.isRead ? "bg-transparent" : "bg-secondary",
                                )}
                            />
                            <span className="min-w-0 flex-1 space-y-0.5">
                                <span
                                    className={cn(
                                        "block truncate",
                                        notification.isRead ? "font-medium" : "font-semibold",
                                    )}
                                >
                                    {notification.isRead ? null : <span className="sr-only">Belum dibaca: </span>}
                                    {notification.title}
                                </span>
                                <span className="line-clamp-2 block text-xs text-muted-foreground">
                                    {notification.message}
                                </span>
                                <span className="block text-[11px] text-muted-foreground/80">
                                    {timeAgo(notification.createdAt, "id")}
                                </span>
                            </span>
                        </DropdownMenuItem>
                    ))
                )}

                <DropdownMenuSeparator />
                <DropdownMenuItem
                    disabled={unread === 0 || markAll.isPending}
                    onSelect={(event) => {
                        event.preventDefault();
                        markAll.mutate();
                    }}
                >
                    <CheckCheck aria-hidden />
                    Tandai semua dibaca
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/user/notifikasi" className="justify-center font-medium text-primary">
                        Lihat semua notifikasi
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
