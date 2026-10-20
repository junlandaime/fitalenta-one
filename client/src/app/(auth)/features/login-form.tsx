"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { TurnstileField } from "@/components/common/turnstile-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema, type LoginInput } from "@/schemas/auth";
import { AUTH_ERROR_CODE, RESEND_COOLDOWN_SECONDS } from "@/constants/auth-constant";
import { useCooldown } from "@/hooks/auth/use-cooldown";
import { useLogin } from "@/hooks/auth/use-login";
import { useResendVerification } from "@/hooks/auth/use-resend-verification";
import { useTurnstile } from "@/hooks/auth/use-turnstile";
import { isApiError } from "@/lib/api-error";

type FieldErrors = Partial<Record<keyof LoginInput, string>>;

const initialValues: LoginInput = { email: "", password: "" };

type Props = {
    notice?: string;
};

export function LoginForm({ notice }: Props) {
    const [values, setValues] = useState<LoginInput>(initialValues);
    const [errors, setErrors] = useState<FieldErrors>({});
    const [showPassword, setShowPassword] = useState(false);

    const { mutate, isPending, isSuccess, error } = useLogin();
    const resend = useResendVerification();
    const turnstile = useTurnstile();
    const cooldown = useCooldown(RESEND_COOLDOWN_SECONDS);

    const busy = isPending || isSuccess;
    const needsVerification = isApiError(error) && error.code === AUTH_ERROR_CODE.emailNotVerified;

    function handleChange<K extends keyof LoginInput>(field: K, value: LoginInput[K]) {
        setValues((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!turnstile.ready) return;

        const result = loginSchema.safeParse(values);
        if (!result.success) {
            const fieldErrors: FieldErrors = {};
            for (const issue of result.error.issues) {
                const field = issue.path[0] as keyof LoginInput;
                fieldErrors[field] ??= issue.message;
            }
            setErrors(fieldErrors);
            return;
        }

        resend.reset();
        mutate({ ...result.data, turnstileToken: turnstile.token }, { onSettled: turnstile.reset });
    }

    function handleResend() {
        if (!turnstile.ready) return;
        resend.mutate(
            { email: values.email.trim(), turnstileToken: turnstile.token },
            {
                onSuccess: cooldown.start,
                onSettled: turnstile.reset,
            },
        );
    }

    return (
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {notice && (
                <p
                    role="status"
                    className="flex items-start gap-2 rounded-md bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
                >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                    {notice}
                </p>
            )}

            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                    <Mail
                        aria-hidden
                        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                        id="email"
                        disabled={busy}
                        type="email"
                        autoComplete="email"
                        placeholder="nama@email.com"
                        value={values.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={errors.email ? "email-error" : undefined}
                        className="h-12 pl-10"
                    />
                </div>
                {errors.email && (
                    <p id="email-error" className="text-sm text-destructive">
                        {errors.email}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                    <Label htmlFor="password">Password</Label>
                    <Link href="/forgot-password" className="text-sm font-medium text-primary hover:underline">
                        Lupa password?
                    </Link>
                </div>
                <div className="relative">
                    <Lock
                        aria-hidden
                        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                        id="password"
                        disabled={busy}
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder="••••••••"
                        value={values.password}
                        onChange={(e) => handleChange("password", e.target.value)}
                        aria-invalid={Boolean(errors.password)}
                        aria-describedby={errors.password ? "password-error" : undefined}
                        className="h-12 pl-10 pr-10"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                        {showPassword ? (
                            <EyeOff className="h-4 w-4" aria-hidden />
                        ) : (
                            <Eye className="h-4 w-4" aria-hidden />
                        )}
                    </button>
                </div>
                {errors.password && (
                    <p id="password-error" className="text-sm text-destructive">
                        {errors.password}
                    </p>
                )}
            </div>

            {error && (
                <div
                    role="alert"
                    className="space-y-3 rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive"
                >
                    <p>{error.message}</p>

                    {needsVerification && (
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleResend}
                            disabled={!turnstile.ready || resend.isPending || cooldown.remaining > 0 || isPending}
                            className="bg-background text-foreground"
                        >
                            {resend.isPending && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" aria-hidden />}
                            {cooldown.remaining > 0
                                ? `Kirim ulang dalam ${cooldown.remaining} dtk`
                                : "Kirim ulang email verifikasi"}
                        </Button>
                    )}
                </div>
            )}

            {resend.isSuccess && (
                <p
                    role="status"
                    className="flex items-start gap-2 rounded-md bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
                >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                    {resend.data}
                </p>
            )}

            {resend.isError && (
                <p role="alert" className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {resend.error.message}
                </p>
            )}

            <TurnstileField controller={turnstile} busy={busy} />

            <Button
                type="submit"
                disabled={busy || !turnstile.ready}
                suppressHydrationWarning
                className="h-12 w-full bg-secondary text-base font-semibold text-secondary-foreground hover:bg-secondary/90"
            >
                {busy ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
                        {isSuccess ? "Mengalihkan..." : "Memproses..."}
                    </>
                ) : (
                    <>
                        Masuk ke Akun
                        <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                    </>
                )}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
                Belum punya akun?{" "}
                <Link href="/register" className="font-semibold text-primary hover:underline">
                    Registrasi di sini
                </Link>
            </p>
        </form>
    );
}