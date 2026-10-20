"use client";

import { useState, type FormEvent } from "react";
import { CircleAlert, Loader2 } from "lucide-react";
import { CheckboxField, NumberField, SelectField, TextareaField, TextField } from "@/components/editor/form-fields";
import { ImageUploadField } from "@/components/editor/image-upload-field";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { createEmptyGalleryForm, toGalleryFormValues } from "@/helpers/editor/editor-gallery-helper";
import { focusFirstInvalidField } from "@/helpers/user/registration-helper";
import { useCmsForm } from "@/hooks/editor/use-cms-form";
import { useSaveEditorGalleryItem } from "@/hooks/editor/use-editor-gallery";
import { collectErrors } from "@/schemas/editor/editor-common";
import { buildGallerySchema, type GalleryFormValues } from "@/schemas/editor/editor-gallery";
import type { ContentCategory } from "@/types/editor/editor-content";
import type { EditorGalleryItem } from "@/types/editor/editor-gallery";

type GalleryFormSheetProps = {
    target: EditorGalleryItem | "new";
    categories: ContentCategory[];
    onClose: () => void;
    onSaved: (message: string) => void;
};

export function GalleryFormSheet({ target, categories, onClose, onSaved }: GalleryFormSheetProps) {
    const editing = target === "new" ? null : target;
    const save = useSaveEditorGalleryItem();
    const form = useCmsForm<GalleryFormValues>(
        "gallery",
        editing ? toGalleryFormValues(editing) : createEmptyGalleryForm(categories),
    );

    const [image, setImage] = useState<File | null>(null);
    const [imageError, setImageError] = useState<string>();

    const categoryOptions = categories.map((category) => ({ value: String(category.id), label: category.name }));
    const hadEventDate = Boolean(editing?.eventDate);

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const missingImage = !editing && !image;
        if (missingImage) setImageError("Gambar wajib diunggah");

        const result = buildGallerySchema({ hadEventDate }).safeParse(form.values);
        if (!result.success) {
            form.setErrors(collectErrors<keyof GalleryFormValues>(result.error.issues));
        }
        if (!result.success || missingImage) {
            focusFirstInvalidField();
            return;
        }

        save.mutate(
            { id: editing?.id, payload: { ...result.data, image } },
            { onSuccess: () => onSaved(editing ? "Gambar berhasil diperbarui." : "Gambar baru berhasil diunggah.") },
        );
    }

    return (
        <Sheet open onOpenChange={(open) => !open && !save.isPending && onClose()}>
            <SheetContent className="gap-0 sm:max-w-lg">
                <SheetHeader className="border-b">
                    <SheetTitle>{editing ? "Edit gambar" : "Tambah gambar"}</SheetTitle>
                    <SheetDescription>
                        {editing ? "Perbarui detail gambar galeri." : "Unggah gambar baru ke galeri website."}
                    </SheetDescription>
                </SheetHeader>

                <form onSubmit={handleSubmit} noValidate className="flex min-h-0 flex-1 flex-col">
                    <div className="flex-1 space-y-4 overflow-y-auto p-4">
                        <ImageUploadField
                            id="gallery-image"
                            label="Gambar"
                            required={!editing}
                            hint={editing ? "Kosongkan jika tidak ingin mengganti gambar." : undefined}
                            currentImage={editing?.image}
                            file={image}
                            error={imageError}
                            aspectClassName="aspect-4/3"
                            onChange={(file) => {
                                setImage(file);
                                setImageError(undefined);
                            }}
                            onError={setImageError}
                        />

                        <TextField form={form} name="title" label="Judul" required />
                        <SelectField form={form} name="categoryId" label="Kategori" required options={categoryOptions} />
                        <TextareaField form={form} name="description" label="Deskripsi" rows={3} hint="Opsional." />
                        <TextField
                            form={form}
                            name="eventDate"
                            label="Tanggal kegiatan"
                            type="date"
                            hint={
                                hadEventDate
                                    ? "Tanggal yang sudah diisi tidak dapat dikosongkan, hanya diubah."
                                    : "Opsional. Dipakai untuk mengurutkan galeri."
                            }
                        />
                        <NumberField
                            form={form}
                            name="order"
                            label="Urutan"
                            required
                            hint="Semakin kecil angkanya, semakin awal."
                        />
                        <CheckboxField
                            form={form}
                            name="isFeatured"
                            label="Gambar unggulan"
                            description="Gambar unggulan tidak muncul di halaman galeri; hanya tampil sebagai gambar terkait di halaman detail."
                        />

                        {categories.length === 0 && (
                            <Alert variant="destructive">
                                <CircleAlert aria-hidden />
                                <AlertTitle>Kategori belum tersedia</AlertTitle>
                                <AlertDescription>Hubungi admin untuk menambahkan kategori.</AlertDescription>
                            </Alert>
                        )}

                        {save.isError && (
                            <Alert variant="destructive">
                                <CircleAlert aria-hidden />
                                <AlertTitle>Gagal menyimpan gambar</AlertTitle>
                                <AlertDescription>{save.error.message}</AlertDescription>
                            </Alert>
                        )}
                    </div>

                    <SheetFooter className="border-t sm:flex-row sm:justify-end">
                        <Button type="button" variant="outline" onClick={onClose} disabled={save.isPending}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={save.isPending || categories.length === 0}>
                            {save.isPending && <Loader2 className="animate-spin" data-icon="inline-start" aria-hidden />}
                            {save.isPending ? "Menyimpan..." : "Simpan"}
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
}
