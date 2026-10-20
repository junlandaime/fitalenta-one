import { Ban, CircleCheck, CircleDashed, CircleX, Hourglass, Wallet, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { StatusMap, StatusTone } from "@/constants/admin/admin-status";
import { cn } from "@/lib/utils";

const TONES: Record<StatusTone, { className: string; Icon: LucideIcon }> = {
    success: {
        className: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300",
        Icon: CircleCheck,
    },
    warning: {
        className: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300",
        Icon: Hourglass,
    },
    danger: {
        className: "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300",
        Icon: CircleX,
    },
    info: {
        className: "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-300",
        Icon: Wallet,
    },
    process: {
        className: "border-indigo-200 bg-indigo-50 text-indigo-600 dark:border-indigo-900 dark:bg-indigo-950 dark:text-indigo-300",
        Icon: CircleDashed,
    },
    muted: { className: "border-border bg-muted text-muted-foreground", Icon: Ban },
};

type Props = { tone: StatusTone; children: React.ReactNode; className?: string };

export function ToneBadge({ tone, children, className }: Props) {
    const { className: toneClass, Icon } = TONES[tone];
    return (
        <Badge variant="outline" className={cn("gap-1 text-[11px] font-semibold whitespace-nowrap", toneClass, className)}>
            <Icon className="size-3" aria-hidden />
            {children}
        </Badge>
    );
}

export function StatusBadge({ map, value, label }: { map: StatusMap; value: string; label?: string }) {
    const meta = map[value] ?? { label: value, tone: "muted" as const };
    return <ToneBadge tone={meta.tone}>{label ?? meta.label}</ToneBadge>;
}