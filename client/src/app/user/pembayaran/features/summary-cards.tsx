import type { ReactNode } from "react";
import { CircleCheck, FileText, Hourglass, Wallet, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn, formatIDR } from "@/lib/utils";
import type { MyPaymentSummary } from "@/types/user/user-payment";

type CardProps = {
    icon: LucideIcon;
    label: string;
    iconClass: string;
    children: ReactNode;
};

function SummaryCard({ icon: Icon, label, iconClass, children }: CardProps) {
    return (
        <Card className="gap-0 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center gap-3">
                <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl", iconClass)}>
                    <Icon className="size-5" aria-hidden />
                </span>
                <p className="text-sm font-medium text-muted-foreground">{label}</p>
            </div>
            <div className="mt-4">{children}</div>
        </Card>
    );
}

const Amount = ({ value, className }: { value: string; className?: string }) => (
    <p className={cn("text-2xl font-extrabold tracking-tight tabular-nums", className)}>{formatIDR(value)}</p>
);

export function PaymentSummaryCards({ summary }: { summary: MyPaymentSummary }) {
    const counts = [
        { label: "Menunggu pembayaran", value: summary.awaitingPayment },
        { label: "Menunggu verifikasi", value: summary.awaitingVerification },
        { label: "Lunas", value: summary.paid },
        { label: "Jatuh tempo", value: summary.overdue, danger: true },
    ];

    return (
        <section aria-label="Ringkasan pembayaran" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryCard icon={Wallet} label="Total Tagihan" iconClass="bg-indigo-50 text-indigo-600">
                <Amount value={summary.totalAmount} className="text-primary" />
                <p className="mt-1 text-xs text-muted-foreground">{summary.totalInvoices} invoice aktif</p>
            </SummaryCard>

            <SummaryCard icon={CircleCheck} label="Sudah Dibayar" iconClass="bg-emerald-50 text-emerald-600">
                <Amount value={summary.totalPaid} className="text-emerald-600" />
                <p className="mt-1 text-xs text-muted-foreground">Telah diverifikasi admin</p>
            </SummaryCard>

            <SummaryCard icon={Hourglass} label="Sisa Tagihan" iconClass="bg-amber-50 text-amber-600">
                <Amount value={summary.totalRemaining} className="text-primary" />
                <p className="mt-1 text-xs text-muted-foreground">Belum dibayar</p>
            </SummaryCard>

            <SummaryCard icon={FileText} label="Status Invoice" iconClass="bg-sky-50 text-sky-600">
                <dl className="space-y-1.5 text-sm">
                    {counts.map(({ label, value, danger }) => (
                        <div key={label} className="flex items-center justify-between gap-3">
                            <dt className="text-muted-foreground">{label}</dt>
                            <dd
                                className={cn(
                                    "font-semibold tabular-nums text-primary",
                                    danger && value > 0 && "text-red-600",
                                )}
                            >
                                {value}
                            </dd>
                        </div>
                    ))}
                </dl>
            </SummaryCard>
        </section>
    );
}
