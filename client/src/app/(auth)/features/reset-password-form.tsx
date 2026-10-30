"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { PasswordField } from "@/components/common/password-field";
import { Button } from "@/components/ui/button";
import { useResetPassword } from "@/hooks/auth/use-reset-password";
import { PASSWORD_MIN_LENGTH, resetPasswordSchema, type ResetPasswordInput } from "@/schemas/auth";

type FieldErrors = Partial<Record<keyof ResetPasswordInput, string>>;

const initialValues: ResetPasswordInput = { newPassword: "", confirmPassword: "" };

export function ResetPasswordForm({ token }: { token: string }) {
    const [values, setValues] = useState<ResetPasswordInput>(initialValues);
    const [errors, setErrors] = useState<FieldErrors>({});

    const { mutate, isPending, isSuccess, error } = useResetPassword();
    const busy = isPending || isSuccess;

    function handleChange<K extends keyof ResetPasswordInput>(field: K, value: string) {
        setValues((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const result = resetPasswordSchema.safeParse(values);
        if (!result.success) {
            const fieldErrors: FieldErrors = {};
            for (const issue of result.error.issues) {
                const field = issue.path[0] as keyof ResetPasswordInput;
                fieldErrors[field] ??= issue.message;
            }
            setErrors(fieldErrors);
            return;
        }

        mutate({
            token,
            newPassword: result.data.newPassword,
            confirmPassword: result.data.confirmPassword,
        });
    }

    return (
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <PasswordField
                id="newPassword"
                label="Password baru"
                autoComplete="new-password"
                placeholder={`Minimal ${PASSWORD_MIN_LENGTH} karakter`}
                value={values.newPassword}
                onChange={(value) => handleChange("newPassword", value)}
                error={errors.newPassword}
                disabled={busy}
            />
            <PasswordField
                id="confirmPassword"
                label="Konfirmasi password baru"
                autoComplete="new-password"
                placeholder="Ulangi password baru"
                value={values.confirmPassword}
                onChange={(value) => handleChange("confirmPassword", value)}
                error={errors.confirmPassword}
                disabled={busy}
            />

            {error && (
                <div role="alert" className="space-y-1.5 rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    <p className="font-medium">{error.message}</p>
                    <p className="text-xs text-muted-foreground">
                        Tautan kedaluwarsa atau bermasalah?{" "}
                        <Link href="/forgot-password" className="font-semibold text-primary underline underline-offset-2">
                            Minta tautan reset baru di sini
                        </Link>
                    </p>
                </div>
            )}

            <Button
                type="submit"
                disabled={busy}
                className="h-12 w-full bg-secondary text-base font-semibold text-secondary-foreground hover:bg-secondary/90"
            >
                {busy ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
                        {isSuccess ? "Mengalihkan..." : "Menyimpan..."}
                    </>
                ) : (
                    <>
                        Simpan Password Baru
                        <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                    </>
                )}
            </Button>
        </form>
    );
}
