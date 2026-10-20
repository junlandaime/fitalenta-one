"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CircleAlert, Loader2, Save } from "lucide-react";
import { FormCard } from "@/components/editor/form-card";
import { CheckboxField, NumberField, SelectField, TextareaField, TextField } from "@/components/editor/form-fields";
import { ImageUploadField } from "@/components/editor/image-upload-field";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { createEmptyEventForm, toEventFormValues } from "@/helpers/editor/editor-event-helper";
import { looksLikeHtml } from "@/helpers/editor/editor-content-helper";
import { focusFirstInvalidField } from "@/helpers/user/registration-helper";
import { useCmsForm } from "@/hooks/editor/use-cms-form";
import { useSaveEditorEvent } from "@/hooks/editor/use-editor-events";
import { collectErrors } from "@/schemas/editor/editor-common";
import { buildEventSchema, type EventFormValues } from "@/schemas/editor/editor-event";
import type { ContentCategory } from "@/types/editor/editor-content";
import type { EditorEvent } from "@/types/editor/editor-event";

type EventFormProps = {
    event?: EditorEvent;
    categories: ContentCategory[];
};

export function EventForm({ event, categories }: EventFormProps) {
    const router = useRouter();
    const save = useSaveEditorEvent();
    const form = useCmsForm<EventFormValues>("event", event ? toEventFormValues(event) : createEmptyEventForm(categories));

    const [image, setImage] = useState<File | null>(null);
    const [imageError, setImageError] = useState<string>();

    const categoryOptions = categories.map((category) => ({ value: String(category.id), label: category.name }));
    const hadMaxParticipants = event?.maxParticipants != null;
    const descriptionConverted = Boolean(event && looksLikeHtml(event.description));

    function handleSubmit(submitEvent: FormEvent<HTMLFormElement>) {
        submitEvent.preventDefault();

        const result = buildEventSchema({ hadMaxParticipants }).safeParse(form.values);
        if (!result.success) {
            form.setErrors(collectErrors<keyof EventFormValues>(result.error.issues));
            focusFirstInvalidField();
            return;
        }

        save.mutate(
            { id: event?.id, payload: { ...result.data, image } },
            { onSuccess: () => router.push(`/editor/events?saved=${event ? "updated" : "created"}`) },
        );
    }

    const busy = save.isPending || save.isSuccess;

    return (
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
            {categories.length === 0 && (
                <Alert variant="destructive">
                    <CircleAlert aria-hidden />
                    <AlertTitle>Kategori belum tersedia</AlertTitle>
                    <AlertDescription>
                        Daftar kategori belum bisa dimuat sehingga event belum dapat disimpan. Hubungi admin untuk
                        menambahkan kategori.
                    </AlertDescription>
                </Alert>
            )}

            <div className="grid items-start gap-6 xl:grid-cols-3">
                <div className="space-y-6 xl:col-span-2">
                    <FormCard title="Informasi event" description="Identitas dan deskripsi event yang tampil di website.">
                        <TextField form={form} name="title" label="Judul event" required />
                        <TextareaField
                            form={form}
                            name="description"
                            label="Deskripsi"
                            required
                            rows={12}
                            hint={
                                descriptionConverted
                                    ? "Deskripsi lama berformat HTML sudah diubah menjadi teks polos. Pisahkan paragraf dengan baris kosong."
                                    : "Teks polos. Pisahkan paragraf dengan baris kosong; tag HTML tidak ditampilkan di website."
                            }
                        />
                        <TextField form={form} name="location" label="Lokasi" required hint="Mis. Zoom Meeting atau nama gedung dan kota." />
                    </FormCard>

                    <FormCard title="Pendaftaran" description="Tautan dan kuota peserta.">
                        <TextField
                            form={form}
                            name="link"
                            label="Tautan pendaftaran"
                            type="url"
                            placeholder="https://"
                            hint="Opsional. Tombol Register Now tampil di event yang belum berlangsung."
                        />
                        <NumberField
                            form={form}
                            name="maxParticipants"
                            label="Kuota peserta"
                            min={1}
                            hint={
                                hadMaxParticipants
                                    ? "Kuota yang sudah diisi tidak dapat dikosongkan, hanya diubah."
                                    : "Opsional. Kosongkan jika tanpa batas."
                            }
                        />
                    </FormCard>
                </div>

                <div className="space-y-6">
                    <FormCard title="Jadwal & kategori" description="Waktu pelaksanaan dan penempatan di website.">
                        <TextField
                            form={form}
                            name="eventDate"
                            label="Tanggal & waktu"
                            type="datetime-local"
                            required
                            hint="Waktu WIB."
                        />
                        <SelectField form={form} name="categoryId" label="Kategori" required options={categoryOptions} />
                        <CheckboxField
                            form={form}
                            name="isFeatured"
                            label="Event pilihan"
                            description="Kartu event diberi penanda Featured di halaman daftar event."
                        />
                    </FormCard>

                    <FormCard title="Gambar event" description="Gambar utama event.">
                        <ImageUploadField
                            id="event-image"
                            label="Gambar event"
                            currentImage={event?.image}
                            file={image}
                            error={imageError}
                            onChange={(file) => {
                                setImage(file);
                                setImageError(undefined);
                            }}
                            onError={setImageError}
                        />
                    </FormCard>
                </div>
            </div>

            {save.isError && (
                <Alert variant="destructive">
                    <CircleAlert aria-hidden />
                    <AlertTitle>Gagal menyimpan event</AlertTitle>
                    <AlertDescription>{save.error.message}</AlertDescription>
                </Alert>
            )}

            <div className="sticky bottom-0 z-20 -mx-4 flex items-center justify-end gap-2 border-t bg-background/90 px-4 py-3 backdrop-blur md:-mx-6 md:px-6">
                <Button asChild variant="outline" disabled={busy}>
                    <Link href="/editor/events">Batal</Link>
                </Button>
                <Button type="submit" disabled={busy || categories.length === 0}>
                    {busy ? (
                        <Loader2 className="animate-spin" data-icon="inline-start" aria-hidden />
                    ) : (
                        <Save data-icon="inline-start" aria-hidden />
                    )}
                    {busy ? "Menyimpan..." : event ? "Simpan perubahan" : "Simpan event"}
                </Button>
            </div>
        </form>
    );
}
