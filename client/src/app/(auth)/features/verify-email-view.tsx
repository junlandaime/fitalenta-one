"use client";

import Link from "next/link";
import { useEffect, useRef, type ReactNode } from "react";
import { ArrowRight, CircleAlert, CircleCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVerifyEmail } from "@/hooks/auth/use-verify-email";
import { isApiError } from "@/lib/api-error";
import { ResendVerificationForm } from "./resend-verification-form";

function Panel({ icon, title, children }: { icon: ReactNode; title: string; children?: ReactNode }) {
    return (
        <div className="space-y-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full">{icon}</div>
            <div className="space-y-2">
                <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
                {children}
            </div>
        </div>
    );
}

export function VerifyEmailView({ token }: { token?: string }) {
    const { mutate, isPending, isSuccess, isError, data, error } = useVerifyEmail();
    const started = useRef(false);

    useEffect(() => {
        if (!token || started.current) return;
        started.current = true;
        mutate(token);
    }, [token, mutate]);

    if (!token) {
        return (
            <div className="space-y-8">
                <Panel
                    title="Tautan tidak valid"
                    icon={<CircleAlert className="h-10 w-10 text-destructive" aria-hidden />}
                >
                    <p className="text-sm text-muted-foreground">
                        Tautan verifikasi tidak lengkap. Minta email verifikasi baru di bawah ini.
                    </p>
                </Panel>
                <ResendVerificationForm />
            </div>
        );
    }

    if (isSuccess) {
        return (
            <Panel title="Email terverifikasi" icon={<CircleCheck className="h-10 w-10 text-emerald-600" aria-hidden />}>
                <p className="text-sm text-muted-foreground">{data}</p>
                <div className="pt-4">
                    <Button
                        asChild
                        className="h-12 w-full bg-secondary text-base font-semibold text-secondary-foreground hover:bg-secondary/90"
                    >
                        <Link href="/login?verified=1">
                            Lanjut ke Login
                            <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                        </Link>
                    </Button>
                </div>
            </Panel>
        );
    }

    if (isError) {
        const rateLimited = isApiError(error) && error.status === 429;

        return (
            <div className="space-y-8">
                <Panel
                    title="Verifikasi gagal"
                    icon={<CircleAlert className="h-10 w-10 text-destructive" aria-hidden />}
                >
                    <p role="alert" className="text-sm text-muted-foreground">
                        {error.message}
                    </p>
                    {!rateLimited && (
                        <p className="text-sm text-muted-foreground">
                            Tautan hanya berlaku 24 jam. Minta email verifikasi baru di bawah ini.
                        </p>
                    )}
                </Panel>
                {!rateLimited && <ResendVerificationForm />}
                <p className="text-center text-sm text-muted-foreground">
                    <Link href="/login" className="font-semibold text-primary hover:underline">
                        Kembali ke halaman login
                    </Link>
                </p>
            </div>
        );
    }

    return (
        <Panel
            title="Memverifikasi email..."
            icon={<Loader2 className="h-10 w-10 animate-spin text-primary" aria-hidden />}
        >
            <p aria-live="polite" className="text-sm text-muted-foreground">
                {isPending ? "Mohon tunggu sebentar." : "Menyiapkan verifikasi."}
            </p>
        </Panel>
    );
}
