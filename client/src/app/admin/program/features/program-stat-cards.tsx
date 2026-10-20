import { CircleCheck, LayoutGrid, UserPlus, Users } from "lucide-react";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import type { AdminProgramSummary } from "@/types/admin/admin-program";

export function ProgramStatCards({ summary }: { summary?: AdminProgramSummary }) {
    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <AdminStatCard title="Total program" value={summary?.total} note="Program tersedia" icon={LayoutGrid} />
            <AdminStatCard title="Program aktif" value={summary?.active} note="Sedang ditawarkan" icon={CircleCheck} />
            <AdminStatCard title="Program penuh" value={summary?.full} note="Kuota terpenuhi" icon={Users} />
            <AdminStatCard
                title="Total kuota"
                value={summary?.totalCapacity}
                note="Kapasitas peserta"
                icon={UserPlus}
            />
        </div>
    );
}
