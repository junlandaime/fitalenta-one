"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, ChevronsUpDown, ExternalLink, KeyRound, LogOut } from "lucide-react";
import { ChangePasswordSheet } from "@/components/common/change-password-sheet";
import { LogoutOverlay } from "@/components/common/logout-overlay";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ADMIN_AREA, isActivePath, type AdminAreaConfig, type AdminNavEntry } from "@/constants/admin/admin-nav";
import { siteConfig } from "@/constants/site-config";
import { getInitials } from "@/helpers/admin/admin-helper";
import { useLogout } from "@/hooks/auth/use-logout";
import { cn } from "@/lib/utils";
import type { AuthUser } from "@/store/auth-store";

const ITEM_CLASS =
    "flex h-9 w-full items-center gap-2 rounded-md px-2 text-sm outline-none transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring [&_svg]:size-4 [&_svg]:shrink-0";
const ACTIVE_CLASS = "bg-sidebar-accent font-medium text-sidebar-accent-foreground";

type NavProps = {
    pathname: string;
    onNavigate?: () => void;
};

function NavLinkItem({ entry, pathname, onNavigate }: NavProps & { entry: Extract<AdminNavEntry, { type: "link" }> }) {
    const active = isActivePath(pathname, entry.href);
    const Icon = entry.icon;

    return (
        <li>
            <Link
                href={entry.href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={cn(ITEM_CLASS, active && ACTIVE_CLASS)}
            >
                <Icon aria-hidden />
                {entry.title}
            </Link>
        </li>
    );
}

function NavGroupItem({ entry, pathname, onNavigate }: NavProps & { entry: Extract<AdminNavEntry, { type: "group" }> }) {
    const [open, setOpen] = useState(() => entry.items.some((item) => isActivePath(pathname, item.href)));
    const Icon = entry.icon;

    return (
        <li>
            <Collapsible open={open} onOpenChange={setOpen}>
                <CollapsibleTrigger className={cn(ITEM_CLASS, "justify-between")}>
                    <span className="flex items-center gap-2">
                        <Icon aria-hidden />
                        {entry.title}
                    </span>
                    <ChevronRight className={cn("transition-transform", open && "rotate-90")} aria-hidden />
                </CollapsibleTrigger>

                <CollapsibleContent>
                    <ul className="mx-3.5 mt-1 flex flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5">
                        {entry.items.map((item) => {
                            const active = isActivePath(pathname, item.href);

                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        onClick={onNavigate}
                                        aria-current={active ? "page" : undefined}
                                        className={cn(
                                            "flex h-8 items-center rounded-md px-2 text-sm text-sidebar-foreground/80 outline-none transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring",
                                            active && ACTIVE_CLASS,
                                        )}
                                    >
                                        {item.title}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </CollapsibleContent>
            </Collapsible>
        </li>
    );
}

function UserMenu({ user }: { user: AuthUser }) {
    const logout = useLogout();
    const [passwordOpen, setPasswordOpen] = useState(false);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger className="flex w-full items-center gap-2 rounded-md p-2 text-left outline-none transition-colors hover:bg-sidebar-accent focus-visible:ring-2 focus-visible:ring-sidebar-ring">
                    <Avatar className="size-8 rounded-lg">
                        <AvatarFallback className="rounded-lg text-xs">{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <span className="grid min-w-0 flex-1 text-sm leading-tight">
                        <span className="truncate font-medium">{user.name}</span>
                        <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                    </span>
                    <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                </DropdownMenuTrigger>

                <DropdownMenuContent side="top" align="start" className="min-w-56">
                    <DropdownMenuLabel className="font-normal">
                        <span className="block truncate font-medium text-foreground">{user.name}</span>
                        <span className="block text-xs capitalize text-muted-foreground">{user.role}</span>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Link href="/">
                            <ExternalLink aria-hidden />
                            Lihat website
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setPasswordOpen(true)}>
                        <KeyRound aria-hidden />
                        Ubah password
                    </DropdownMenuItem>
                    <DropdownMenuItem variant="destructive" disabled={logout.isPending} onSelect={() => logout.mutate()}>
                        <LogOut aria-hidden />
                        Keluar
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {passwordOpen && <ChangePasswordSheet onClose={() => setPasswordOpen(false)} />}
            <LogoutOverlay show={logout.isPending || logout.isSuccess} />
        </>
    );
}

type AdminSidebarContentProps = {
    user: AuthUser;
    area?: AdminAreaConfig;
    onNavigate?: () => void;
};

export function AdminSidebarContent({ user, area = ADMIN_AREA, onNavigate }: AdminSidebarContentProps) {
    const pathname = usePathname();
    const [home] = area.nav;
    const homeHref = home?.type === "link" ? home.href : area.basePath;

    return (
        <div className="flex h-full flex-col">
            <div className="space-y-2 p-4">
                <Link href={homeHref} onClick={onNavigate} className="block rounded-lg bg-primary px-3 py-2">
                    <Image
                        src={siteConfig.logo}
                        alt={siteConfig.name}
                        width={108}
                        height={50}
                        style={{ width: "auto", height: "auto" }}
                        className="max-h-10"
                    />
                </Link>
                <p className="px-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    {area.areaLabel}
                </p>
            </div>

            <nav aria-label={`Navigasi ${area.areaLabel}`} className="flex-1 overflow-y-auto px-3 py-2">
                <p className="px-2 pb-1 text-xs font-medium text-muted-foreground">Utama</p>
                <ul className="flex flex-col gap-1">
                    {area.nav.map((entry) =>
                        entry.type === "link" ? (
                            <NavLinkItem key={entry.href} entry={entry} pathname={pathname} onNavigate={onNavigate} />
                        ) : (
                            <NavGroupItem key={entry.title} entry={entry} pathname={pathname} onNavigate={onNavigate} />
                        ),
                    )}
                </ul>
            </nav>

            <div className="border-t border-sidebar-border p-3">
                <UserMenu user={user} />
            </div>
        </div>
    );
}