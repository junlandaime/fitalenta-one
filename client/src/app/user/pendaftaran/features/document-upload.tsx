"use client";

import { useRef, type ChangeEvent, type ReactNode } from "react";
import { FileCheck2, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DOCUMENT_RULES } from "@/constants/registration-constant";
import { cn } from "@/lib/utils";
import { useRegistrationStore } from "@/store/registration-store";
import type { RegistrationDocumentKey } from "@/types/user/registration";
import { FieldShell } from "./form-field";

type DocumentUploadProps = {
    name: RegistrationDocumentKey;
    label: string;
    required?: boolean;
    hint?: string;
    extra?: ReactNode;
};

const formatSize = (bytes: number) =>
    bytes < 1024 * 1024 ? `${Math.round(bytes / 1024)} KB` : `${(bytes / (1024 * 1024)).toFixed(2)} MB`;

export function DocumentUpload({ name, label, required, hint, extra }: DocumentUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const file = useRegistrationStore((state) => state.draft[name]);
    const error = useRegistrationStore((state) => state.errors[name]);
    const setField = useRegistrationStore((state) => state.setField);
    const setError = useRegistrationStore((state) => state.setError);

    function handleChange(event: ChangeEvent<HTMLInputElement>) {
        const picked = event.target.files?.[0];
        event.target.value = "";
        if (!picked) return;

        if (!(DOCUMENT_RULES.types as readonly string[]).includes(picked.type)) {
            setError(name, "Format file harus PDF, JPG, PNG, atau WEBP");
            return;
        }
        if (picked.size > DOCUMENT_RULES.maxSize) {
            setError(name, "Ukuran file maksimal 5 MB");
            return;
        }
        setField(name, picked);
    }

    return (
        <FieldShell id={name} label={label} required={required} hint={hint} error={error}>
            {extra}
            <input
                ref={inputRef}
                id={name}
                type="file"
                accept={DOCUMENT_RULES.accept}
                onChange={handleChange}
                className="sr-only"
                aria-invalid={Boolean(error)}
            />
            <div
                className={cn(
                    "flex flex-wrap items-center justify-between gap-3 rounded-lg border border-dashed px-3.5 py-2.5",
                    error ? "border-destructive bg-destructive/5" : "border-input bg-muted/20",
                )}
            >
                <div className="flex min-w-0 items-center gap-2.5">
                    {file ? (
                        <>
                            <FileCheck2 className="size-4 shrink-0 text-primary" aria-hidden />
                            <div className="min-w-0">
                                <p className="truncate text-sm font-medium">{file.name}</p>
                                <p className="text-xs text-muted-foreground">{formatSize(file.size)}</p>
                            </div>
                        </>
                    ) : (
                        <p className="text-sm text-muted-foreground">{DOCUMENT_RULES.label}</p>
                    )}
                </div>
                <div className="flex items-center gap-1.5">
                    <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
                        <Upload className="size-3.5" aria-hidden />
                        {file ? "Ganti" : "Pilih file"}
                    </Button>
                    {file && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setField(name, null)}
                            aria-label={`Hapus ${label}`}
                        >
                            <Trash2 className="size-3.5" aria-hidden />
                        </Button>
                    )}
                </div>
            </div>
        </FieldShell>
    );
}
