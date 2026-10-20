"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, CheckCheck, CircleAlert, Loader2 } from "lucide-react";
import { RefreshButton } from "@/app/(user)/dashboard/features/refresh";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { NOTIFICATION_FILTERS, NOTIFICATIONS_PER_PAGE } from "@/constants/user/user-notification-constant";
import { useMarkAllNotificationsRead, useMarkNotificationRead, useMyNotifications } from "@/hooks/user/use-user-notifications";
import { isApiError } from "@/lib/api-error";
import type { NotificationFilter } from "@/types/user/user-notification";
import { NotificationEmpty, NotificationFilteredEmpty } from "./notification-empty";
import { NotificationItem } from "./notification-item";

function LoadingList() {
    return (
        <div aria-busy="true" aria-label="Memuat notifikasi" className="divide-y">
            {Array.from({ length: 4 }, (_, index) => (
                <div key={index} className="flex gap-4 px-6 py-5">
                    <Skeleton className="size-10 shrink-0 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-4 w-full max-w-md" />
                        <Skeleton className="h-3 w-20" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export function NotificationView() {
    const router = useRouter();
    const [filter, setFilter] = useState<NotificationFilter>("all");
    const [limit, setLimit] = useState(NOTIFICATIONS_PER_PAGE);

    const query = useMyNotifications();
    const markRead = useMarkNotificationRead();
    const markAll = useMarkAllNotificationsRead();

    const unauthorized = isApiError(query.error) && query.error.status === 401;
    useEffect(() => {
        if (unauthorized) router.replace("/login?next=/notifikasi");
    }, [unauthorized, router]);

    const all = query.data?.notifications;
    const unreadCount = query.data?.unreadCount ?? 0;
    const filtered = filter === "unread" ? all?.filter((notification) => !notification.isRead) : all;
    const visible = filtered?.slice(0, limit);
    const hasMore = (filtered?.length ?? 0) > limit;

    const pendingId = markRead.isPending ? markRead.variables : undefined;
    const actionError = markAll.error ?? markRead.error;

    function handleFilterChange(next: NotificationFilter) {
        setFilter(next);
        setLimit(NOTIFICATIONS_PER_PAGE);
    }

    return (
        <div className="space-y-6">
            <header className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-primary md:text-4xl">Notifikasi</h1>
                    <p className="mt-3 text-muted-foreground">
                        {unreadCount > 0
                            ? `Anda memiliki ${unreadCount} notifikasi yang belum dibaca.`
                            : "Pantau pembaruan terbaru terkait program Anda."}
                    </p>
                </div>
                <RefreshButton onRefresh={() => query.refetch()} loading={query.isFetching} />
            </header>

            {actionError && (
                <Alert variant="destructive">
                    <CircleAlert aria-hidden />
                    <AlertTitle>Notifikasi gagal diperbarui</AlertTitle>
                    <AlertDescription>{actionError.message}</AlertDescription>
                </Alert>
            )}

            <Card className="gap-0 overflow-hidden rounded-3xl py-0 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b p-6">
                    <div className="flex items-center gap-3">
                        <span className="grid size-11 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
                            <Bell className="size-5" aria-hidden />
                        </span>
                        <div>
                            <h2 className="text-xl font-bold text-primary">Kotak Notifikasi</h2>
                            <p className="text-sm text-muted-foreground">Pembaruan terbaru ditampilkan paling atas.</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <div role="group" aria-label="Filter notifikasi" className="flex gap-1">
                            {NOTIFICATION_FILTERS.map(({ value, label }) => (
                                <Button
                                    key={value}
                                    size="lg"
                                    variant={filter === value ? "default" : "outline"}
                                    aria-pressed={filter === value}
                                    onClick={() => handleFilterChange(value)}
                                >
                                    {label}
                                    {value === "unread" && unreadCount > 0 && ` (${unreadCount})`}
                                </Button>
                            ))}
                        </div>
                        <Button
                            size="lg"
                            variant="outline"
                            disabled={unreadCount === 0 || markAll.isPending}
                            onClick={() => markAll.mutate()}
                            className="border-primary font-semibold text-primary"
                        >
                            {markAll.isPending ? (
                                <Loader2 className="animate-spin" data-icon="inline-start" aria-hidden />
                            ) : (
                                <CheckCheck data-icon="inline-start" aria-hidden />
                            )}
                            Tandai semua dibaca
                        </Button>
                    </div>
                </div>

                {query.isError && !unauthorized ? (
                    <div className="p-6">
                        <Alert variant="destructive">
                            <CircleAlert aria-hidden />
                            <AlertTitle>Notifikasi gagal dimuat</AlertTitle>
                            <AlertDescription>{query.error.message}</AlertDescription>
                        </Alert>
                    </div>
                ) : !visible || unauthorized ? (
                    <LoadingList />
                ) : visible.length === 0 ? (
                    filter === "all" ? (
                        <NotificationEmpty />
                    ) : (
                        <NotificationFilteredEmpty onReset={() => handleFilterChange("all")} />
                    )
                ) : (
                    <ul className="divide-y">
                        {visible.map((notification) => (
                            <NotificationItem
                                key={notification.id}
                                notification={notification}
                                pending={pendingId === notification.id}
                                onRead={(item) => markRead.mutate(item.id)}
                            />
                        ))}
                    </ul>
                )}

                {hasMore && (
                    <div className="flex justify-center border-t bg-muted/30 px-6 py-3">
                        <Button variant="ghost" onClick={() => setLimit((current) => current + NOTIFICATIONS_PER_PAGE)}>
                            Tampilkan lebih banyak
                        </Button>
                    </div>
                )}
            </Card>
        </div>
    );
}
