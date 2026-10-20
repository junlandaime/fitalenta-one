"use client";

import { useState } from "react";
import { CircleAlert, CircleCheck, Plus, RefreshCw, Tags, X } from "lucide-react";
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
import { useAdminProgramCategories } from "@/hooks/admin/use-admin-program-categories";
import { useDebounced } from "@/hooks/use-debounced";
import type { AdminProgramCategory } from "@/types/admin/admin-program-category";
import { CategoryFormSheet } from "./category-form-sheet";
import { CategoryTable } from "./category-table";
import { CategoryToolbar } from "./category-toolbar";
import { DeleteCategoryDialog } from "./delete-category-dialog";

export function CategoryManagementView() {
    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState("");
    const search = useDebounced(searchInput.trim());

    const [formTarget, setFormTarget] = useState<AdminProgramCategory | "new" | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<AdminProgramCategory | null>(null);
    const [notice, setNotice] = useState<string | null>(null);

    const list = useAdminProgramCategories({ page, search });
    const filtered = Boolean(search);

    function handleSearchChange(value: string) {
        setSearchInput(value);
        setPage(1);
    }

    function handleSaved(message: string) {
        setFormTarget(null);
        setNotice(message);
    }

    function handleDeleted(category: AdminProgramCategory) {
        setDeleteTarget(null);
        setNotice(`Kategori ${category.name} berhasil dihapus.`);
        if (page > 1 && list.data?.categories.length === 1) setPage(page - 1);
    }

    function description() {
        if (!list.data) return "Memuat data kategori...";
        if (filtered) return `${list.data.meta.total} kategori cocok dengan pencarian.`;
        return `Menampilkan ${list.data.meta.total} kategori program yang tersedia.`;
    }

    return (
        <div className="mx-auto w-full max-w-7xl space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-2xl font-semibold tracking-tight">Kategori Program</h2>
                    <p className="max-w-2xl text-sm text-muted-foreground">
                        Kelola kategori untuk mengelompokkan program pelatihan FITALENTA. Kategori yang masih
                        digunakan program tidak dapat dihapus.
                    </p>
                </div>
                <Button onClick={() => setFormTarget("new")}>
                    <Plus data-icon="inline-start" aria-hidden />
                    Tambah kategori
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
                            <Tags className="size-5" aria-hidden />
                        </span>
                        <div className="space-y-0.5">
                            <CardTitle className="text-base">Daftar kategori</CardTitle>
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
                    <CategoryToolbar search={searchInput} onSearchChange={handleSearchChange} />
                </CardContent>

                <CardContent className="px-0">
                    {list.isError ? (
                        <div className="px-(--card-spacing)">
                            <Alert variant="destructive">
                                <CircleAlert aria-hidden />
                                <AlertTitle>Data kategori gagal dimuat</AlertTitle>
                                <AlertDescription>{list.error.message}</AlertDescription>
                            </Alert>
                        </div>
                    ) : (
                        <CategoryTable
                            categories={list.isPending ? undefined : list.data.categories}
                            filtered={filtered}
                            stale={list.isPlaceholderData}
                            onEdit={setFormTarget}
                            onDelete={setDeleteTarget}
                        />
                    )}
                </CardContent>

                {list.data && (
                    <CardFooter>
                        <AdminTablePagination
                            meta={list.data.meta}
                            itemLabel="kategori"
                            disabled={list.isPlaceholderData}
                            onPageChange={setPage}
                        />
                    </CardFooter>
                )}
            </Card>

            {formTarget && (
                <CategoryFormSheet
                    key={formTarget === "new" ? "new" : formTarget.id}
                    target={formTarget}
                    onClose={() => setFormTarget(null)}
                    onSaved={handleSaved}
                />
            )}

            {deleteTarget && (
                <DeleteCategoryDialog
                    key={deleteTarget.id}
                    category={deleteTarget}
                    onClose={() => setDeleteTarget(null)}
                    onDeleted={handleDeleted}
                />
            )}
        </div>
    );
}
