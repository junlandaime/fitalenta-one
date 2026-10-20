import { CircleCheck, FileText, TrendingUp, TriangleAlert } from "lucide-react";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import { formatIDR } from "@/lib/utils";
import type { ReportSummary } from "@/types/admin/financial-report";

export function ReportStatCards({ summary }: { summary?: ReportSummary }) {
    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <AdminStatCard
                title="Total pemasukan"
                value={summary ? formatIDR(summary.totalCollected) : undefined}
                note={summary ? `Dari ${summary.totalRecords.toLocaleString("id-ID")} transaksi` : "Memuat transaksi..."}
                icon={TrendingUp}
            />
            <AdminStatCard
                title="Total tagihan"
                value={summary ? formatIDR(summary.totalBilled) : undefined}
                note="Nilai tagihan, tanpa yang dibatalkan"
                icon={FileText}
            />
            <AdminStatCard
                title="Sisa tagihan"
                value={summary ? formatIDR(summary.totalOutstanding) : undefined}
                note="Belum dibayarkan peserta"
                icon={TriangleAlert}
            />
            <AdminStatCard
                title="Transaksi lunas"
                value={summary?.paidCount}
                note={
                    summary
                        ? `${summary.cashCount.toLocaleString("id-ID")} tunai · ${summary.installmentCount.toLocaleString("id-ID")} cicilan`
                        : "Memuat transaksi..."
                }
                icon={CircleCheck}
            />
        </div>
    );
}
