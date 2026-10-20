import type { ReactNode } from "react";
import { Check, Circle, CircleDot, Hourglass } from "lucide-react";
import { ProgressBar } from "@/app/admin/pembayaran/features/payment-progress";
import { statusLabel } from "@/constants/user/dashboard-constant";
import { formatShortDate, formatShortTime } from "@/helpers/admin/admin-helper";
import { getInstallmentSteps } from "@/helpers/user/user-payment-helper";
import { cn, formatIDR } from "@/lib/utils";
import type { MyPaymentHistoryItem, MyPaymentItem } from "@/types/user/user-payment";

export function SectionTitle({ children }: { children: ReactNode }) {
    return <h4 className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">{children}</h4>;
}

export function InfoItem({ label, children }: { label: string; children?: ReactNode }) {
    return (
        <div className="min-w-0 space-y-0.5">
            <dt className="text-[11px] text-muted-foreground">{label}</dt>
            <dd className="text-sm font-medium wrap-break-word">{children ?? "-"}</dd>
        </div>
    );
}

function Figure({ label, value, className }: { label: string; value: string; className?: string }) {
    return (
        <div className="space-y-0.5 rounded-lg border bg-muted/30 p-3">
            <p className="text-[11px] text-muted-foreground">{label}</p>
            <p className={cn("text-sm font-semibold tabular-nums", className)}>{formatIDR(value)}</p>
        </div>
    );
}

export function AmountSummary({ payment }: { payment: MyPaymentItem }) {
    return (
        <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
                <Figure label="Total tagihan" value={payment.amount} />
                <Figure label="Terbayar" value={payment.amountPaid} className="text-emerald-600" />
                <Figure label="Sisa" value={payment.remainingAmount} />
            </div>
            <ProgressBar payment={payment} />
        </div>
    );
}

const STEP_STYLE = {
    paid: { Icon: Check, className: "border-emerald-500 bg-emerald-500 text-white", label: "Terverifikasi" },
    verifying: { Icon: Hourglass, className: "border-indigo-500 text-indigo-600", label: "Menunggu verifikasi" },
    next: { Icon: CircleDot, className: "border-sky-500 text-sky-600", label: "Berikutnya" },
    waiting: { Icon: Circle, className: "border-border text-muted-foreground", label: "Menunggu" },
} as const;

export function InstallmentSteps({ payment }: { payment: MyPaymentItem }) {
    const steps = getInstallmentSteps(payment);
    if (steps.length === 0) return null;

    return (
        <ul className="divide-y rounded-lg border">
            {steps.map(({ number, amount, state }) => {
                const { Icon, className, label } = STEP_STYLE[state];

                return (
                    <li key={number} className="flex items-center justify-between gap-3 px-3 py-2.5 text-sm">
                        <span className="flex items-center gap-2.5">
                            <span className={cn("flex size-5 items-center justify-center rounded-full border", className)}>
                                <Icon className="size-3" aria-hidden />
                            </span>
                            Cicilan ke-{number}
                        </span>
                        <span className="flex items-center gap-3">
                            <span className="text-[11px] text-muted-foreground">{label}</span>
                            <span className="font-medium tabular-nums">{formatIDR(amount)}</span>
                        </span>
                    </li>
                );
            })}
        </ul>
    );
}

export function HistoryTimeline({ history }: { history: MyPaymentHistoryItem[] }) {
    if (history.length === 0) {
        return <p className="text-sm text-muted-foreground">Belum ada riwayat.</p>;
    }

    return (
        <ol className="space-y-4 border-l pl-4">
            {history.map((entry) => {
                const changed = entry.newStatus && entry.oldStatus !== entry.newStatus;

                return (
                    <li key={entry.id} className="relative space-y-0.5">
                        <span className="absolute top-1.5 -left-5.25 size-2.5 rounded-full border-2 border-background bg-indigo-500" />
                        <p className="text-sm font-medium">
                            {changed && entry.newStatus
                                ? entry.oldStatus
                                    ? `${statusLabel(entry.oldStatus, "payment")} → ${statusLabel(entry.newStatus, "payment")}`
                                    : statusLabel(entry.newStatus, "payment")
                                : "Pembaruan tagihan"}
                        </p>
                        {entry.amountChanged && Number(entry.amountChanged) !== 0 && (
                            <p className="text-xs font-medium text-emerald-600 tabular-nums">
                                +{formatIDR(entry.amountChanged)}
                            </p>
                        )}
                        <p className="text-[11px] text-muted-foreground">
                            {formatShortDate(entry.changedAt)}, {formatShortTime(entry.changedAt)}
                        </p>
                    </li>
                );
            })}
        </ol>
    );
}
