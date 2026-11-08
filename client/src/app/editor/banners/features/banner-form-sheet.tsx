"use client";

import { useState, type FormEvent } from "react";
import { CircleAlert, Loader2 } from "lucide-react";
import { CheckboxField, TextareaField, TextField } from "@/components/editor/form-fields";
import { ImageUploadField } from "@/components/editor/image-upload-field";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { BANNER_LIMITS } from "@/constants/editor/editor-banner-constant";
import { CONTENT_IMAGE_RULES } from "@/constants/editor/editor-content-constant";
import { createEmptyBannerForm, toBannerFormValues } from "@/helpers/editor/editor-banner-helper";
import { focusFirstInvalidField } from "@/helpers/user/registration-helper";
import { useCmsForm } from "@/hooks/editor/use-cms-form";
import { useSaveEditorBanner } from "@/hooks/editor/use-editor-banners";
import { buildBannerSchema, type BannerFormValues } from "@/schemas/editor/editor-banner";
import { collectErrors } from "@/schemas/editor/editor-common";
import type { EditorBanner } from "@/types/editor/editor-banner";

type BannerFormSheetProps = {
    target: EditorBanner | "new";
    onClose: () => void;
    onSaved: (message: string) => void;
};

export function BannerFormSheet({ target, onClose, onSaved }: BannerFormSheetProps) {
    const editing = target === "new" ? null : target;
    const save = useSaveEditorBanner();
    const form = useCmsForm<BannerFormValues>("banner", editing ? toBannerFormValues(editing) : createEmptyBannerForm());

    const [image, setImage] = useState<File | null>(null);
    const [imageError, setImageError] = useState<string>();

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const result = buildBannerSchema().safeParse(form.values);
        const missingImage = !editing && !image;

        if (missingImage) setImageError("Gambar banner wajib diunggah");
        if (!result.success) form.setErrors(collectErrors<keyof BannerFormValues>(result.error.issues));

        if (!result.success || missingImage) {
            focusFirstInvalidField();
            return;
        }

        save.mutate(
            { id: editing?.id, payload: { ...result.data, image } },
            {
                onSuccess: () =>
                    onSaved(editing ? "Banner berhasil diperbarui." : "Banner baru berhasil ditambahkan."),
            },
        );
    }

    return (
        <Sheet open onOpenChange={(open) => !open && !save.isPending && onClose()}>
            <SheetContent className="gap-0 sm:max-w-lg">
                <SheetHeader className="border-b">
                    <SheetTitle>{editing ? "Edit banner" : "Tambah banner"}</SheetTitle>
                    <SheetDescription>
                        {editing
                            ? "Perbarui isi dan jadwal tayang banner."
                            : "Banner aktif akan tampil sebagai slide promo di halaman utama."}
                    </SheetDescription>
                </SheetHeader>

                <form onSubmit={handleSubmit} noValidate className="flex min-h-0 flex-1 flex-col">
                    <div className="flex-1 space-y-4 overflow-y-auto p-4">
                        <ImageUploadField
                            id="banner-image"
                            label="Gambar banner"
                            required={!editing}
                            hint={
                                editing
                                    ? "Kosongkan jika tidak ingin mengganti gambar."
                                    : `${CONTENT_IMAGE_RULES.label}. Disarankan gambar lebar (sekitar 1600 x 600 px).`
                            }
                            currentImage={editing?.image}
                            file={image}
                            error={imageError}
                            onChange={(file) => {
                                setImage(file);
                                setImageError(undefined);
                            }}
                            onError={setImageError}
                        />

                        <TextField form={form} name="title" label="Judul" required />
                        <TextareaField
                            form={form}
                            name="subtitle"
                            label="Subjudul"
                            rows={3}
                            hint={`Opsional. Maksimal ${BANNER_LIMITS.subtitle} karakter.`}
                        />
                        <TextField
                            form={form}
                            name="ctaLabel"
                            label="Teks tombol"
                            hint="Opsional. Jika kosong, tombol memakai teks bawaan."
                        />
                        <TextField
                            form={form}
                            name="linkUrl"
                            label="Tautan tombol"
                            placeholder="/programs atau https://..."
                            hint="Opsional. Awali dengan / untuk halaman di website ini, atau https:// untuk situs lain."
                        />
                        <TextField
                            form={form}
                            name="startsAt"
                            label="Mulai tayang"
                            type="datetime-local"
                            hint="Opsional. Kosongkan agar langsung tayang. Waktu dalam WIB."
                        />
                        <TextField
                            form={form}
                            name="endsAt"
                            label="Selesai tayang"
                            type="datetime-local"
                            hint="Opsional. Kosongkan agar tayang tanpa batas waktu. Waktu dalam WIB."
                        />
                        <CheckboxField
                            form={form}
                            name="isActive"
                            label="Aktifkan banner"
                            description="Banner nonaktif disembunyikan dari website meskipun masih dalam jadwal tayang."
                        />

                        {save.isError && (
                            <Alert variant="destructive">
                                <CircleAlert aria-hidden />
                                <AlertTitle>Gagal menyimpan banner</AlertTitle>
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