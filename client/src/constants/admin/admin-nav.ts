import { Layers, LayoutDashboard, TrendingUp, type LucideIcon } from "lucide-react";

export type AdminNavLink = {
    title: string;
    href: string;
    icon?: LucideIcon;
};

export type AdminNavEntry =
    | ({ type: "link" } & AdminNavLink & { icon: LucideIcon })
    | { type: "group"; title: string; icon: LucideIcon; items: AdminNavLink[] };

export type AdminAreaConfig = {
    basePath: string;
    areaLabel: string;
    roles: readonly string[];
    nav: AdminNavEntry[];
};

export const ADMIN_ROLES: readonly string[] = ["superadmin", "admin", "editor"];

export const ADMIN_NAV: AdminNavEntry[] = [
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
];

export const ADMIN_AREA: AdminAreaConfig = {
    basePath: "/admin",
    areaLabel: "Admin Management",
    roles: ADMIN_ROLES,
    nav: ADMIN_NAV,
};

export function isActivePath(pathname: string, href: string) {
    if (href === "/admin") return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
}

export function getAdminPageTitle(pathname: string, nav: AdminNavEntry[] = ADMIN_NAV) {
    const links = nav.flatMap((entry) => (entry.type === "group" ? entry.items : [entry]));
    const match = links
        .filter((link) => isActivePath(pathname, link.href))
        .sort((a, b) => b.href.length - a.href.length)[0];
    return match?.title ?? "Admin";
}
