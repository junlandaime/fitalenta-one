import { getQuotaPercent } from "@/helpers/admin/admin-program-helper";
import { cn } from "@/lib/utils";
import type { AdminProgram } from "@/types/admin/admin-program";

export function QuotaBar({ program }: { program: AdminProgram }) {
    const percent = getQuotaPercent(program);

    if (percent === undefined) {
        return (
            <div className="space-y-0.5">
                <div className="font-medium tabular-nums">{program.currentParticipants}</div>
                <div className="text-xs text-muted-foreground">Tanpa batas</div>
            </div>
        );
    }

    return (
        <div className="w-28 space-y-1.5">
            <div className="text-sm font-medium tabular-nums">
                {program.currentParticipants}/{program.capacity}
            </div>
            <div
                role="progressbar"
                aria-label="Keterisian kuota"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={percent}
                className="h-1.5 overflow-hidden rounded-full bg-muted"
            >
                <div
                    className={cn("h-full rounded-full", percent >= 100 ? "bg-destructive" : "bg-primary")}
                    style={{ width: `${percent}%` }}
                />
            </div>
        </div>
    );
}
