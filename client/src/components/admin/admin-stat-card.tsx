import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type AdminStatCardProps = {
    title: string;
    value?: number | string;
    note: string;
    icon: LucideIcon;
};

export function AdminStatCard({
    title,
    value,
    note,
    icon: Icon,
}: AdminStatCardProps) {
    return (
        <Card>
            <CardContent className="flex items-center gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <Icon className="size-5" aria-hidden />
                </span>
                <div className="min-w-0 space-y-0.5">
                    <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                        {title}
                    </p>
                    <div className="truncate text-2xl leading-8 font-semibold tabular-nums">
                        {value === undefined ? (
                            <Skeleton className="my-1 h-6 w-12" />
                        ) : typeof value === "number" ? (
                            value.toLocaleString("id-ID")
                        ) : (
                            value
                        )}
                    </div>
                    <p className="truncate text-xs text-muted-foreground">
                        {note}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}