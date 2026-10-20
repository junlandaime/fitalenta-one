"use client";

import { useState, type FormEvent } from "react";
import { CircleAlert, Loader2 } from "lucide-react";
import { SelectField, TextareaField, TextField } from "@/components/editor/form-fields";
import { ImageUploadField } from "@/components/editor/image-upload-field";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { RATING_OPTIONS, TESTIMONIAL_LIMITS } from "@/constants/editor/editor-testimonial-constant";
import { createEmptyTestimonialForm, toTestimonialFormValues } from "@/helpers/editor/editor-testimonial-helper";
import { focusFirstInvalidField } from "@/helpers/user/registration-helper";
import { useCmsForm } from "@/hooks/editor/use-cms-form";
import { useSaveEditorTestimonial } from "@/hooks/editor/use-editor-testimonials";
import { collectErrors } from "@/schemas/editor/editor-common";
import { buildTestimonialSchema, type TestimonialFormValues } from "@/schemas/editor/editor-testimonial";
import type { EditorTestimonial } from "@/types/editor/editor-testimonial";

type TestimonialFormSheetProps = {
    target: EditorTestimonial | "new";
    onClose: () => void;
    onSaved: (message: string) => void;
};

export function TestimonialFormSheet({ target, onClose, onSaved }: TestimonialFormSheetProps) {
    const editing = target === "new" ? null : target;
    const save = useSaveEditorTestimonial();
    const form = useCmsForm<TestimonialFormValues>(
        "testimonial",
        editing ? toTestimonialFormValues(editing) : createEmptyTestimonialForm(),
    );

    const [image, setImage] = useState<File | null>(null);
    const [imageError, setImageError] = useState<string>();

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const result = buildTestimonialSchema().safeParse(form.values);
        if (!result.success) {
            form.setErrors(collectErrors<keyof TestimonialFormValues>(result.error.issues));
            focusFirstInvalidField();
            return;
        }

        save.mutate(
            { id: editing?.id, payload: { ...result.data, image } },
            {
                onSuccess: () =>
                    onSaved(editing ? "Testimoni berhasil diperbarui." : "Testimoni baru berhasil ditambahkan."),
            },
        );
    }

    return (
        <Sheet open onOpenChange={(open) => !open && !save.isPending && onClose()}>
            <SheetContent className="gap-0 sm:max-w-lg">
                <SheetHeader className="border-b">
                    <SheetTitle>{editing ? "Edit testimoni" : "Tambah testimoni"}</SheetTitle>
                    <SheetDescription>
                        {editing ? "Perbarui isi testimoni klien." : "Tambahkan testimoni klien baru ke website."}
                    </SheetDescription>
                </SheetHeader>

                <form onSubmit={handleSubmit} noValidate className="flex min-h-0 flex-1 flex-col">
                    <div className="flex-1 space-y-4 overflow-y-auto p-4">
                        <ImageUploadField
                            id="testimonial-image"
                            label="Foto klien"
                            hint={editing ? "Opsional. Kosongkan jika tidak ingin mengganti foto." : undefined}
                            currentImage={editing?.image}
                            file={image}
                            error={imageError}
                            aspectClassName="aspect-square max-w-48"
                            onChange={(file) => {
                                setImage(file);
                                setImageError(undefined);
                            }}
                            onError={setImageError}
                        />

                        <TextField form={form} name="clientName" label="Nama klien" required />
                        <TextField form={form} name="company" label="Perusahaan" required />
                        <TextareaField
                            form={form}
                            name="content"
                            label="Isi testimoni"
                            required
                            rows={6}
                            hint={`Maksimal ${TESTIMONIAL_LIMITS.content.toLocaleString("id-ID")} karakter.`}
                        />
                        <SelectField form={form} name="rating" label="Rating" required options={RATING_OPTIONS} />

                        {save.isError && (
                            <Alert variant="destructive">
                                <CircleAlert aria-hidden />
                                <AlertTitle>Gagal menyimpan testimoni</AlertTitle>
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
