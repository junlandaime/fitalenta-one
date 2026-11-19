"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { CircleAlert, ImagePlus, Loader2, X } from "lucide-react";
import { CheckboxField, NumberField, SelectField, TextareaField, TextField } from "@/components/editor/form-fields";
import { ImageUploadField } from "@/components/editor/image-upload-field";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { createEmptyGalleryForm, toGalleryFormValues } from "@/helpers/editor/editor-gallery-helper";
import { focusFirstInvalidField } from "@/helpers/user/registration-helper";
import { useCmsForm } from "@/hooks/editor/use-cms-form";
import { useSaveEditorGalleryItem } from "@/hooks/editor/use-editor-gallery";
import { imageUrl } from "@/lib/utils";
import { collectErrors } from "@/schemas/editor/editor-common";
import { buildGallerySchema, type GalleryFormValues } from "@/schemas/editor/editor-gallery";
import type { ContentCategory } from "@/types/editor/editor-content";
import type { EditorGalleryItem } from "@/types/editor/editor-gallery";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const MAX_EXTRA_PHOTOS = 30;

type NewPhotoPreview = {
    id: string;
    file: File;
    previewUrl: string;
};

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

    const [existingImages, setExistingImages] = useState<string[]>(() =>
        Array.isArray(editing?.images) ? editing.images : [],
    );
    const [newPhotos, setNewPhotos] = useState<NewPhotoPreview[]>([]);
    const [extraImagesError, setExtraImagesError] = useState<string>();
    const extraInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        return () => {
            newPhotos.forEach((item) => URL.revokeObjectURL(item.previewUrl));
        };
    }, [newPhotos]);

    const categoryOptions = categories.map((category) => ({ value: String(category.id), label: category.name }));
    const hadEventDate = Boolean(editing?.eventDate);
    const totalExtraCount = existingImages.length + newPhotos.length;

    function handleAddExtraPhotos(event: ChangeEvent<HTMLInputElement>) {
        const fileList = event.target.files;
        if (!fileList || fileList.length === 0) return;

        const selectedFiles = Array.from(fileList);
        event.target.value = "";

        if (totalExtraCount + selectedFiles.length > MAX_EXTRA_PHOTOS) {
            setExtraImagesError(`Maksimal ${MAX_EXTRA_PHOTOS} foto tambahan per galeri.`);
            return;
        }

        const validItems: NewPhotoPreview[] = [];
        for (const file of selectedFiles) {
            if (!ALLOWED_TYPES.includes(file.type)) {
                setExtraImagesError(`Format "${file.name}" tidak didukung (gunakan JPG, PNG, WEBP, atau GIF).`);
                return;
            }
            if (file.size > MAX_SIZE_BYTES) {
                setExtraImagesError(`Ukuran "${file.name}" melebihi batas maksimal 5 MB.`);
                return;
            }
            validItems.push({
                id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
                file,
                previewUrl: URL.createObjectURL(file),
            });
        }

        setExtraImagesError(undefined);
        setNewPhotos((prev) => [...prev, ...validItems]);
    }

    function handleRemoveExistingExtra(targetUrl: string) {
        setExistingImages((prev) => prev.filter((url) => url !== targetUrl));
    }

    function handleRemoveNewExtra(targetId: string) {
        setNewPhotos((prev) => {
            const found = prev.find((item) => item.id === targetId);
            if (found) URL.revokeObjectURL(found.previewUrl);
            return prev.filter((item) => item.id !== targetId);
        });
    }

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
            {
                id: editing?.id,
                payload: {
                    ...result.data,
                    image,
                    existingImages,
                    newImages: newPhotos.map((item) => item.file),
                },
            },
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
                            label="Gambar Utama (Sampul)"
                            required={!editing}
                            hint={editing ? "Kosongkan jika tidak ingin mengganti gambar utama." : undefined}
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

                        {/* --- FOTO DOKUMENTASI TAMBAHAN (ALBUM) --- */}
                        <div className="space-y-2.5 rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
                            <div className="flex items-center justify-between gap-2">
                                <div>
                                    <p className="text-sm font-medium text-slate-900">
                                        Foto Dokumentasi Tambahan
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        Opsional. Bisa unggah banyak foto kegiatan sekaligus ({totalExtraCount}/{MAX_EXTRA_PHOTOS}).
                                    </p>
                                </div>

                                <input
                                    ref={extraInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp,image/gif"
                                    multiple
                                    onChange={handleAddExtraPhotos}
                                    className="hidden"
                                />

                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={totalExtraCount >= MAX_EXTRA_PHOTOS}
                                    onClick={() => extraInputRef.current?.click()}
                                    className="shrink-0 bg-white"
                                >
                                    <ImagePlus className="mr-1.5 size-4" />
                                    Tambah foto
                                </Button>
                            </div>

                            {(existingImages.length > 0 || newPhotos.length > 0) && (
                                <div className="grid grid-cols-3 gap-2.5 pt-1">
                                    {existingImages.map((imgPath, idx) => {
                                        const resolved = imageUrl(imgPath);
                                        return (
                                            <div
                                                key={`${imgPath}-${idx}`}
                                                className="group relative aspect-4/3 overflow-hidden rounded-lg border border-slate-200 bg-white"
                                            >
                                                {resolved && (
                                                    <img
                                                        src={resolved}
                                                        alt={`Foto tambahan ${idx + 1}`}
                                                        className="size-full object-cover"
                                                    />
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveExistingExtra(imgPath)}
                                                    aria-label="Hapus foto tambahan"
                                                    className="absolute right-1.5 top-1.5 flex size-6 items-center justify-center rounded-full bg-slate-900/75 text-white transition-colors hover:bg-red-600"
                                                >
                                                    <X className="size-3.5" />
                                                </button>
                                            </div>
                                        );
                                    })}

                                    {newPhotos.map((item, idx) => (
                                        <div
                                            key={item.id}
                                            className="group relative aspect-4/3 overflow-hidden rounded-lg border border-primary/40 bg-white"
                                        >
                                            <img
                                                src={item.previewUrl}
                                                alt={`Foto baru ${idx + 1}`}
                                                className="size-full object-cover"
                                            />
                                            <span className="absolute bottom-1 left-1 rounded bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-white">
                                                Baru
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveNewExtra(item.id)}
                                                aria-label="Hapus foto baru"
                                                className="absolute right-1.5 top-1.5 flex size-6 items-center justify-center rounded-full bg-slate-900/75 text-white transition-colors hover:bg-red-600"
                                            >
                                                <X className="size-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {extraImagesError && (
                                <p className="text-xs font-medium text-destructive">{extraImagesError}</p>
                            )}
                        </div>

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