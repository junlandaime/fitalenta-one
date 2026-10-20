"use client";

import { useMemo, useState } from "react";
import { CircleAlert, CircleCheck, Images, Plus, RefreshCw, X } from "lucide-react";
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
import { GALLERY_PER_PAGE } from "@/constants/editor/editor-gallery-constant";
import { filterGallery } from "@/helpers/editor/editor-gallery-helper";
import { useContentCategories } from "@/hooks/editor/use-editor-cms";
import { useEditorGallery } from "@/hooks/editor/use-editor-gallery";
import type { EditorGalleryFilters, EditorGalleryItem } from "@/types/editor/editor-gallery";
import { DeleteGalleryDialog } from "./delete-gallery-dialog";
import { GalleryFormSheet } from "./gallery-form-sheet";
import { GalleryGrid } from "./gallery-grid";
import { GalleryStatCards } from "./gallery-stat-cards";
import { GalleryToolbar } from "./gallery-toolbar";

const INITIAL_FILTERS: EditorGalleryFilters = { search: "", categoryId: "all", featured: "all" };

export function GalleryManagementView() {
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState<EditorGalleryFilters>(INITIAL_FILTERS);

    const [formTarget, setFormTarget] = useState<EditorGalleryItem | "new" | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<EditorGalleryItem | null>(null);
    const [notice, setNotice] = useState<string | null>(null);

    const list = useEditorGallery();
    const items = list.data;

    const categoryList = useContentCategories();
    const categories = categoryList.data;

    const filtered = useMemo(() => (items ? filterGallery(items, filters) : undefined), [items, filters]);
    const isFiltered = filters.search.trim() !== "" || filters.categoryId !== "all" || filters.featured !== "all";

    const totalPages = Math.max(1, Math.ceil((filtered?.length ?? 0) / GALLERY_PER_PAGE));
    const currentPage = Math.min(page, totalPages);
    const pageItems = filtered?.slice((currentPage - 1) * GALLERY_PER_PAGE, currentPage * GALLERY_PER_PAGE);

    function handleFilterChange<K extends keyof EditorGalleryFilters>(name: K, value: EditorGalleryFilters[K]) {
        setFilters((current) => ({ ...current, [name]: value }));
        setPage(1);
    }

    function handleSaved(message: string) {
        setFormTarget(null);
        setNotice(message);
    }

    function handleDeleted(item: EditorGalleryItem) {
        setDeleteTarget(null);
        setNotice(`Gambar ${item.title} berhasil dihapus.`);
    }

    function description() {
        if (!items || !filtered) return "Memuat data galeri...";
        if (isFiltered) return `${filtered.length} gambar cocok dengan filter.`;
        return `Menampilkan ${items.length} gambar, diurutkan dari yang terbaru diunggah.`;
    }

    return (
        <div className="mx-auto w-full max-w-7xl space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-2xl font-semibold tracking-tight">Manajemen Galeri</h2>
                    <p className="max-w-2xl text-sm text-muted-foreground">
                        Unggah dan atur dokumentasi foto kegiatan FITALENTA yang tampil di halaman galeri website.
                    </p>
                </div>
                <Button onClick={() => setFormTarget("new")} disabled={!categories}>
                    <Plus data-icon="inline-start" aria-hidden />
                    Tambah gambar
                </Button>
            </div>

            <GalleryStatCards total={items?.length} featured={items?.filter((item) => item.isFeatured).length} />

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
                            <Images className="size-5" aria-hidden />
                        </span>
                        <div className="space-y-0.5">
                            <CardTitle className="text-base">Daftar gambar</CardTitle>
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

                <CardContent>
                    <GalleryToolbar filters={filters} categories={categories ?? []} onChange={handleFilterChange} />
                </CardContent>

                <CardContent>
                    {list.isError ? (
                        <Alert variant="destructive">
                            <CircleAlert aria-hidden />
                            <AlertTitle>Data galeri gagal dimuat</AlertTitle>
                            <AlertDescription>{list.error.message}</AlertDescription>
                        </Alert>
                    ) : (
                        <GalleryGrid
                            items={pageItems}
                            emptyMessage={
                                isFiltered
                                    ? "Tidak ada gambar yang cocok dengan filter."
                                    : "Belum ada gambar. Klik \"Tambah gambar\" untuk mengunggah yang pertama."
                            }
                            onEdit={setFormTarget}
                            onDelete={setDeleteTarget}
                        />
                    )}
                </CardContent>

                {filtered && filtered.length > 0 && (
                    <CardFooter>
                        <AdminTablePagination
                            meta={{ total: filtered.length, page: currentPage, limit: GALLERY_PER_PAGE, totalPages }}
                            itemLabel="gambar"
                            onPageChange={setPage}
                        />
                    </CardFooter>
                )}
            </Card>

            {formTarget && categories && (
                <GalleryFormSheet
                    key={formTarget === "new" ? "new" : formTarget.id}
                    target={formTarget}
                    categories={categories}
                    onClose={() => setFormTarget(null)}
                    onSaved={handleSaved}
                />
            )}

            {deleteTarget && (
                <DeleteGalleryDialog
                    key={deleteTarget.id}
                    item={deleteTarget}
                    onClose={() => setDeleteTarget(null)}
                    onDeleted={handleDeleted}
                />
            )}
        </div>
    );
}
