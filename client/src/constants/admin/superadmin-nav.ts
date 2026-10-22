import {
    Building2,
    Layers,
    LayoutDashboard,
    Newspaper,
    TrendingUp,
} from "lucide-react";
import type { AdminAreaConfig } from "@/constants/admin/admin-nav";

export const SUPERADMIN_ROLES: readonly string[] = ["superadmin"];

export const SUPERADMIN_AREA: AdminAreaConfig = {
    basePath: "/admin",
    areaLabel: "Super Admin",
    roles: ["superadmin", "admin", "editor"],
    nav: [
        { type: "link", title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
        {
            type: "group",
            title: "Manajemen",
            icon: Layers,
            items: [
                { title: "Pembayaran", href: "/admin/pembayaran" },
                { title: "Seleksi & Penempatan", href: "/admin/seleksi" },
                { title: "Data Peserta", href: "/admin/peserta" },
                { title: "Program", href: "/admin/program" },
                { title: "Kategori Program", href: "/admin/kategori-program" },
                { title: "User", href: "/admin/user" },
            ],
        },
        { type: "link", title: "Laporan Keuangan", href: "/admin/laporan-keuangan", icon: TrendingUp },
        {
            type: "group",
            title: "Konten",
            icon: Newspaper,
            items: [
                { title: "Artikel", href: "/editor/articles" },
                { title: "Event", href: "/editor/events" },
                { title: "Galeri", href: "/editor/gallery" },
            ],
        },
        {
            type: "group",
            title: "Profil Perusahaan",
            icon: Building2,
            items: [
                { title: "Layanan", href: "/editor/services" },
                { title: "Testimoni", href: "/editor/testimonials" },
                { title: "Tim", href: "/editor/team-members" },
            ],
        },
    ],
};
