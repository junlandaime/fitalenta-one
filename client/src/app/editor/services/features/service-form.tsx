"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CircleAlert, Loader2, Save, Wand2 } from "lucide-react";
import { ServiceIcon } from "@/app/(front)/services/features/service-icon";
import { FormCard } from "@/components/editor/form-card";
import { CheckboxField, TextareaField, TextField } from "@/components/editor/form-fields";
import { ListField, ListRowField } from "@/components/editor/list-field";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { SERVICE_ICON_SUGGESTIONS, SERVICE_LIMITS } from "@/constants/editor/editor-service-constant";
import { collectListErrors } from "@/helpers/editor/editor-list-helper";
import {
    createEmptyServiceForm,
    isKnownIcon,
    slugify,
    toServiceFormValues,
    toServicePayload,
    toServicePoints,
} from "@/helpers/editor/editor-service-helper";
import { focusFirstInvalidField } from "@/helpers/user/registration-helper";
import { useCmsForm } from "@/hooks/editor/use-cms-form";
import { useSaveEditorService } from "@/hooks/editor/use-editor-services";
import { collectErrors } from "@/schemas/editor/editor-common";
import { buildServiceSchema, type ServiceFormValues, type ServicePointValue } from "@/schemas/editor/editor-service";
import type { EditorService } from "@/types/editor/editor-service";

type ServiceFormProps = {
    service?: EditorService;
};

export function ServiceForm({ service }: ServiceFormProps) {
    const router = useRouter();
    const save = useSaveEditorService();
    const form = useCmsForm<ServiceFormValues>("service", service ? toServiceFormValues(service) : createEmptyServiceForm());

    const [points, setPoints] = useState<ServicePointValue[]>(() => toServicePoints(service));
    const [pointErrors, setPointErrors] = useState<Record<string, string>>({});

    const icon = form.values.icon.trim();
    const iconUnknown = icon !== "" && !isKnownIcon(icon);

    function handleSubmit(submitEvent: FormEvent<HTMLFormElement>) {
        submitEvent.preventDefault();

        const slug = form.values.slug.trim() || slugify(form.values.title);
        if (slug !== form.values.slug) form.setValue("slug", slug);

        const result = buildServiceSchema().safeParse({ ...form.values, slug, points });
        if (!result.success) {
            form.setErrors(
                collectErrors<keyof ServiceFormValues>(result.error.issues.filter((issue) => issue.path[0] !== "points")),
            );
            setPointErrors(collectListErrors(result.error.issues, "points"));
            focusFirstInvalidField();
            return;
        }
        setPointErrors({});

        save.mutate(
            { id: service?.id, payload: toServicePayload(result.data) },
            { onSuccess: () => router.push(`/editor/services?saved=${service ? "updated" : "created"}`) },
        );
    }

    const busy = save.isPending || save.isSuccess;

    return (
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
            <div className="grid items-start gap-6 xl:grid-cols-3">
                <div className="space-y-6 xl:col-span-2">
                    <FormCard title="Informasi layanan" description="Identitas layanan yang tampil di daftar layanan website.">
                        <TextField form={form} name="title" label="Judul layanan" required />
                        <div className="space-y-2">
                            <TextField
                                form={form}
                                name="slug"
                                label="Slug"
                                required
                                placeholder="mis. event-organizer"
                                hint={
                                    service
                                        ? "Alamat halaman: /services/slug. Mengubah slug akan mengubah URL layanan ini."
                                        : "Alamat halaman: /services/slug. Kosongkan untuk dibuat otomatis dari judul."
                                }
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={form.values.title.trim() === ""}
                                onClick={() => form.setValue("slug", slugify(form.values.title))}
                            >
                                <Wand2 data-icon="inline-start" aria-hidden />
                                Buat dari judul
                            </Button>
                        </div>
                        <TextareaField
                            form={form}
                            name="summary"
                            label="Ringkasan"
                            required
                            rows={3}
                            hint={`Tampil di kartu layanan. Maksimal ${SERVICE_LIMITS.summary} karakter.`}
                        />
                    </FormCard>

                    <FormCard title="Konten detail" description="Isi halaman detail layanan, dari pembuka sampai penutup.">
                        <TextareaField form={form} name="intro" label="Paragraf pembuka" required rows={6} />
                        <TextField
                            form={form}
                            name="listTitle"
                            label="Judul daftar poin"
                            hint="Opsional. Mis. “Our key services include:”."
                        />
                        <ListField<ServicePointValue>
                            id="service-points"
                            label="Daftar poin"
                            itemLabel="Poin"
                            description="Opsional. Urutan poin sama dengan urutan tampil di website."
                            items={points}
                            max={SERVICE_LIMITS.points}
                            errors={pointErrors}
                            createItem={() => ({ title: "", desc: "" })}
                            onChange={setPoints}
                            renderItem={({ item, rowId, setItem, errorFor }) => (
                                <>
                                    <ListRowField
                                        id={`${rowId}-title`}
                                        label="Judul poin"
                                        required
                                        value={item.title}
                                        error={errorFor("title")}
                                        onChange={(title) => setItem({ ...item, title })}
                                    />
                                    <ListRowField
                                        id={`${rowId}-desc`}
                                        label="Deskripsi poin"
                                        required
                                        multiline
                                        rows={4}
                                        value={item.desc}
                                        error={errorFor("desc")}
                                        onChange={(desc) => setItem({ ...item, desc })}
                                    />
                                </>
                            )}
                        />
                        <TextareaField
                            form={form}
                            name="secondParagraph"
                            label="Paragraf lanjutan"
                            rows={5}
                            hint="Opsional. Tampil setelah daftar poin."
                        />
                        <TextareaField
                            form={form}
                            name="closing"
                            label="Paragraf penutup"
                            rows={5}
                            hint="Opsional."
                        />
                    </FormCard>
                </div>

                <div className="space-y-6">
                    <FormCard title="Tampilan" description="Ikon dan penandaan layanan.">
                        <TextField
                            form={form}
                            name="icon"
                            label="Ikon"
                            placeholder="mis. line-chart"
                            hint="Nama ikon Lucide. Kosong atau tidak dikenal akan memakai ikon default."
                        />
                        <div className="flex items-center gap-3 rounded-lg border p-3">
                            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                                <ServiceIcon name={icon} size={20} />
                            </span>
                            <p className="text-sm text-muted-foreground">
                                {iconUnknown ? "Ikon tidak ditemukan, website memakai ikon default." : "Pratinjau ikon"}
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-1.5" aria-label="Saran ikon">
                            {SERVICE_ICON_SUGGESTIONS.map((name) => (
                                <Button
                                    key={name}
                                    type="button"
                                    variant={icon === name ? "default" : "outline"}
                                    size="xs"
                                    onClick={() => form.setValue("icon", name)}
                                >
                                    {name}
                                </Button>
                            ))}
                        </div>
                        <CheckboxField
                            form={form}
                            name="isFeatured"
                            label="Layanan unggulan"
                            description="Menandai layanan sebagai unggulan."
                        />
                    </FormCard>

                    <FormCard title="Gambar" description="Gambar pendukung pada konten layanan.">
                        <TextField
                            form={form}
                            name="images"
                            label="URL gambar"
                            placeholder="https://"
                            hint="Opsional. Layanan menyimpan alamat gambar, bukan file; unggah gambar di tempat lain lalu tempel URL-nya."
                        />
                    </FormCard>
                </div>
            </div>

            {save.isError && (
                <Alert variant="destructive">
                    <CircleAlert aria-hidden />
                    <AlertTitle>Gagal menyimpan layanan</AlertTitle>
                    <AlertDescription>{save.error.message}</AlertDescription>
                </Alert>
            )}

            <div className="sticky bottom-0 z-20 -mx-4 flex items-center justify-end gap-2 border-t bg-background/90 px-4 py-3 backdrop-blur md:-mx-6 md:px-6">
                <Button asChild variant="outline" disabled={busy}>
                    <Link href="/editor/services">Batal</Link>
                </Button>
                <Button type="submit" disabled={busy}>
                    {busy ? (
                        <Loader2 className="animate-spin" data-icon="inline-start" aria-hidden />
                    ) : (
                        <Save data-icon="inline-start" aria-hidden />
                    )}
                    {busy ? "Menyimpan..." : service ? "Simpan perubahan" : "Simpan layanan"}
                </Button>
            </div>
        </form>
    );
}
