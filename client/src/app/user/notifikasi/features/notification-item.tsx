import { Bell, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, formatDate, formatTime, timeAgo } from "@/lib/utils";
import type { NotificationItem as NotificationData } from "@/types/user/user-notification";

type Props = {
    notification: NotificationData;
    pending: boolean;
    onRead: (notification: NotificationData) => void;
};

export function NotificationItem({ notification, pending, onRead }: Props) {
    const { title, message, isRead, createdAt } = notification;
    const exactTime = [formatDate(createdAt, "id-ID"), formatTime(createdAt)].filter(Boolean).join(", ");

    return (
        <li className={cn("flex gap-4 px-6 py-5 transition-colors", !isRead && "bg-indigo-50/40")}>
            <span
                aria-hidden
                className={cn(
                    "mt-0.5 grid size-10 shrink-0 place-items-center rounded-full",
                    isRead ? "bg-slate-100 text-slate-500" : "bg-indigo-100 text-indigo-600",
                )}
            >
                <Bell className="size-5" />
            </span>

            <div className="min-w-0 flex-1 space-y-1">
                <h3 className={cn("text-sm text-primary", isRead ? "font-medium" : "font-bold")}>
                    {!isRead && <span className="sr-only">Belum dibaca: </span>}
                    {title}
                </h3>
                <p className="text-sm leading-relaxed whitespace-pre-line text-muted-foreground">{message}</p>
                <time dateTime={createdAt} title={exactTime} className="block text-xs text-muted-foreground/80">
                    {timeAgo(createdAt, "id")}
                </time>
            </div>

            {!isRead && (
                <Button
                    variant="ghost"
                    size="sm"
                    disabled={pending}
                    aria-label={`Tandai dibaca: ${title}`}
                    onClick={() => onRead(notification)}
                    className="shrink-0 self-start text-primary"
                >
                    {pending && <Loader2 className="animate-spin" data-icon="inline-start" aria-hidden />}
                    Tandai dibaca
                </Button>
            )}
        </li>
    );
}
