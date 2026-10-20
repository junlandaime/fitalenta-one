import type { LucideIcon } from "lucide-react";
import { Hourglass, UserPlus, Users, Wallet } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn, formatIDR } from "@/lib/utils";
import type { AdminDashboardSummary } from "@/types/admin/admin-dashboard";

const numberFormat = new Intl.NumberFormat("id-ID");

type StatCardProps = {
    icon: LucideIcon;
    label: string;
    badge: string;
    value: string;
    description: string;
    accent?: boolean;
};

function StatCard({ icon: Icon, label, badge, value, description, accent }: StatCardProps) {
    return (
        <Card className="gap-3 p-5 shadow-xs">
            <div className="flex items-start justify-between">
                <div
                    className={cn(
                        "flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground",
                        accent && "bg-orange-50 text-orange-500 dark:bg-orange-950",
                    )}
                >
                    <Icon className="size-4" aria-hidden />
                </div>
                <span className="rounded-full border bg-muted/50 px-2.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                    {badge}
                </span>
            </div>
            <div className="space-y-1">
                <p className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">{label}</p>
                <p className="text-3xl font-bold tracking-tight tabular-nums">{value}</p>
            </div>
            <p className="text-xs text-muted-foreground">{description}</p>
        </Card>
    );
}

export function StatCards({ summary }: { summary: AdminDashboardSummary }) {
    const { totalRegistrants, newRegistrants, revenue, pendingVerification } = summary;

    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
                icon={Users}
                label="Total Pendaftar"
                badge="Semua Program"
                value={numberFormat.format(totalRegistrants)}
                description="Jumlah peserta yang telah melakukan pendaftaran."
            />
            <StatCard
                icon={UserPlus}
                label="Pendaftar Baru"
                badge={`${newRegistrants.windowDays} Hari`}
                value={numberFormat.format(newRegistrants.count)}
                description="Pendaftar peserta dalam tujuh hari terakhir."
            />
            <StatCard
                icon={Wallet}
                label="Total Pemasukan"
                badge={`${numberFormat.format(revenue.paidCount)} Lunas`}
                value={formatIDR(Number(revenue.total))}
                description="Total pembayaran yang telah tercatat pada sistem."
            />
            <StatCard
                icon={Hourglass}
                label="Verifikasi Tertunda"
                badge="Perlu Tindakan"
                value={numberFormat.format(pendingVerification)}
                description="Proses yang masih membutuhkan tindak lanjut admin."
                accent
            />
        </div>
    );
}