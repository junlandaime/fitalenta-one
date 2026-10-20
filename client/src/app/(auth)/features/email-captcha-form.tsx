"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { CheckCircle2, Loader2, Mail } from "lucide-react";
import { TurnstileField } from "@/components/common/turnstile-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RESEND_COOLDOWN_SECONDS } from "@/constants/auth-constant";
import { useCooldown } from "@/hooks/auth/use-cooldown";
import { useTurnstile } from "@/hooks/auth/use-turnstile";
import { resendVerificationSchema } from "@/schemas/auth";

type Payload = { email: string; turnstileToken?: string };

type Callbacks = { onSuccess: () => void; onSettled: () => void };

export type EmailAction = {
    submit: (payload: Payload, callbacks: Callbacks) => void;
    isPending: boolean;
    isSuccess: boolean;
    message?: string;
    error: Error | null;
};

type Props = {
    idPrefix: string;
    label: string;
    submitLabel: string;
    pendingLabel: string;
    submitIcon: ReactNode;
    action: EmailAction;
};

export function EmailCaptchaForm({ idPrefix, label, submitLabel, pendingLabel, submitIcon, action }: Props) {
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState<string>();

    const turnstile = useTurnstile();
    const cooldown = useCooldown(RESEND_COOLDOWN_SECONDS);
    const inputId = `${idPrefix}-email`;

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!turnstile.ready || cooldown.remaining > 0) return;

        const result = resendVerificationSchema.safeParse({ email });
        if (!result.success) {
            setEmailError(result.error.issues[0]?.message);
            return;
        }

        action.submit(
            { ...result.data, turnstileToken: turnstile.token },
            { onSuccess: cooldown.start, onSettled: turnstile.reset },
        );
    }

    return (
        <form onSubmit={handleSubmit} noValidate className="space-y-4 text-left">
            <div className="space-y-2">
                <Label htmlFor={inputId}>{label}</Label>
                <div className="relative">
                    <Mail
                        aria-hidden
                        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                        id={inputId}
                        disabled={action.isPending}
                        type="email"
                        autoComplete="email"
                        placeholder="nama@email.com"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setEmailError(undefined);
                        }}
                        aria-invalid={Boolean(emailError)}
                        aria-describedby={emailError ? `${inputId}-error` : undefined}
                        className="h-12 pl-10"
                    />
                </div>
                {emailError && (
                    <p id={`${inputId}-error`} className="text-sm text-destructive">
                        {emailError}
                    </p>
                )}
            </div>

            {action.isSuccess && (
                <p
                    role="status"
                    className="flex items-start gap-2 rounded-md bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
                >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                    {action.message}
                </p>
            )}

            {action.error && (
                <p role="alert" className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {action.error.message}
                </p>
            )}

            <TurnstileField controller={turnstile} busy={action.isPending} />

            <Button
                type="submit"
                disabled={action.isPending || !turnstile.ready || cooldown.remaining > 0}
                suppressHydrationWarning
                className="h-12 w-full bg-secondary text-base font-semibold text-secondary-foreground hover:bg-secondary/90"
            >
                {action.isPending ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
                        {pendingLabel}
                    </>
                ) : cooldown.remaining > 0 ? (
                    `Kirim ulang dalam ${cooldown.remaining} dtk`
                ) : (
                    <>
                        {submitLabel}
                        <span className="ml-2" aria-hidden>
                            {submitIcon}
                        </span>
                    </>
                )}
            </Button>
        </form>
    );
}
