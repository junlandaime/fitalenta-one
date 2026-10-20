"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, CircleAlert, Loader2 } from "lucide-react";
import { PasswordField } from "@/components/common/password-field";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useChangePassword } from "@/hooks/auth/use-change-password";
import { changePasswordSchema, PASSWORD_MIN_LENGTH, type ChangePasswordInput } from "@/schemas/auth";

type FieldErrors = Partial<Record<keyof ChangePasswordInput, string>>;

const initialValues: ChangePasswordInput = { currentPassword: "", newPassword: "", confirmPassword: "" };

export function ChangePasswordSheet({ onClose }: { onClose: () => void }) {
    const { mutate, isPending, isSuccess, data, error } = useChangePassword();

    const [values, setValues] = useState<ChangePasswordInput>(initialValues);
    const [errors, setErrors] = useState<FieldErrors>({});

    function handleChange<K extends keyof ChangePasswordInput>(field: K, value: string) {
        setValues((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const result = changePasswordSchema.safeParse(values);
        if (!result.success) {
            const fieldErrors: FieldErrors = {};
            for (const issue of result.error.issues) {
                const field = issue.path[0] as keyof ChangePasswordInput;
                fieldErrors[field] ??= issue.message;
            }
            setErrors(fieldErrors);
            return;
        }

        mutate(
            { currentPassword: result.data.currentPassword, newPassword: result.data.newPassword },
            { onSuccess: () => setValues(initialValues) },
        );
    }

    return (
        <Sheet open onOpenChange={(open) => !open && !isPending && onClose()}>
            <SheetContent className="gap-0 sm:max-w-md!">
                <SheetHeader className="border-b">
                    <SheetTitle>Ubah password</SheetTitle>
                    <SheetDescription>Masukkan password saat ini, lalu tentukan password baru Anda.</SheetDescription>
                </SheetHeader>

                {isSuccess ? (
                    <>
                        <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
                            <CheckCircle2 className="h-12 w-12 text-emerald-600" aria-hidden />
                            <h3 className="text-lg font-semibold">Password berhasil diubah</h3>
                            <p role="status" className="text-sm text-muted-foreground">
                                {data}
                            </p>
                        </div>
                        <SheetFooter className="border-t">
                            <Button onClick={onClose}>Tutup</Button>
                        </SheetFooter>
                    </>
                ) : (
                    <form onSubmit={handleSubmit} noValidate className="flex min-h-0 flex-1 flex-col">
                        <div className="flex-1 space-y-4 overflow-y-auto p-4">
                            <PasswordField
                                compact
                                id="currentPassword"
                                label="Password saat ini"
                                autoComplete="current-password"
                                value={values.currentPassword}
                                onChange={(value) => handleChange("currentPassword", value)}
                                error={errors.currentPassword}
                                disabled={isPending}
                            />
                            <PasswordField
                                compact
                                id="newPassword"
                                label="Password baru"
                                autoComplete="new-password"
                                placeholder={`Minimal ${PASSWORD_MIN_LENGTH} karakter`}
                                value={values.newPassword}
                                onChange={(value) => handleChange("newPassword", value)}
                                error={errors.newPassword}
                                disabled={isPending}
                            />
                            <PasswordField
                                compact
                                id="confirmPassword"
                                label="Konfirmasi password baru"
                                autoComplete="new-password"
                                value={values.confirmPassword}
                                onChange={(value) => handleChange("confirmPassword", value)}
                                error={errors.confirmPassword}
                                disabled={isPending}
                            />

                            {error && (
                                <Alert variant="destructive">
                                    <CircleAlert aria-hidden />
                                    <AlertTitle>Password gagal diubah</AlertTitle>
                                    <AlertDescription>{error.message}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        <SheetFooter className="border-t sm:flex-row sm:justify-end">
                            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={isPending}>
                                {isPending && <Loader2 className="animate-spin" data-icon="inline-start" aria-hidden />}
                                {isPending ? "Menyimpan..." : "Simpan password"}
                            </Button>
                        </SheetFooter>
                    </form>
                )}
            </SheetContent>
        </Sheet>
    );
}
