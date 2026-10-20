"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { CircleAlert, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ADMIN_USER_ROLES, ROLE_META } from "@/constants/admin/admin-user-constant";
import { buildUpdatePayload } from "@/helpers/admin/admin-user-helper";
import { useSaveAdminUser } from "@/hooks/admin/use-admin-users";
import { PASSWORD_MIN, createUserSchema, updateUserSchema, type UserFormValues } from "@/schemas/admin/admin-user";
import type { AdminUser } from "@/types/admin/admin-user";
import { z } from "zod";

type FieldName = keyof UserFormValues;

type FieldProps = {
    id: FieldName;
    label: string;
    required?: boolean;
    hint?: string;
    error?: string;
    children: ReactNode;
};

function Field({ id, label, required, hint, error, children }: FieldProps) {
    return (
        <div className="space-y-2">
            <Label htmlFor={id}>
                {label}
                {required && (
                    <span aria-hidden className="text-destructive">
                        *
                    </span>
                )}
            </Label>
            {children}
            {error ? (
                <p id={`${id}-error`} role="alert" className="text-sm text-destructive">
                    {error}
                </p>
            ) : hint ? (
                <p id={`${id}-hint`} className="text-sm text-muted-foreground">
                    {hint}
                </p>
            ) : null}
        </div>
    );
}

const a11y = (id: FieldName, error?: string, hint?: string) => ({
    "aria-invalid": Boolean(error),
    "aria-describedby": error ? `${id}-error` : hint ? `${id}-hint` : undefined,
});

type UserFormSheetProps = {
    target: AdminUser | "new";
    isSelf: boolean;
    onClose: () => void;
    onSaved: (message: string) => void;
};

export function UserFormSheet({ target, isSelf, onClose, onSaved }: UserFormSheetProps) {
    const editing = target === "new" ? null : target;
    const save = useSaveAdminUser();

    const [values, setValues] = useState<UserFormValues>(() => ({
        name: editing?.name ?? "",
        email: editing?.email ?? "",
        phone: editing?.phone ?? "",
        role: editing?.role ?? "user",
        password: "",
    }));
    const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});

    function setValue(name: FieldName, value: string) {
        setValues((current) => ({ ...current, [name]: value }));
        setErrors((current) => ({ ...current, [name]: undefined }));
    }

    function toFieldErrors(error: z.ZodError) {
        const next: Partial<Record<FieldName, string>> = {};
        for (const issue of error.issues) {
            const key = issue.path[0] as FieldName;
            next[key] ??= issue.message;
        }
        return next;
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!editing) {
            const result = createUserSchema.safeParse(values);
            if (!result.success) {
                setErrors(toFieldErrors(result.error));
                return;
            }
            const { name, email, phone, role, password } = result.data;
            save.mutate(
                { payload: { name, email, role, password, ...(phone ? { phone } : {}) } },
                { onSuccess: () => onSaved("User baru berhasil ditambahkan.") },
            );
            return;
        }

        const phoneUnchanged = values.phone.trim() === (editing.phone ?? "");
        const result = updateUserSchema.safeParse(phoneUnchanged ? { ...values, phone: "" } : values);
        if (!result.success) {
            setErrors(toFieldErrors(result.error));
            return;
        }

        const payload = buildUpdatePayload(editing, result.data);
        if (Object.keys(payload).length === 0) {
            onClose();
            return;
        }
        save.mutate({ id: editing.id, payload }, { onSuccess: () => onSaved("Data user berhasil diperbarui.") });
    }

    return (
        <Sheet open onOpenChange={(open) => !open && !save.isPending && onClose()}>
            <SheetContent className="gap-0 sm:max-w-md">
                <SheetHeader className="border-b">
                    <SheetTitle>{editing ? "Edit user" : "Tambah user"}</SheetTitle>
                    <SheetDescription>
                        {editing ? "Perbarui informasi akun dan hak akses pengguna." : "Buat akun baru untuk peserta atau pengelola."}
                    </SheetDescription>
                </SheetHeader>

                <form onSubmit={handleSubmit} noValidate className="flex min-h-0 flex-1 flex-col">
                    <div className="flex-1 space-y-4 overflow-y-auto p-4">
                        <Field id="name" label="Nama lengkap" required error={errors.name}>
                            <Input
                                id="name"
                                value={values.name}
                                onChange={(event) => setValue("name", event.target.value)}
                                autoComplete="off"
                                className="h-10"
                                {...a11y("name", errors.name)}
                            />
                        </Field>

                        <Field id="email" label="Email" required error={errors.email}>
                            <Input
                                id="email"
                                type="email"
                                value={values.email}
                                onChange={(event) => setValue("email", event.target.value)}
                                autoComplete="off"
                                className="h-10"
                                {...a11y("email", errors.email)}
                            />
                        </Field>

                        <Field id="phone" label="Nomor telepon" error={errors.phone} hint="Opsional.">
                            <Input
                                id="phone"
                                type="tel"
                                inputMode="tel"
                                value={values.phone}
                                onChange={(event) => setValue("phone", event.target.value)}
                                autoComplete="off"
                                className="h-10"
                                {...a11y("phone", errors.phone, "Opsional.")}
                            />
                        </Field>

                        <Field
                            id="role"
                            label="Tipe user"
                            required
                            error={errors.role}
                            hint={isSelf ? "Anda tidak dapat mengubah tipe akun sendiri." : undefined}
                        >
                            <Select value={values.role} onValueChange={(value) => setValue("role", value)} disabled={isSelf}>
                                <SelectTrigger
                                    id="role"
                                    className="h-10 w-full"
                                    {...a11y("role", errors.role, isSelf ? "x" : undefined)}
                                >
                                    <SelectValue placeholder="Pilih tipe user" />
                                </SelectTrigger>
                                <SelectContent>
                                    {ADMIN_USER_ROLES.map((role) => (
                                        <SelectItem key={role} value={role}>
                                            {ROLE_META[role].label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>

                        {!editing && (
                            <Field id="password" label="Password" required error={errors.password} hint={`Minimal ${PASSWORD_MIN} karakter.`}>
                                <Input
                                    id="password"
                                    type="password"
                                    value={values.password}
                                    onChange={(event) => setValue("password", event.target.value)}
                                    autoComplete="new-password"
                                    className="h-10"
                                    {...a11y("password", errors.password, "hint")}
                                />
                            </Field>
                        )}

                        {save.isError && (
                            <Alert variant="destructive">
                                <CircleAlert aria-hidden />
                                <AlertTitle>Gagal menyimpan user</AlertTitle>
                                <AlertDescription>{save.error.message}</AlertDescription>
                            </Alert>
                        )}
                    </div>

                    <SheetFooter className="border-t sm:flex-row sm:justify-end">
                        <Button type="button" variant="outline" onClick={onClose} disabled={save.isPending}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={save.isPending}>
                            {save.isPending && <Loader2 className="animate-spin" data-icon="inline-start" aria-hidden />}
                            {save.isPending ? "Menyimpan..." : "Simpan"}
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
}
