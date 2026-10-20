import type { LucideIcon } from "lucide-react";
import { Phone, ShieldCheck, User, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { AdminUserSummary } from "@/types/admin/admin-user";

type StatCardProps = {
    title: string;
    value?: number;
    note: string;
    icon: LucideIcon;
};

function StatCard({ title, value, note, icon: Icon }: StatCardProps) {
    return (
        <Card>
            <CardContent className="flex items-center gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <Icon className="size-5" aria-hidden />
                </span>
                <div className="min-w-0 space-y-0.5">
                    <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{title}</p>
                    <div className="text-2xl leading-8 font-semibold tabular-nums">
                        {value === undefined ? <Skeleton className="my-1 h-6 w-12" /> : value.toLocaleString("id-ID")}
                    </div>
                    <p className="truncate text-xs text-muted-foreground">{note}</p>
                </div>
            </CardContent>
        </Card>
    );
}

export function UserStatCards({ summary }: { summary?: AdminUserSummary }) {
    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard title="Total user" value={summary?.total} note="Seluruh akun terdaftar" icon={Users} />
            <StatCard title="Peserta" value={summary?.participants} note="Akun peserta program" icon={User} />
            <StatCard
                title="Administrator"
                value={summary?.administrators}
                note={summary?.editors ? `Pengelola sistem • ${summary.editors} editor` : "Pengelola sistem"}
                icon={ShieldCheck}
            />
            <StatCard title="Kontak terisi" value={summary?.withPhone} note="Memiliki nomor telepon" icon={Phone} />
        </div>
    );
}
