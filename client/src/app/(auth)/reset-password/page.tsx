import Link from "next/link";
import type { Metadata } from "next";
import { CircleAlert, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthCardHeader, AuthCardShell } from "../features/auth-card-shell";
import { ResetPasswordForm } from "../features/reset-password-form";

export const metadata: Metadata = {
    title: "Reset Password - FITALENTA",
    referrer: "no-referrer",
    robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ token?: string | string[] }> };

export default async function ResetPasswordPage({ searchParams }: Props) {
    const { token } = await searchParams;
    const value = typeof token === "string" && token ? token : undefined;

    return (
        <AuthCardShell>
            {value ? (
                <>
                    <AuthCardHeader
                        icon={<LockKeyhole className="h-5 w-5" aria-hidden />}
                        title="Buat password baru"
                        description="Tentukan password baru untuk akun Anda."
                    />
                    <ResetPasswordForm token={value} />
                </>
            ) : (
                <div className="space-y-6 text-center">
                    <CircleAlert className="mx-auto h-10 w-10 text-destructive" aria-hidden />
                    <div className="space-y-2">
                        <h1 className="text-2xl font-semibold tracking-tight">Tautan tidak valid</h1>
                        <p className="text-sm text-muted-foreground">
                            Tautan reset password tidak lengkap atau sudah kedaluwarsa. Minta tautan baru untuk
                            melanjutkan.
                        </p>
                    </div>
                    <Button asChild className="h-12 w-full bg-secondary text-base font-semibold text-secondary-foreground hover:bg-secondary/90">
                        <Link href="/forgot-password">Minta tautan reset</Link>
                    </Button>
                </div>
            )}
        </AuthCardShell>
    );
}
