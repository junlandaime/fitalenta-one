import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { getStatus, PAYMENT_METHOD_LABEL, TONE_CLASS, type StatusKind } from "@/constants/user/dashboard-constant";
import { cn } from "@/lib/utils";
import type { DashboardData } from "@/types/user/dashboard";

function StatusBadge({ value, kind }: { value?: string | null; kind: StatusKind }) {
    const status = getStatus(value, kind);
    if (!status) return <span className="text-muted-foreground">-</span>;
    return (
        <Badge variant="outline" className={cn("font-medium", TONE_CLASS[status.tone])}>
            {status.label}
        </Badge>
    );
}

function Item({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div>
            <dt className="text-sm text-muted-foreground">{label}</dt>
            <dd className="mt-1.5 font-semibold text-primary">{children}</dd>
        </div>
    );
}

export function RegistrationDetail({ data }: { data: DashboardData }) {
    return (
        <dl className="grid gap-x-8 gap-y-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
            <Item label="Program">{data.program?.name ?? "-"}</Item>
            <Item label="Kode Pendaftaran">
                <span className="font-mono">{data.registrationCode ?? "-"}</span>
            </Item>
            <Item label="Status Pendaftaran"><StatusBadge kind="registration" value={data.registrationStatus} /></Item>
            <Item label="Status Seleksi"><StatusBadge kind="registration" value={data.selectionStatus?.status} /></Item>
            <Item label="Status Penempatan"><StatusBadge kind="placement" value={data.placementStatus?.status} /></Item>
            <Item label="Pembayaran"><StatusBadge kind="payment" value={data.payment?.status} /></Item>
            {data.payment?.method && (
                <Item label="Metode Pembayaran">
                    {PAYMENT_METHOD_LABEL[data.payment.method] ?? data.payment.method}
                </Item>
            )}
        </dl>
    );
}