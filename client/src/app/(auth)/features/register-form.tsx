"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ArrowRight, Eye, EyeOff, Loader2, Lock, Mail, Phone, User } from "lucide-react";
import { TurnstileField } from "@/components/common/turnstile-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerSchema, type RegisterInput } from "@/schemas/auth";
import { useRegister } from "@/hooks/auth/use-register";
import { useTurnstile } from "@/hooks/auth/use-turnstile";

type FieldErrors = Partial<Record<keyof RegisterInput, string>>;

const initialValues: RegisterInput = {
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
};

export function RegisterForm() {
    const [values, setValues] = useState<RegisterInput>(initialValues);
    const [errors, setErrors] = useState<FieldErrors>({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { mutate, isPending, isSuccess, error } = useRegister();
    const turnstile = useTurnstile();
    const busy = isPending || isSuccess;

    function handleChange<K extends keyof RegisterInput>(field: K, value: RegisterInput[K]) {
        setValues((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!turnstile.ready) return;

        const result = registerSchema.safeParse(values);
        if (!result.success) {
            const fieldErrors: FieldErrors = {};
            for (const issue of result.error.issues) {
                const field = issue.path[0] as keyof RegisterInput;
                fieldErrors[field] ??= issue.message;
            }
            setErrors(fieldErrors);
            return;
        }

        mutate({ ...result.data, turnstileToken: turnstile.token }, { onSettled: turnstile.reset });
    }

    return (
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap</Label>
                <div className="relative">
                    <User
                        aria-hidden
                        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                        id="name"
                        disabled={busy}
                        type="text"
                        autoComplete="name"
                        placeholder="Nama sesuai KTP"
                        value={values.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={errors.name ? "name-error" : undefined}
                        className="h-12 pl-10"
                    />
                </div>
                {errors.name && (
                    <p id="name-error" className="text-sm text-destructive">
                        {errors.name}
                    </p>
                )}
            </div>

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
                <Label htmlFor="phone">Nomor Telepon</Label>
                <div className="relative">
                    <Phone
                        aria-hidden
                        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                        id="phone"
                        disabled={busy}
                        type="tel"
                        autoComplete="tel"
                        placeholder="08xxxxxxxxxx"
                        value={values.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        aria-invalid={Boolean(errors.phone)}
                        aria-describedby={errors.phone ? "phone-error" : undefined}
                        className="h-12 pl-10"
                    />
                </div>
                {errors.phone && (
                    <p id="phone-error" className="text-sm text-destructive">
                        {errors.phone}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                    <Lock
                        aria-hidden
                        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                        id="password"
                        disabled={busy}
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="Minimal 6 karakter"
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

            <div className="space-y-2">
                <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                <div className="relative">
                    <Lock
                        aria-hidden
                        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                        id="confirmPassword"
                        disabled={busy}
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="Ulangi password"
                        value={values.confirmPassword}
                        onChange={(e) => handleChange("confirmPassword", e.target.value)}
                        aria-invalid={Boolean(errors.confirmPassword)}
                        aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
                        className="h-12 pl-10 pr-10"
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        aria-label={showConfirmPassword ? "Sembunyikan password" : "Tampilkan password"}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                        {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" aria-hidden />
                        ) : (
                            <Eye className="h-4 w-4" aria-hidden />
                        )}
                    </button>
                </div>
                {errors.confirmPassword && (
                    <p id="confirm-password-error" className="text-sm text-destructive">
                        {errors.confirmPassword}
                    </p>
                )}
            </div>

            {error && (
                <p
                    role="alert"
                    className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive"
                >
                    {error.message}
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
                        Buat Akun
                        <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                    </>
                )}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
                Sudah punya akun?{" "}
                <Link href="/login" className="font-semibold text-primary hover:underline">
                    Masuk di sini
                </Link>
            </p>
        </form>
    );
}