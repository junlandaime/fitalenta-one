"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    ClipboardList,
    CreditCard,
    GraduationCap,
    LayoutDashboard,
    UserRound,
} from "lucide-react";
import { cn } from "@/lib/utils";

const BOTTOM_NAV_ITEMS = [
    {
        href: "/user/dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
    },
    {
        href: "/user/program",
        label: "Program",
        icon: GraduationCap,
    },
    {
        href: "/user/pendaftaran",
        label: "Daftar",
        icon: ClipboardList,
    },
    {
        href: "/user/pembayaran",
        label: "Bayar",
        icon: CreditCard,
    },
    {
        href: "/user/profil",
        label: "Profil",
        icon: UserRound,
    },
];

function isActive(pathname: string, href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
}

export function UserBottomNav() {
    const pathname = usePathname();

    return (
        <nav
            aria-label="Navigasi bawah pengguna"
            className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200/90 bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_16px_rgba(15,23,42,0.06)] backdrop-blur-md lg:hidden"
        >
            <div className="mx-auto grid h-16 max-w-lg grid-cols-5">
                {BOTTOM_NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                    const active = isActive(pathname, href);

                    return (
                        <Link
                            key={href}
                            href={href}
                            aria-current={active ? "page" : undefined}
                            className={cn(
                                "relative flex flex-col items-center justify-center gap-1 px-1 text-[11px] transition-colors",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary",
                                active
                                    ? "font-bold text-primary"
                                    : "font-medium text-slate-500 hover:text-primary"
                            )}
                        >
                            {/* Garis indikator aktif di sisi atas tab */}
                            {active && (
                                <span
                                    aria-hidden
                                    className="absolute top-0 h-0.5 w-8 rounded-b-full bg-primary"
                                />
                            )}

                            <span
                                className={cn(
                                    "flex size-7 items-center justify-center rounded-xl transition-colors",
                                    active ? "bg-primary/10 text-primary" : "bg-transparent"
                                )}
                            >
                                <Icon
                                    className="size-4.5"
                                    strokeWidth={active ? 2.4 : 1.9}
                                    aria-hidden
                                />
                            </span>

                            <span className="max-w-full truncate leading-none">{label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}