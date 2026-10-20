"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import Image from "next/image";
import { ImageIcon, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FieldShell, fieldA11y } from "@/components/editor/form-fields";
import { CONTENT_IMAGE_RULES } from "@/constants/editor/editor-content-constant";
import { validateImageFile } from "@/helpers/editor/editor-content-helper";
import { cn, imageUrl } from "@/lib/utils";

type ImageUploadFieldProps = {
    id: string;
    label: string;
    required?: boolean;
    hint?: string;
    currentImage?: string | null;
    file: File | null;
    error?: string;
    onChange: (file: File | null) => void;
    onError: (message: string) => void;
    aspectClassName?: string;
};

export function ImageUploadField({
    id,
    label,
    required,
    hint = CONTENT_IMAGE_RULES.label,
    currentImage,
    file,
    error,
    onChange,
    onError,
    aspectClassName = "aspect-video",
}: ImageUploadFieldProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const previewRef = useRef<string | null>(null);

    function replacePreview(next: File | null) {
        if (previewRef.current) URL.revokeObjectURL(previewRef.current);
        previewRef.current = next ? URL.createObjectURL(next) : null;
        setPreview(previewRef.current);
    }

    useEffect(
        () => () => {
            if (previewRef.current) URL.revokeObjectURL(previewRef.current);
        },
        [],
    );

    function handleChange(event: ChangeEvent<HTMLInputElement>) {
        const selected = event.target.files?.[0];
        event.target.value = "";
        if (!selected) return;

        const message = validateImageFile(selected);
        if (message) {
            onError(message);
            return;
        }
        replacePreview(selected);
        onChange(selected);
    }

    function handleClear() {
        replacePreview(null);
        onChange(null);
    }

    const src = preview ?? imageUrl(currentImage);
    const hasImage = Boolean(file || currentImage);

    return (
        <FieldShell id={id} label={label} required={required} hint={hint} error={error}>
            <div
                className={cn(
                    "relative flex w-full items-center justify-center overflow-hidden rounded-lg border bg-muted text-muted-foreground",
                    aspectClassName,
                    error && "border-destructive",
                )}
            >
                {src ? (
                    <Image src={src} alt={`Pratinjau ${label.toLowerCase()}`} fill unoptimized sizes="400px" className="object-cover" />
                ) : (
                    <span className="flex flex-col items-center gap-2 text-sm">
                        <ImageIcon className="size-8" aria-hidden />
                        Belum ada gambar
                    </span>
                )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
                <Button
                    type="button"
                    variant="outline"
                    className="h-9"
                    onClick={() => inputRef.current?.click()}
                    {...fieldA11y(id, error, hint)}
                >
                    <Upload data-icon="inline-start" aria-hidden />
                    {hasImage ? "Ganti gambar" : "Pilih gambar"}
                </Button>
                {file && (
                    <Button type="button" variant="ghost" className="h-9" onClick={handleClear}>
                        <X data-icon="inline-start" aria-hidden />
                        Batalkan pilihan
                    </Button>
                )}
            </div>
            {file && <p className="truncate text-sm text-muted-foreground">{file.name}</p>}

            <input
                ref={inputRef}
                id={id}
                type="file"
                accept={CONTENT_IMAGE_RULES.accept}
                onChange={handleChange}
                tabIndex={-1}
                className="hidden"
            />
        </FieldShell>
    );
}
