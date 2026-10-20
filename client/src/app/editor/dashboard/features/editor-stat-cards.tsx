import { BriefcaseBusiness, CalendarDays, Images, MessageSquareQuote, Newspaper, Users } from "lucide-react";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import type { EditorCmsSummary } from "@/types/editor/editor-content";

export function EditorStatCards({ summary }: { summary?: EditorCmsSummary }) {
    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <AdminStatCard title="Artikel" value={summary?.articles} note="Total artikel tersimpan" icon={Newspaper} />
            <AdminStatCard title="Event" value={summary?.events} note="Total event tersimpan" icon={CalendarDays} />
            <AdminStatCard title="Galeri" value={summary?.gallery} note="Total gambar tersimpan" icon={Images} />
            <AdminStatCard title="Layanan" value={summary?.services} note="Total layanan tersimpan" icon={BriefcaseBusiness} />
            <AdminStatCard
                title="Testimoni"
                value={summary?.testimonials}
                note="Total testimoni tersimpan"
                icon={MessageSquareQuote}
            />
            <AdminStatCard title="Tim" value={summary?.teamMembers} note="Total anggota tim tersimpan" icon={Users} />
        </div>
    );
}