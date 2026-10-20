import { Building2, CircleCheck, Hourglass, Users } from "lucide-react";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import type { SelectionPlacementSummary } from "@/types/admin/selection-placement";

export function SelectionStatCards({ summary }: { summary?: SelectionPlacementSummary }) {
    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <AdminStatCard
                title="Total peserta"
                value={summary?.totalParticipants}
                note="Peserta pada data aktif"
                icon={Users}
            />
            <AdminStatCard
                title="Menunggu seleksi"
                value={summary?.waitingSelection}
                note="Belum memperoleh keputusan"
                icon={Hourglass}
            />
            <AdminStatCard
                title="Lolos seleksi"
                value={summary?.passedSelection}
                note="Peserta dinyatakan lolos"
                icon={CircleCheck}
            />
            <AdminStatCard
                title="Sudah ditempatkan"
                value={summary?.placed}
                note="Peserta telah ditempatkan"
                icon={Building2}
            />
        </div>
    );
}
