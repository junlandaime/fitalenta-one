import { MessageSquareQuote, Star, ThumbsUp } from "lucide-react";
import { AdminStatCard } from "@/components/admin/admin-stat-card";

type TestimonialStatCardsProps = {
    total?: number;
    featured?: number;
    average?: number;
};

export function TestimonialStatCards({ total, featured, average }: TestimonialStatCardsProps) {
    return (
        <div className="grid gap-4 sm:grid-cols-3">
            <AdminStatCard title="Total testimoni" value={total} note="Seluruh testimoni tersimpan" icon={MessageSquareQuote} />
            <AdminStatCard title="Unggulan" value={featured} note="Ditandai sebagai unggulan" icon={Star} />
            <AdminStatCard
                title="Rata-rata rating"
                value={average === undefined ? undefined : average.toLocaleString("id-ID", { minimumFractionDigits: 1 })}
                note="Dari skala 1 sampai 5"
                icon={ThumbsUp}
            />
        </div>
    );
}
