import { CalendarClock, CircleCheck, EyeOff, Megaphone } from "lucide-react";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import type { EditorBannerSummary } from "@/types/editor/editor-banner";

export function BannerStatCards({ summary }: { summary?: EditorBannerSummary }) {
    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <AdminStatCard title="Total banner" value={summary?.total} note="Seluruh banner tersimpan" icon={Megaphone} />
            <AdminStatCard title="Tayang" value={summary?.live} note="Tampil di halaman utama" icon={CircleCheck} />
            <AdminStatCard
                title="Terjadwal"
                value={summary?.scheduled}
                note="Menunggu waktu mulai tayang"
                icon={CalendarClock}
            />
            <AdminStatCard
                title="Berakhir / nonaktif"
                value={summary ? summary.expired + summary.inactive : undefined}
                note="Tidak tampil di website"
                icon={EyeOff}
            />
        </div>
    );
}