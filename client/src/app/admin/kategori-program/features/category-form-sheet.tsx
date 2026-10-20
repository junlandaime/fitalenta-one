"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { CircleAlert, Loader2 } from "lucide-react";
import { z } from "zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { PROGRAM_CATEGORY_LIMITS } from "@/constants/admin/admin-program-category-constant";
import { buildCategoryUpdatePayload } from "@/helpers/admin/admin-program-category-helper";
import { useSaveAdminProgramCategory } from "@/hooks/admin/use-admin-program-categories";
import { isApiError } from "@/lib/api-error";
import { programCategorySchema, type ProgramCategoryFormValues } from "@/schemas/admin/admin-program-category";
import type { AdminProgramCategory } from "@/types/admin/admin-program-category";

type FieldName = keyof ProgramCategoryFormValues;
type FieldErrors = Partial<Record<FieldName, string>>;

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

function toFieldErrors(error: z.ZodError): FieldErrors {
    const next: FieldErrors = {};
    for (const issue of error.issues) {
        const key = issue.path[0] as FieldName;
        next[key] ??= issue.message;
    }
    return next;
}

const FIELD_NAMES: readonly string[] = ["name", "description"];

type CategoryFormSheetProps = {
    target: AdminProgramCategory | "new";
    onClose: () => void;
    onSaved: (message: string) => void;
};

export function CategoryFormSheet({ target, onClose, onSaved }: CategoryFormSheetProps) {
    const editing = target === "new" ? null : target;
    const save = useSaveAdminProgramCategory();

    const [values, setValues] = useState<ProgramCategoryFormValues>(() => ({
        name: editing?.name ?? "",
        description: editing?.description ?? "",
    }));
    const [errors, setErrors] = useState<FieldErrors>({});

    function setValue(name: FieldName, value: string) {
        setValues((current) => ({ ...current, [name]: value }));
        setErrors((current) => ({ ...current, [name]: undefined }));
    }

    function handleServerError(error: Error) {
        if (!isApiError(error) || !error.details) return;
        const next: FieldErrors = {};
        for (const { field, message } of error.details) {
            if (FIELD_NAMES.includes(field)) next[field as FieldName] ??= message;
        }
        setErrors(next);
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const result = programCategorySchema.safeParse(values);
        if (!result.success) {
            setErrors(toFieldErrors(result.error));
            return;
        }
        const { name, description } = result.data;

        if (!editing) {
            save.mutate(
                { payload: { name, ...(description ? { description } : {}) } },
                { onSuccess: () => onSaved("Kategori program berhasil ditambahkan."), onError: handleServerError },
            );
            return;
        }

        const payload = buildCategoryUpdatePayload(editing, result.data);
        if (Object.keys(payload).length === 0) {
            onClose();
            return;
        }
        save.mutate(
            { id: editing.id, payload },
            { onSuccess: () => onSaved("Kategori program berhasil diperbarui."), onError: handleServerError },
        );
    }

    const hasFieldError = Object.values(errors).some(Boolean);

    return (
        <Sheet open onOpenChange={(open) => !open && !save.isPending && onClose()}>
            <SheetContent className="gap-0 sm:max-w-md">
                <SheetHeader className="border-b">
                    <SheetTitle>{editing ? "Edit kategori" : "Tambah kategori"}</SheetTitle>
                    <SheetDescription>
                        {editing
                            ? "Perbarui nama dan deskripsi kategori program."
                            : "Buat kategori baru untuk mengelompokkan program pelatihan."}
                    </SheetDescription>
                </SheetHeader>

                <form onSubmit={handleSubmit} noValidate className="flex min-h-0 flex-1 flex-col">
                    <div className="flex-1 space-y-4 overflow-y-auto p-4">
                        <Field id="name" label="Nama kategori" required error={errors.name}>
                            <Input
                                id="name"
                                value={values.name}
                                onChange={(event) => setValue("name", event.target.value)}
                                autoComplete="off"
                                className="h-10"
                                {...a11y("name", errors.name)}
                            />
                        </Field>

                        <Field
                            id="description"
                            label="Deskripsi"
                            error={errors.description}
                            hint={`Opsional, maksimal ${PROGRAM_CATEGORY_LIMITS.descriptionMax} karakter.`}
                        >
                            <Textarea
                                id="description"
                                rows={4}
                                value={values.description}
                                onChange={(event) => setValue("description", event.target.value)}
                                {...a11y("description", errors.description, "hint")}
                            />
                        </Field>

                        {save.isError && !hasFieldError && (
                            <Alert variant="destructive">
                                <CircleAlert aria-hidden />
                                <AlertTitle>Gagal menyimpan kategori</AlertTitle>
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
