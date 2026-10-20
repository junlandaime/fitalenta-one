"use client";

import Link from "next/link";
import { ArrowLeft, CircleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useEditorArticle } from "@/hooks/editor/use-editor-articles";
import { useContentCategories } from "@/hooks/editor/use-editor-cms";
import { ArticleForm } from "./article-form";

function FormSkeleton() {
    return (
        <div aria-busy="true" aria-label="Memuat form artikel" className="grid gap-6 xl:grid-cols-3">
            <div className="space-y-6 xl:col-span-2">
                <Skeleton className="h-96 rounded-xl" />
            </div>
            <div className="space-y-6">
                <Skeleton className="h-64 rounded-xl" />
                <Skeleton className="h-72 rounded-xl" />
            </div>
        </div>
    );
}

type ArticleFormViewProps = {
    articleId?: number;
};

export function ArticleFormView({ articleId }: ArticleFormViewProps) {
    const isEdit = articleId !== undefined;
    const validId = isEdit && Number.isInteger(articleId) && articleId > 0;

    const categories = useContentCategories();
    const article = useEditorArticle(validId ? articleId : undefined);

    const error = isEdit && !validId ? new Error("Artikel tidak ditemukan") : categories.error ?? article.error;
    const ready = categories.data && (!isEdit || article.data);

    return (
        <div className="mx-auto w-full max-w-7xl space-y-6">
            <div className="space-y-3">
                <Button asChild variant="ghost" size="sm" className="-ml-2">
                    <Link href="/editor/articles">
                        <ArrowLeft data-icon="inline-start" aria-hidden />
                        Kembali ke daftar artikel
                    </Link>
                </Button>
                <div className="space-y-1">
                    <h2 className="text-2xl font-semibold tracking-tight">{isEdit ? "Edit Artikel" : "Tambah Artikel"}</h2>
                    <p className="max-w-2xl text-sm text-muted-foreground">
                        {isEdit
                            ? "Perbarui isi, gambar, dan jadwal terbit artikel."
                            : "Tulis artikel baru yang akan tampil di halaman blog FITALENTA."}
                    </p>
                </div>
            </div>

            {error ? (
                <Alert variant="destructive">
                    <CircleAlert aria-hidden />
                    <AlertTitle>Data artikel gagal dimuat</AlertTitle>
                    <AlertDescription>{error.message}</AlertDescription>
                </Alert>
            ) : ready ? (
                <ArticleForm key={article.data?.id ?? "new"} article={article.data} categories={categories.data} />
            ) : (
                <FormSkeleton />
            )}
        </div>
    );
}
