import { formatIDR } from "@/lib/utils";
import { paymentPercent } from "@/helpers/admin/admin-payment-helper";
import type { PaymentItem } from "@/types/admin/admin-payment";

type ProgressProps = Pick<PaymentItem, "amount" | "amountPaid">;

export function ProgressBar({ payment }: { payment: ProgressProps }) {
    const percent = paymentPercent(payment);

    return (
        <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percent}
            aria-label="Progres pelunasan"
            className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
        >
            <div className="h-full rounded-full bg-emerald-500 transition-[width]" style={{ width: `${percent}%` }} />
        </div>
    );
}

export function PaymentProgress({ payment }: { payment: ProgressProps & Pick<PaymentItem, "remainingAmount"> }) {
    return (
        <div className="min-w-32 space-y-1.5">
            <div className="flex items-baseline justify-between gap-3 text-[11px]">
                <span className="text-muted-foreground tabular-nums">{paymentPercent(payment)}%</span>
                <span className="font-semibold text-emerald-600 tabular-nums dark:text-emerald-400">
                    {formatIDR(payment.amountPaid)}
                </span>
            </div>
            <ProgressBar payment={payment} />
            <p className="text-[11px] text-muted-foreground tabular-nums">Sisa {formatIDR(payment.remainingAmount)}</p>
        </div>
    );
}
