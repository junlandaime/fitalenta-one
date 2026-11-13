"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown, LayoutDashboard, LogOut, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Logo } from "./logo";
import { authLinks, navItems } from "@/constants/site-config";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/hooks/auth/use-current-user";
import { useLogout } from "@/hooks/auth/use-logout";
import { LogoutOverlay } from "@/components/common/logout-overlay";

const DASHBOARD_HREF = "/user/dashboard";

function isActive(pathname: string, href: string) {
    return href === "/"
        ? pathname === "/"
        : pathname === href || pathname.startsWith(`${href}/`);
}

// Tambahkan daftar submenu Programs di sini agar mudah diatur
const programSubmenus = [
    { label: "Program Reguler", href: "/programs/reguler" },
    { label: "Program Asrama", href: "/programs/asrama" },
    { label: "Program Hybrid", href: "/programs/hybrid" },
    { label: "Program Fast Track", href: "/programs/fast-track" },
    { label: "Gijingoku", href: "/programs/gijingoku" },
];

export function Navbar() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const logout = useLogout();
    const { data: user, isLoading } = useCurrentUser();

    return (
        <header className="sticky top-0 z-50 border-b border-[#10302B]/10 bg-primary text-white">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-6 md:px-8">
                <Logo width={110} height={40} />

                {/* --- DESKTOP NAVIGATION --- */}
                <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
                    {navItems.map((item) => {
                        const active = isActive(pathname, item.href);

                        // 1. Jika menu "Programs", jadikan Dropdown Hover
                        if (item.label === "Programs") {
                            return (
                                <div key={item.href} className="group relative">
                                    <Link
                                        href={item.href}
                                        aria-current={active ? "page" : undefined}
                                        className={cn(
                                            "flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                            active
                                                ? "bg-muted-foreground/30 text-secondary"
                                                : "text-white hover:bg-muted-foreground/30"
                                        )}
                                    >
                                        {item.label}
                                        <ChevronDown className="size-4 transition-transform duration-300 group-hover:rotate-180" />
                                    </Link>

                                    {/* 2. Kotak Dropdown (Muncul saat hover) */}
                                    <div className="invisible absolute left-0 top-full z-50 pt-2 opacity-0 transition-all duration-300 group-hover:visible group-hover:opacity-100">
                                        <ul className="flex w-52 flex-col overflow-hidden rounded-xl bg-white p-2 shadow-xl ring-1 ring-slate-100">
                                            {programSubmenus.map((sub) => (
                                                <li key={sub.href}>
                                                    <Link
                                                        href={sub.href}
                                                        className={cn(
                                                            "block rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                                                            pathname === sub.href
                                                                ? "bg-slate-100 text-primary"
                                                                : "text-slate-600 hover:bg-slate-50 hover:text-primary"
                                                        )}
                                                    >
                                                        {sub.label}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            );
                        }

                        // 3. Jika menu lain, jadikan Link biasa
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                aria-current={active ? "page" : undefined}
                                className={cn(
                                    "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                                    active
                                        ? "bg-muted-foreground/30 text-secondary"
                                        : "text-white hover:bg-muted-foreground/30"
                                )}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="hidden items-center gap-2 lg:flex">
                    {isLoading ? (
                        <div
                            aria-hidden
                            className="size-8 animate-pulse rounded-full bg-white/20"
                        />
                    ) : user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger
                                className={cn(
                                    "flex items-center gap-2 rounded-md px-2 py-1.5",
                                    "text-sm font-medium text-white",
                                    "outline-none transition-colors",
                                    "hover:bg-muted-foreground/30",
                                    "focus-visible:ring-2 focus-visible:ring-primary"
                                )}
                            >
                                <Avatar className="size-8">
                                    <AvatarFallback className="bg-white text-primary">
                                        <User className="size-4" />
                                    </AvatarFallback>
                                </Avatar>

                                <span className="max-w-32 truncate">{user.name}</span>

                                <ChevronDown className="size-4" aria-hidden />
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end" className="w-52">
                                <DropdownMenuLabel className="truncate">
                                    {user.name}
                                </DropdownMenuLabel>

                                <DropdownMenuSeparator />

                                <DropdownMenuItem asChild>
                                    <Link href={DASHBOARD_HREF}>
                                        <LayoutDashboard aria-hidden />
                                        Dashboard
                                    </Link>
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />

                                <DropdownMenuItem
                                    variant="destructive"
                                    disabled={logout.isPending}
                                    onSelect={() => logout.mutate()}
                                >
                                    <LogOut aria-hidden />
                                    Keluar
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <>
                            <Button
                                asChild
                                variant="ghost"
                                className="font-medium hover:bg-muted-foreground/30 hover:text-white"
                            >
                                <Link href={authLinks.login.href}>{authLinks.login.label}</Link>
                            </Button>
                            <Button
                                asChild
                                className="bg-white font-semibold text-black hover:bg-secondary focus-visible:ring-primary"
                            >
                                <Link href={authLinks.register.href}>
                                    {authLinks.register.label}
                                </Link>
                            </Button>
                        </>
                    )}
                </div>

                {/* --- MOBILE NAVIGATION --- */}
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden"
                            aria-label="Open menu"
                        >
                            <Menu className="h-6 w-6" aria-hidden />
                        </Button>
                    </SheetTrigger>

                    <SheetContent
                        side="right"
                        className="flex w-[85vw] max-w-sm flex-col gap-0 border-none bg-primary p-6 text-white"
                    >
                        <SheetTitle className="sr-only">Menu</SheetTitle>
                        <SheetDescription className="sr-only">
                            Site navigation
                        </SheetDescription>

                        <nav aria-label="Mobile" className="mt-8 flex-1 overflow-y-auto">
                            <ul className="space-y-1">
                                {navItems.map((item) => {
                                    const active = isActive(pathname, item.href);

                                    // 4. Dropdown di Mobile Menu
                                    if (item.label === "Programs") {
                                        return (
                                            <li key={item.href} className="space-y-1">
                                                <Link
                                                    href={item.href}
                                                    onClick={() => setOpen(false)}
                                                    className={cn(
                                                        "flex items-center justify-between rounded-md px-3 py-3 text-lg font-medium",
                                                        active
                                                            ? "bg-muted-foreground/30 text-secondary"
                                                            : "text-white hover:bg-muted-foreground/30"
                                                    )}
                                                >
                                                    {item.label}
                                                </Link>
                                                <ul className="ml-4 space-y-1 border-l-2 border-white/20 pl-4">
                                                    {programSubmenus.map((sub) => (
                                                        <li key={sub.href}>
                                                            <Link
                                                                href={sub.href}
                                                                onClick={() => setOpen(false)}
                                                                className={cn(
                                                                    "block rounded-md py-2 text-base font-medium transition-colors",
                                                                    pathname === sub.href
                                                                        ? "text-secondary"
                                                                        : "text-white/80 hover:text-white"
                                                                )}
                                                            >
                                                                {sub.label}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </li>
                                        );
                                    }

                                    return (
                                        <li key={item.href}>
                                            <Link
                                                href={item.href}
                                                aria-current={active ? "page" : undefined}
                                                onClick={() => setOpen(false)}
                                                className={cn(
                                                    "block rounded-md px-3 py-3 text-lg font-medium",
                                                    active
                                                        ? "bg-muted-foreground/30 text-secondary"
                                                        : "text-white hover:bg-muted-foreground/30"
                                                )}
                                            >
                                                {item.label}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </nav>

                        <div className="grid gap-3 border-t border-white/10 pt-6">
                            {isLoading ? null : user ? (
                                <>
                                    <div className="flex items-center gap-3 px-1">
                                        <Avatar className="size-10">
                                            <AvatarFallback className="bg-white text-primary">
                                                <User className="size-5" />
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="truncate font-medium">{user.name}</span>
                                    </div>

                                    <Button
                                        asChild
                                        size="lg"
                                        className="bg-white font-semibold text-black hover:bg-secondary"
                                        onClick={() => setOpen(false)}
                                    >
                                        <Link href={DASHBOARD_HREF}>
                                            <LayoutDashboard aria-hidden />
                                            Dashboard
                                        </Link>
                                    </Button>

                                    <Button
                                        variant="outline"
                                        size="lg"
                                        disabled={logout.isPending}
                                        className="border-white/30 bg-transparent font-semibold hover:bg-muted-foreground/30 hover:text-white"
                                        onClick={() => {
                                            setOpen(false);
                                            logout.mutate();
                                        }}
                                    >
                                        <LogOut aria-hidden />
                                        Keluar
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button
                                        asChild
                                        variant="outline"
                                        size="lg"
                                        className="border-[#10302B]/30 bg-transparent font-semibold"
                                        onClick={() => setOpen(false)}
                                    >
                                        <Link href={authLinks.login.href}>
                                            {authLinks.login.label}
                                        </Link>
                                    </Button>
                                    <Button
                                        asChild
                                        size="lg"
                                        className="bg-white font-semibold text-black hover:bg-secondary"
                                        onClick={() => setOpen(false)}
                                    >
                                        <Link href={authLinks.register.href}>
                                            {authLinks.register.label}
                                        </Link>
                                    </Button>
                                </>
                            )}
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            <LogoutOverlay show={logout.isPending || logout.isSuccess} />
        </header>
    );
}