"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CircleAlert, CircleCheck, Newspaper, Plus, RefreshCw, X } from "lucide-react";
import { AdminTablePagination } from "@/components/admin/admin-table-pagination";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useEditorArticles } from "@/hooks/editor/use-editor-articles";
import type { EditorArticle } from "@/types/editor/editor-article";
import { ArticleTable } from "./article-table";
import { DeleteArticleDialog } from "./delete-article-dialog";

const SAVED_NOTICES: Record<string, string> = {
    created: "Artikel baru berhasil ditambahkan.",
    updated: "Artikel berhasil diperbarui.",
};

export function ArticleManagementView() {
    const searchParams = useSearchParams();

    const [page, setPage] = useState(1);
    const [deleteTarget, setDeleteTarget] = useState<EditorArticle | null>(null);
    const [notice, setNotice] = useState<string | null>(() => SAVED_NOTICES[searchParams.get("saved") ?? ""] ?? null);

    useEffect(() => {
        if (searchParams.has("saved")) window.history.replaceState(null, "", "/editor/articles");
    }, [searchParams]);

    const list = useEditorArticles(page);

    function handleDeleted(article: EditorArticle) {
        setDeleteTarget(null);
        setNotice(`Artikel ${article.title} berhasil dihapus.`);
        if (page > 1 && list.data?.articles.length === 1) setPage(page - 1);
    }

    function description() {
        if (!list.data) return "Memuat data artikel...";
        return `Menampilkan ${list.data.meta.total} artikel, diurutkan dari yang terbaru dibuat.`;
    }

    return (
        <div className="mx-auto w-full max-w-7xl space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-2xl font-semibold tracking-tight">Manajemen Artikel</h2>
                    <p className="max-w-2xl text-sm text-muted-foreground">
                        Tulis, jadwalkan, dan perbarui artikel blog. Artikel tampil di website setelah tanggal terbitnya
                        tiba; artikel tanpa tanggal terbit berstatus draft.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/editor/articles/new">
                        <Plus data-icon="inline-start" aria-hidden />
                        Tambah artikel
                    </Link>
                </Button>
            </div>

            {notice && (
                <Alert>
                    <CircleCheck aria-hidden />
                    <AlertTitle className="pr-8">{notice}</AlertTitle>
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        className="absolute top-2 right-2"
                        aria-label="Tutup pemberitahuan"
                        onClick={() => setNotice(null)}
                    >
                        <X aria-hidden />
                    </Button>
                </Alert>
            )}

            <Card>
                <CardHeader className="border-b">
                    <div className="flex items-center gap-3">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                            <Newspaper className="size-5" aria-hidden />
                        </span>
                        <div className="space-y-0.5">
                            <CardTitle className="text-base">Daftar artikel</CardTitle>
                            <CardDescription>{description()}</CardDescription>
                        </div>
                    </div>
                    <CardAction>
                        <Button variant="outline" onClick={() => list.refetch()} disabled={list.isFetching}>
                            <RefreshCw
                                className={list.isFetching ? "animate-spin" : undefined}
                                data-icon="inline-start"
                                aria-hidden
                            />
                            Refresh
                        </Button>
                    </CardAction>
                </CardHeader>

                <CardContent className="px-0">
                    {list.isError ? (
                        <div className="px-(--card-spacing)">
                            <Alert variant="destructive">
                                <CircleAlert aria-hidden />
                                <AlertTitle>Data artikel gagal dimuat</AlertTitle>
                                <AlertDescription>{list.error.message}</AlertDescription>
                            </Alert>
                        </div>
                    ) : (
                        <ArticleTable
                            articles={list.isPending ? undefined : list.data.articles}
                            stale={list.isPlaceholderData}
                            onDelete={setDeleteTarget}
                        />
                    )}
                </CardContent>

                {list.data && (
                    <CardFooter>
                        <AdminTablePagination
                            meta={list.data.meta}
                            itemLabel="artikel"
                            disabled={list.isPlaceholderData}
                            onPageChange={setPage}
                        />
                    </CardFooter>
                )}
            </Card>

            {deleteTarget && (
                <DeleteArticleDialog
                    key={deleteTarget.id}
                    article={deleteTarget}
                    onClose={() => setDeleteTarget(null)}
                    onDeleted={handleDeleted}
                />
            )}
        </div>
    );
}
