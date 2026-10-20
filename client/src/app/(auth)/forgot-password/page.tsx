import type { Metadata } from "next";
import { KeyRound } from "lucide-react";
import { AuthCardHeader, AuthCardShell } from "../features/auth-card-shell";
import { ForgotPasswordForm } from "../features/forgot-password-form";

export const metadata: Metadata = {
    title: "Lupa Password - FITALENTA",
};

export default function ForgotPasswordPage() {
    return (
        <AuthCardShell>
            <AuthCardHeader
                icon={<KeyRound className="h-5 w-5" aria-hidden />}
                title="Lupa password"
                description="Masukkan email akun Anda. Jika terdaftar, kami akan mengirim tautan untuk membuat password baru."
            />
            <ForgotPasswordForm />
        </AuthCardShell>
    );
}
