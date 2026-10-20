import { ToneBadge } from "@/app/admin/dashboard/features/status-badge";
import { USER_PAYMENT_STATE } from "@/constants/user/user-payment-constant";
import type { MyPaymentItem } from "@/types/user/user-payment";

export function PaymentStateBadges({ payment }: { payment: Pick<MyPaymentItem, "state" | "isOverdue"> }) {
    const meta = USER_PAYMENT_STATE[payment.state];

    return (
        <div className="flex flex-wrap items-center gap-1.5">
            <ToneBadge tone={meta.tone}>{meta.label}</ToneBadge>
            {payment.isOverdue && <ToneBadge tone="danger">Jatuh Tempo</ToneBadge>}
        </div>
    );
}
