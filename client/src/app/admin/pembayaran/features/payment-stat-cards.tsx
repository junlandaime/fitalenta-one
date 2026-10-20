import { CircleCheck, FilePen, Hourglass, TrendingUp } from "lucide-react";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import { formatIDR } from "@/lib/utils";
import type { PaymentSummary } from "@/types/admin/admin-payment";

export function PaymentStatCards({ summary }: { summary?: PaymentSummary }) {
    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <AdminStatCard
                title="Total pemasukan"
                value={summary ? formatIDR(summary.totalCollected) : undefined}
                note={summary ? `Dari ${summary.totalInvoices.toLocaleString("id-ID")} tagihan tercatat` : "Memuat tagihan..."}
                icon={TrendingUp}
            />
            <AdminStatCard
                title="Belum lunas"
                value={summary?.outstanding}
                note="Diterbitkan, menunggu pelunasan"
                icon={Hourglass}
            />
            <AdminStatCard title="Lunas" value={summary?.paid} note="Tagihan telah dilunasi" icon={CircleCheck} />
            <AdminStatCard title="Draft" value={summary?.drafts} note="Belum diterbitkan ke peserta" icon={FilePen} />
        </div>
    );
}
