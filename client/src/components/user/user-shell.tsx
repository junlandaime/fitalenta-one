"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { UserNavbar } from "@/components/common/user-navbar";
import { useCurrentUser } from "@/hooks/auth/use-current-user";
import { getHomeByRole, normalizeRole } from "@/lib/auth-role";

function UserShellSkeleton() {
    return (
        <div
            role="status"
            aria-busy="true"
            aria-label="Memuat halaman"
            className="flex min-h-svh flex-col"
        >
            <div className="h-16 border-b border-[#10302B]/10 bg-primary" />
            <div className="flex flex-1 flex-col items-center justify-center gap-3 text-muted-foreground">
                <Skeleton className="h-6 w-48" />
                <Spinner className="size-8 text-primary" aria-hidden />
                <p className="text-sm font-medium">Memuat halaman...</p>
            </div>
        </div>
    );
}

export function UserShell({ children, footer }: { children: ReactNode; footer: ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { data: user, isError } = useCurrentUser();
    const role = user ? normalizeRole(user.role) : null;
    const allowed = role === "user";

    useEffect(() => {
        if (isError) router.replace(`/login?next=${encodeURIComponent(pathname)}`);
        else if (role && !allowed) router.replace(getHomeByRole(role));
    }, [isError, role, allowed, pathname, router]);

    if (!user || !allowed) return <UserShellSkeleton />;

    return (
        <div className="flex min-h-svh flex-col">
            <UserNavbar />
            <div className="flex-1">{children}</div>
            {footer}
        </div>
    );
}
