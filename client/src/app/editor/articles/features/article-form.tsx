"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CircleAlert, Loader2, Save } from "lucide-react";
import { CheckboxField, SelectField, TextareaField, TextField } from "@/components/editor/form-fields";
import { FormCard } from "@/components/editor/form-card";
import { ImageUploadField } from "@/components/editor/image-upload-field";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { looksLikeHtml } from "@/helpers/editor/editor-content-helper";
import { createEmptyArticleForm, toArticleFormValues } from "@/helpers/editor/editor-article-helper";
import { focusFirstInvalidField } from "@/helpers/user/registration-helper";
import { useCmsForm } from "@/hooks/editor/use-cms-form";
import { useSaveEditorArticle } from "@/hooks/editor/use-editor-articles";
import { buildArticleSchema, type ArticleFormValues } from "@/schemas/editor/editor-article";
import { collectErrors } from "@/schemas/editor/editor-common";
import type { ContentCategory } from "@/types/editor/editor-content";
import type { EditorArticle } from "@/types/editor/editor-article";

type ArticleFormProps = {
    article?: EditorArticle;
    categories: ContentCategory[];
};

export function ArticleForm({ article, categories }: ArticleFormProps) {
    const router = useRouter();
    const save = useSaveEditorArticle();
    const form = useCmsForm<ArticleFormValues>(
        "article",
        article ? toArticleFormValues(article) : createEmptyArticleForm(categories),
    );

    const [image, setImage] = useState<File | null>(null);
    const [imageError, setImageError] = useState<string>();

    const categoryOptions = categories.map((category) => ({ value: String(category.id), label: category.name }));
    const hadPublishDate = Boolean(article?.eventDate);
    const contentConverted = Boolean(article && looksLikeHtml(article.content));

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const result = buildArticleSchema({ hadPublishDate }).safeParse(form.values);
        if (!result.success) {
            form.setErrors(collectErrors<keyof ArticleFormValues>(result.error.issues));
            focusFirstInvalidField();
            return;
        }

        save.mutate(
            { id: article?.id, payload: { ...result.data, image } },
            { onSuccess: () => router.push(`/editor/articles?saved=${article ? "updated" : "created"}`) },
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
                        Daftar kategori belum bisa dimuat sehingga artikel belum dapat disimpan. Hubungi admin untuk
                        menambahkan kategori.
                    </AlertDescription>
                </Alert>
            )}

            <div className="grid items-start gap-6 xl:grid-cols-3">
                <div className="space-y-6 xl:col-span-2">
                    <FormCard title="Isi artikel" description="Judul, ringkasan, dan isi yang tampil di halaman artikel.">
                        <TextField form={form} name="title" label="Judul" required />
                        <TextareaField
                            form={form}
                            name="excerpt"
                            label="Ringkasan"
                            required
                            rows={3}
                            hint="Ringkasan singkat yang tampil di kartu artikel dan hasil pencarian."
                        />
                        <TextareaField
                            form={form}
                            name="content"
                            label="Konten"
                            required
                            rows={18}
                            hint={
                                contentConverted
                                    ? "Konten lama berformat HTML sudah diubah menjadi teks polos. Pisahkan paragraf dengan baris kosong."
                                    : "Teks polos. Pisahkan paragraf dengan baris kosong; tag HTML tidak ditampilkan di website."
                            }
                        />
                    </FormCard>
                </div>

                <div className="space-y-6">
                    <FormCard title="Publikasi" description="Kategori, jadwal terbit, dan penempatan di website.">
                        <SelectField
                            form={form}
                            name="categoryId"
                            label="Kategori"
                            required
                            options={categoryOptions}
                        />
                        <TextField
                            form={form}
                            name="publishedAt"
                            label="Tanggal terbit"
                            type="datetime-local"
                            hint={
                                hadPublishDate
                                    ? "Waktu WIB. Tanggal yang sudah diisi tidak dapat dikosongkan, hanya diubah."
                                    : "Waktu WIB. Kosongkan untuk menyimpan sebagai draft; artikel tampil di website mulai tanggal ini."
                            }
                        />
                        <CheckboxField
                            form={form}
                            name="isFeatured"
                            label="Artikel pilihan"
                            description="Tampil di bagian artikel pilihan pada beranda dan di bagian atas halaman blog (maksimal 3 artikel terbaru)."
                        />
                    </FormCard>

                    <FormCard title="Gambar sampul" description="Gambar utama artikel.">
                        <ImageUploadField
                            id="article-image"
                            label="Gambar sampul"
                            currentImage={article?.image}
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
                    <AlertTitle>Gagal menyimpan artikel</AlertTitle>
                    <AlertDescription>{save.error.message}</AlertDescription>
                </Alert>
            )}

            <div className="sticky bottom-0 z-20 -mx-4 flex items-center justify-end gap-2 border-t bg-background/90 px-4 py-3 backdrop-blur md:-mx-6 md:px-6">
                <Button asChild variant="outline" disabled={busy}>
                    <Link href="/editor/articles">Batal</Link>
                </Button>
                <Button type="submit" disabled={busy || categories.length === 0}>
                    {busy ? (
                        <Loader2 className="animate-spin" data-icon="inline-start" aria-hidden />
                    ) : (
                        <Save data-icon="inline-start" aria-hidden />
                    )}
                    {busy ? "Menyimpan..." : article ? "Simpan perubahan" : "Simpan artikel"}
                </Button>
            </div>
        </form>
    );
}
