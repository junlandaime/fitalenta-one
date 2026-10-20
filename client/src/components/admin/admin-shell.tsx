"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { ADMIN_AREA, type AdminAreaConfig } from "@/constants/admin/admin-nav";
import { useCurrentUser } from "@/hooks/auth/use-current-user";
import { AdminHeader } from "./admin-header";
import { AdminSidebarContent } from "./admin-sidebar";

function ShellSkeleton() {
    return (
        <div aria-busy="true" aria-label="Memuat panel admin" className="flex min-h-svh">
            <Skeleton className="hidden w-64 shrink-0 rounded-none lg:block" />
            <div className="flex-1 space-y-4 p-6">
                <Skeleton className="h-8 w-48" />
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {Array.from({ length: 4 }, (_, index) => (
                        <Skeleton key={index} className="h-36 rounded-xl" />
                    ))}
                </div>
            </div>
        </div>
    );
}

type AdminShellProps = {
    children: ReactNode;
    area?: AdminAreaConfig;
};

export function AdminShell({ children, area = ADMIN_AREA }: AdminShellProps) {
    const router = useRouter();
    const { data: user, isError } = useCurrentUser();
    const allowed = user ? area.roles.includes(user.role) : false;

    useEffect(() => {
        if (isError) router.replace(`/login?next=${area.basePath}`);
        else if (user && !allowed) router.replace("/user/dashboard");
    }, [isError, user, allowed, router, area.basePath]);

    if (!user || !allowed) return <ShellSkeleton />;

    return (
        <div className="flex min-h-svh bg-muted/30">
            <aside className="sticky top-0 hidden h-svh w-64 shrink-0 border-r bg-sidebar text-sidebar-foreground lg:block">
                <AdminSidebarContent user={user} area={area} />
            </aside>

            <div className="flex min-w-0 flex-1 flex-col">
                <AdminHeader user={user} area={area} />
                <div className="flex-1 p-4 md:p-6">{children}</div>
            </div>
        </div>
    );
}