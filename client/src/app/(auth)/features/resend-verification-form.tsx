"use client";

import { Send } from "lucide-react";
import { useResendVerification } from "@/hooks/auth/use-resend-verification";
import { EmailCaptchaForm } from "./email-captcha-form";

export function ResendVerificationForm() {
    const { mutate, isPending, isSuccess, data, error } = useResendVerification();

    return (
        <EmailCaptchaForm
            idPrefix="resend"
            label="Kirim ulang email verifikasi"
            submitLabel="Kirim Email Verifikasi"
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
    );
}
