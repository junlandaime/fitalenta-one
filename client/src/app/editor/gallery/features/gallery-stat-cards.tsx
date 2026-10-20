import { Eye, Images, Star } from "lucide-react";
import { AdminStatCard } from "@/components/admin/admin-stat-card";

type GalleryStatCardsProps = {
    total?: number;
    featured?: number;
};

export function GalleryStatCards({ total, featured }: GalleryStatCardsProps) {
    const visible = total === undefined || featured === undefined ? undefined : total - featured;

    return (
        <div className="grid gap-4 sm:grid-cols-3">
            <AdminStatCard title="Total gambar" value={total} note="Seluruh gambar tersimpan" icon={Images} />
            <AdminStatCard title="Tampil di galeri" value={visible} note="Muncul di halaman galeri" icon={Eye} />
            <AdminStatCard title="Gambar unggulan" value={featured} note="Hanya sebagai gambar terkait" icon={Star} />
        </div>
    );
}
