"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ADMIN_AREA, getAdminPageTitle, type AdminAreaConfig } from "@/constants/admin/admin-nav";
import type { AuthUser } from "@/store/auth-store";
import { AdminSidebarContent } from "./admin-sidebar";

export function AdminHeader({ user, area = ADMIN_AREA }: { user: AuthUser; area?: AdminAreaConfig }) {
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b bg-background/90 px-4 backdrop-blur md:px-6">
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="-ml-2 lg:hidden" aria-label="Buka menu">
                        <Menu aria-hidden />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="gap-0 bg-sidebar p-0 text-sidebar-foreground sm:max-w-72">
                    <SheetHeader className="sr-only">
                        <SheetTitle>Menu {area.areaLabel}</SheetTitle>
                        <SheetDescription>Navigasi halaman panel admin</SheetDescription>
                    </SheetHeader>
                    <AdminSidebarContent user={user} area={area} onNavigate={() => setMenuOpen(false)} />
                </SheetContent>
            </Sheet>

            <h1 className="text-base font-medium">{getAdminPageTitle(pathname, area.nav)}</h1>

            <Button asChild variant="ghost" size="sm" className="ml-auto hidden sm:inline-flex">
                <Link href="/">
                    Lihat website
                    <ExternalLink data-icon="inline-end" aria-hidden />
                </Link>
            </Button>
        </header>
    );
}