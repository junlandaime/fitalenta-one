"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
    BookOpen,
    Briefcase,
    Calendar,
    ChevronDown,
    Compass,
    Home,
    Image as ImageIcon,
    Info,
    LayoutDashboard,
    LogIn,
    LogOut,
    MoreHorizontal,
    Newspaper,
    Phone,
    User,
    X,
} from "lucide-react";
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

function getMobileTabIcon(label: string, href: string) {
    const key = `${label} ${href}`.toLowerCase();
    if (href === "/" || key.includes("home") || key.includes("beranda")) return Home;
    if (key.includes("program")) return BookOpen;
    if (key.includes("gallery") || key.includes("galeri")) return ImageIcon;
    if (key.includes("event") || key.includes("acara") || key.includes("agenda")) return Calendar;
    if (key.includes("service") || key.includes("layanan")) return Briefcase;
    if (key.includes("blog") || key.includes("artikel") || key.includes("berita")) return Newspaper;
    if (key.includes("about") || key.includes("tentang")) return Info;
    if (key.includes("contact") || key.includes("kontak")) return Phone;
    return Compass;
}

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
    const [openProgramsPath, setOpenProgramsPath] = useState<string | null>(null);
    const [sheetProgramsExpanded, setSheetProgramsExpanded] = useState(true);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isShrunk, setIsShrunk] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const lastScrollY = useRef(0);
    const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const logout = useLogout();
    const { data: user, isLoading } = useCurrentUser();

    const mobileProgramsOpen = openProgramsPath === pathname;

    useEffect(() => {
        const handleScroll = () => {
            const currentY = window.scrollY;
            const delta = currentY - lastScrollY.current;

            setIsScrolled(currentY > 24);

            if (Math.abs(delta) < 15 && currentY > 24) {
                return;
            }

            if (currentY > 240 && delta > 0) {
                setIsShrunk(true);
            } else if (delta < 0 || currentY <= 240) {
                setIsShrunk(false);
            }

            lastScrollY.current = currentY;
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", handleScroll);
            if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
        };
    }, []);

    const handleMouseEnter = () => {
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
            hoverTimeoutRef.current = null;
        }
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        hoverTimeoutRef.current = setTimeout(() => {
            setIsHovered(false);
        }, 250);
    };

    const compactMode = isScrolled && isShrunk && !isHovered && !open;

    const hasExtraItems = navItems.length > 4;
    const priorityHrefs = ["/", "/programs", "/gallery"];
    const prioritizedItems = priorityHrefs
        .map((href) => navItems.find((item) => item.href === href))
        .filter((item): item is (typeof navItems)[number] => Boolean(item));

    const fallbackItems = navItems.filter(
        (item) => !priorityHrefs.includes(item.href)
    );
    const bottomNavItems = hasExtraItems
        ? [...prioritizedItems, ...fallbackItems].slice(0, 3)
        : navItems.slice(0, 4);

    return (
        <>
            <header className="pointer-events-none sticky top-0 z-50 flex h-16 w-full items-center justify-center text-white">
                <div
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    className={cn(
                        "pointer-events-auto flex items-center justify-between transition-[max-width,background-color,border-color,box-shadow,padding,transform] duration-300 ease-out",
                        !isScrolled &&
                            "h-16 w-full max-w-full translate-y-0 rounded-none border-b border-[#10302B]/10 bg-primary px-6 md:px-10",
                        isScrolled &&
                            !compactMode &&
                            "h-14 w-[calc(100%-2rem)] max-w-6xl translate-y-2 gap-6 rounded-full border border-white/15 bg-primary/95 px-6 shadow-xl shadow-black/15 backdrop-blur-md",
                        compactMode &&
                            "h-13 w-auto max-w-[180px] translate-y-2 gap-3 rounded-full border border-white/15 bg-primary/95 px-5 shadow-xl shadow-black/15 backdrop-blur-md"
                    )}
                >
                    <div className="flex shrink-0 items-center">
                        <Logo
                            width={compactMode ? 96 : 110}
                            height={compactMode ? 34 : 40}
                        />
                    </div>

                    <nav
                        aria-label="Main"
                        className={cn(
                            "hidden items-center gap-1 whitespace-nowrap lg:flex",
                            compactMode && "lg:hidden"
                        )}
                    >
                        {navItems.map((item) => {
                            const active = isActive(pathname, item.href);

                            if (item.label === "Programs") {
                                return (
                                    <div key={item.href} className="group relative">
                                        <Link
                                            href={item.href}
                                            aria-current={active ? "page" : undefined}
                                            className={cn(
                                                "flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors",
                                                isScrolled ? "rounded-full" : "rounded-md",
                                                active
                                                    ? "bg-muted-foreground/30 text-secondary"
                                                    : "text-white hover:bg-muted-foreground/30"
                                            )}
                                        >
                                            {item.label}
                                            <ChevronDown className="size-4 transition-transform duration-300 group-hover:rotate-180" />
                                        </Link>

                                        <div className="invisible absolute left-0 top-full z-50 pt-3 opacity-0 transition-all duration-300 group-hover:visible group-hover:opacity-100">
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

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    aria-current={active ? "page" : undefined}
                                    className={cn(
                                        "px-3 py-2 text-sm font-medium transition-colors",
                                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                                        isScrolled ? "rounded-full" : "rounded-md",
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

                    <div
                        className={cn(
                            "hidden shrink-0 items-center gap-2 whitespace-nowrap lg:flex",
                            compactMode && "lg:hidden"
                        )}
                    >
                        {isLoading ? (
                            <div
                                aria-hidden
                                className="size-8 animate-pulse rounded-full bg-white/20"
                            />
                        ) : user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger
                                    className={cn(
                                        "flex items-center gap-2 px-2 py-1.5",
                                        "text-sm font-medium text-white",
                                        "outline-none transition-colors",
                                        "hover:bg-muted-foreground/30",
                                        "focus-visible:ring-2 focus-visible:ring-primary",
                                        isScrolled ? "rounded-full" : "rounded-md"
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
                                    className={cn(
                                        "font-medium hover:bg-muted-foreground/30 hover:text-white",
                                        isScrolled && "rounded-full"
                                    )}
                                >
                                    <Link href={authLinks.login.href}>{authLinks.login.label}</Link>
                                </Button>
                                <Button
                                    asChild
                                    className={cn(
                                        "bg-white font-semibold text-black hover:bg-secondary focus-visible:ring-primary",
                                        isScrolled && "rounded-full"
                                    )}
                                >
                                    <Link href={authLinks.register.href}>
                                        {authLinks.register.label}
                                    </Link>
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                <LogoutOverlay show={logout.isPending || logout.isSuccess} />
            </header>

            {mobileProgramsOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
                    onClick={() => setOpenProgramsPath(null)}
                >
                    <div
                        className="fixed inset-x-3 bottom-24 mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-2">
                            <span className="text-sm font-bold text-primary">
                                Pilih Program Pelatihan
                            </span>
                            <button
                                type="button"
                                onClick={() => setOpenProgramsPath(null)}
                                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                                aria-label="Tutup menu program"
                            >
                                <X className="size-4" />
                            </button>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Link
                                href="/programs"
                                onClick={() => setOpenProgramsPath(null)}
                                className={cn(
                                    "rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors",
                                    pathname === "/programs"
                                        ? "bg-primary text-white"
                                        : "bg-slate-50 text-primary hover:bg-slate-100"
                                )}
                            >
                                Semua Program
                            </Link>
                            {programSubmenus.map((sub) => (
                                <Link
                                    key={sub.href}
                                    href={sub.href}
                                    onClick={() => setOpenProgramsPath(null)}
                                    className={cn(
                                        "rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
                                        pathname === sub.href
                                            ? "bg-primary/10 font-semibold text-primary"
                                            : "text-slate-700 hover:bg-slate-50"
                                    )}
                                >
                                    {sub.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <nav
                aria-label="Mobile Bottom Navigation"
                className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-md rounded-full border border-slate-200/90 bg-white/95 px-2 py-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur-md lg:hidden"
            >
                <div className="flex w-full flex-row items-center justify-between gap-1">
                    {bottomNavItems.map((item) => {
                        const active = isActive(pathname, item.href);
                        const Icon = getMobileTabIcon(item.label, item.href);
                        const isProgramsTab = item.label === "Programs";

                        if (isProgramsTab) {
                            return (
                                <button
                                    key={item.href}
                                    type="button"
                                    onClick={() =>
                                        setOpenProgramsPath((prev) =>
                                            prev === pathname ? null : pathname
                                        )
                                    }
                                    className={cn(
                                        "flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-full py-1.5 text-[11px] font-medium transition-all",
                                        active || mobileProgramsOpen
                                            ? "bg-primary/10 font-semibold text-primary"
                                            : "text-slate-500 hover:text-primary"
                                    )}
                                >
                                    <Icon className="size-4.5 shrink-0" />
                                    <span className="max-w-full truncate px-1">
                                        {item.label}
                                    </span>
                                </button>
                            );
                        }

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                aria-current={active ? "page" : undefined}
                                className={cn(
                                    "flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-full py-1.5 text-[11px] font-medium transition-all",
                                    active
                                        ? "bg-primary/10 font-semibold text-primary"
                                        : "text-slate-500 hover:text-primary"
                                )}
                            >
                                <Icon className="size-4.5 shrink-0" />
                                <span className="max-w-full truncate px-1">
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}

                    {hasExtraItems && (
                        <Sheet open={open} onOpenChange={setOpen}>
                            <SheetTrigger asChild>
                                <button
                                    type="button"
                                    className="flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-full py-1.5 text-[11px] font-medium text-slate-500 transition-all hover:text-primary"
                                >
                                    <MoreHorizontal className="size-4.5 shrink-0" />
                                    <span className="max-w-full truncate px-1">
                                        Lainnya
                                    </span>
                                </button>
                            </SheetTrigger>

                            <SheetContent
                                side="bottom"
                                className="max-h-[82vh] overflow-y-auto rounded-t-3xl border-none bg-primary p-6 text-white"
                            >
                                <SheetTitle className="text-base font-bold text-white">
                                    Menu Navigasi
                                </SheetTitle>
                                <SheetDescription className="sr-only">
                                    Semua halaman website
                                </SheetDescription>

                                <nav aria-label="All Mobile Links" className="mt-4 pb-4">
                                    <div className="flex flex-col gap-1">
                                        {navItems.map((item) => {
                                            const active = isActive(pathname, item.href);

                                            if (item.label === "Programs") {
                                                return (
                                                    <div key={item.href} className="space-y-1">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setSheetProgramsExpanded(
                                                                    (prev) => !prev
                                                                )
                                                            }
                                                            className={cn(
                                                                "flex w-full items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition-colors",
                                                                active
                                                                    ? "bg-white/15 text-secondary"
                                                                    : "text-white hover:bg-white/10"
                                                            )}
                                                        >
                                                            <span>{item.label}</span>
                                                            <ChevronDown
                                                                className={cn(
                                                                    "size-4 transition-transform duration-200",
                                                                    sheetProgramsExpanded &&
                                                                        "rotate-180"
                                                                )}
                                                            />
                                                        </button>

                                                        {sheetProgramsExpanded && (
                                                            <div className="ml-4 flex flex-col gap-1 border-l-2 border-white/20 pl-3">
                                                                <Link
                                                                    href="/programs"
                                                                    onClick={() => setOpen(false)}
                                                                    className={cn(
                                                                        "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                                                        pathname === "/programs"
                                                                            ? "bg-white/15 text-secondary"
                                                                            : "text-white/80 hover:bg-white/10 hover:text-white"
                                                                    )}
                                                                >
                                                                    Semua Program
                                                                </Link>
                                                                {programSubmenus.map((sub) => (
                                                                    <Link
                                                                        key={sub.href}
                                                                        href={sub.href}
                                                                        onClick={() =>
                                                                            setOpen(false)
                                                                        }
                                                                        className={cn(
                                                                            "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                                                            pathname === sub.href
                                                                                ? "bg-white/15 text-secondary"
                                                                                : "text-white/80 hover:bg-white/10 hover:text-white"
                                                                        )}
                                                                    >
                                                                        {sub.label}
                                                                    </Link>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            }

                                            return (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    onClick={() => setOpen(false)}
                                                    className={cn(
                                                        "rounded-xl px-4 py-3 text-base font-medium transition-colors",
                                                        active
                                                            ? "bg-white/15 text-secondary"
                                                            : "text-white hover:bg-white/10"
                                                    )}
                                                >
                                                    {item.label}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </nav>
                            </SheetContent>
                        </Sheet>
                    )}

                    {user ? (
                        <Link
                            href={DASHBOARD_HREF}
                            aria-current={
                                isActive(pathname, DASHBOARD_HREF) ? "page" : undefined
                            }
                            className={cn(
                                "flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-full py-1.5 text-[11px] font-medium transition-all",
                                isActive(pathname, DASHBOARD_HREF)
                                    ? "bg-primary/10 font-semibold text-primary"
                                    : "text-slate-500 hover:text-primary"
                            )}
                        >
                            <LayoutDashboard className="size-4.5 shrink-0" />
                            <span className="max-w-full truncate px-1">Dashboard</span>
                        </Link>
                    ) : (
                        <Link
                            href={authLinks.login.href}
                            aria-current={
                                isActive(pathname, authLinks.login.href)
                                    ? "page"
                                    : undefined
                            }
                            className={cn(
                                "flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-full py-1.5 text-[11px] font-medium transition-all",
                                isActive(pathname, authLinks.login.href)
                                    ? "bg-primary/10 font-semibold text-primary"
                                    : "text-slate-500 hover:text-primary"
                            )}
                        >
                            <LogIn className="size-4.5 shrink-0" />
                            <span className="max-w-full truncate px-1">
                                {authLinks.login.label}
                            </span>
                        </Link>
                    )}
                </div>
            </nav>
        </>
    );
}