import {
    BriefcaseBusiness,
    Building2,
    CalendarDays,
    Images,
    LayoutDashboard,
    MessageSquareQuote,
    Newspaper,
    Users,
} from "lucide-react";
import type { AdminAreaConfig } from "@/constants/admin/admin-nav";

export const EDITOR_ROLES: readonly string[] = ["superadmin", "admin", "editor"];

export const EDITOR_AREA: AdminAreaConfig = {
    basePath: "/editor",
    areaLabel: "Editor CMS",
    roles: EDITOR_ROLES,
    nav: [
        { type: "link", title: "Dashboard", href: "/editor/dashboard", icon: LayoutDashboard },
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

export const EDITOR_SHORTCUTS = [
    {
        title: "Artikel",
        description: "Tulis dan atur artikel blog yang tampil di website.",
        href: "/editor/articles",
        createHref: "/editor/articles/new",
        icon: Newspaper,
    },
    {
        title: "Event",
        description: "Kelola jadwal event, lokasi, dan tautan pendaftaran.",
        href: "/editor/events",
        createHref: "/editor/events/new",
        icon: CalendarDays,
    },
    {
        title: "Galeri",
        description: "Unggah dan atur dokumentasi foto kegiatan.",
        href: "/editor/gallery",
        createHref: null,
        icon: Images,
    },
    {
        title: "Layanan",
        description: "Kelola daftar layanan beserta konten detail tiap layanan.",
        href: "/editor/services",
        createHref: "/editor/services/new",
        icon: BriefcaseBusiness,
    },
    {
        title: "Testimoni",
        description: "Atur testimoni klien, rating, dan penandaan unggulan.",
        href: "/editor/testimonials",
        createHref: null,
        icon: MessageSquareQuote,
    },
    {
        title: "Tim",
        description: "Kelola pakar di halaman Home dan anggota tim di halaman About.",
        href: "/editor/team-members",
        createHref: null,
        icon: Users,
    },
] as const;