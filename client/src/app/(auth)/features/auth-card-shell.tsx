import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";

export function AuthCardShell({ children }: { children: ReactNode }) {
    return (
        <main className="flex min-h-svh flex-col justify-center bg-background px-6 py-12 md:px-10">
            <div className="mx-auto w-full max-w-md">
                <Link
                    href="/"
                    className="mb-8 inline-flex w-fit items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="h-4 w-4" aria-hidden />
                    Kembali ke FITALENTA
                </Link>

                <div className="rounded-2xl border bg-card px-6 py-8 shadow-sm sm:px-8 sm:py-10">{children}</div>
            </div>
        </main>
    );
}

export function AuthCardHeader({
    icon,
    title,
    description,
}: {
    icon: ReactNode;
    title: string;
    description?: ReactNode;
}) {
    return (
        <div className="mb-8 space-y-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">{icon}</div>
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
    );
}
