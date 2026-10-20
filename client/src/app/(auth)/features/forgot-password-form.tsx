"use client";

import Link from "next/link";
import { Send } from "lucide-react";
import { useForgotPassword } from "@/hooks/auth/use-forgot-password";
import { EmailCaptchaForm } from "./email-captcha-form";

export function ForgotPasswordForm() {
    const { mutate, isPending, isSuccess, data, error } = useForgotPassword();

    return (
        <div className="space-y-6">
            <EmailCaptchaForm
                idPrefix="forgot"
                label="Email akun"
                submitLabel="Kirim Tautan Reset"
                pendingLabel="Mengirim..."
                submitIcon={<Send className="h-4 w-4" />}
                action={{
                    submit: (payload, callbacks) => mutate(payload, callbacks),
                    isPending,
                    isSuccess,
                    message: data,
                    error,
                }}
            />

            <p className="text-center text-sm text-muted-foreground">
                Ingat password Anda?{" "}
                <Link href="/login" className="font-semibold text-primary hover:underline">
                    Kembali ke login
                </Link>
            </p>
        </div>
    );
}
