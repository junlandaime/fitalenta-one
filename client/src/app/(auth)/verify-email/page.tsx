import type { Metadata } from "next";
import { AuthCardShell } from "../features/auth-card-shell";
import { VerifyEmailView } from "../features/verify-email-view";

export const metadata: Metadata = {
    title: "Verifikasi Email - FITALENTA",
    referrer: "no-referrer",
    robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ token?: string | string[] }> };

export default async function VerifyEmailPage({ searchParams }: Props) {
    const { token } = await searchParams;

    return (
        <AuthCardShell>
            <VerifyEmailView token={typeof token === "string" && token ? token : undefined} />
        </AuthCardShell>
    );
}
