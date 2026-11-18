"use client";

import { useState } from "react";
import { CircleAlert, CircleCheck, Megaphone, Plus, RefreshCw, X } from "lucide-react";
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
import { useEditorBanners, useReorderEditorBanners } from "@/hooks/editor/use-editor-banners";
import { useDebounced } from "@/hooks/use-debounced";
import type { EditorBanner, EditorBannerParams } from "@/types/editor/editor-banner";
import { BannerFormSheet } from "./banner-form-sheet";
import { BannerStatCards } from "./banner-stat-cards";
import { BannerTable } from "./banner-table";
import { BannerToolbar } from "./banner-toolbar";
import { DeleteBannerDialog } from "./delete-banner-dialog";

export function BannerManagementView() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<EditorBannerParams["status"]>("all");

    const [formTarget, setFormTarget] = useState<EditorBanner | "new" | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<EditorBanner | null>(null);
    const [notice, setNotice] = useState<string | null>(null);

    const debouncedSearch = useDebounced(search);
    const params: EditorBannerParams = { page, search: debouncedSearch.trim(), status };
    const list = useEditorBanners(params);
    const reorder = useReorderEditorBanners();

    const isFiltered = params.search !== "" || status !== "all";
    const singlePage = (list.data?.meta.totalPages ?? 1) <= 1;
    const canReorder = !isFiltered && singlePage && !reorder.isPending;

    function handleSearchChange(value: string) {
        setSearch(value);
        setPage(1);
    }

    function handleStatusChange(value: EditorBannerParams["status"]) {
        setStatus(value);
        setPage(1);
    }

    function handleSaved(message: string) {
        setFormTarget(null);
        setNotice(message);
    }

    function handleDeleted(item: EditorBanner) {
        setDeleteTarget(null);
        setNotice(`${item.title} berhasil dihapus.`);
        if (page > 1 && list.data?.items.length === 1) setPage(page - 1);
    }

    function handleMove(index: number, direction: -1 | 1) {
        const items = list.data?.items;
        const target = index + direction;
        if (!items || target < 0 || target >= items.length) return;

        const ids = items.map((item) => item.id);
        [ids[index], ids[target]] = [ids[target], ids[index]];

        setNotice(null);
        reorder.mutate(ids, { onSuccess: () => setNotice("Urutan banner berhasil diperbarui.") });
    }

    function description() {
        if (!list.data) return "Memuat data banner...";
        if (isFiltered) return `${list.data.meta.total} banner cocok dengan filter.`;
        return `Menampilkan ${list.data.meta.total} banner, diurutkan sesuai urutan tampil di website.`;
    }

    return (
        <div className="mx-auto w-full max-w-7xl space-y-6">
            <div className="space-y-1">
                <h2 className="text-2xl font-semibold tracking-tight">Manajemen Banner Promo</h2>
                <p className="max-w-2xl text-sm text-muted-foreground">
                    Atur slide promo yang tampil di halaman utama website FITALENTA, lengkap dengan jadwal tayang dan
                    urutannya.
                </p>
            </div>

            <BannerStatCards summary={list.data?.summary} />

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

            {reorder.isError && (
                <Alert variant="destructive">
                    <CircleAlert aria-hidden />
                    <AlertTitle>Urutan banner gagal diubah</AlertTitle>
                    <AlertDescription>{reorder.error.message}</AlertDescription>
                </Alert>
            )}

            <Card>
                <CardHeader className="border-b">
                    <div className="flex items-center gap-3">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                            <Megaphone className="size-5" aria-hidden />
                        </span>
                        <div className="space-y-0.5">
                            <CardTitle className="text-base">Daftar banner</CardTitle>
                            <CardDescription>{description()}</CardDescription>
                        </div>
                    </div>
                    <CardAction className="flex gap-2">
                        <Button variant="outline" onClick={() => list.refetch()} disabled={list.isFetching}>
                            <RefreshCw
                                className={list.isFetching ? "animate-spin" : undefined}
                                data-icon="inline-start"
                                aria-hidden
                            />
                            Refresh
                        </Button>
                        <Button onClick={() => setFormTarget("new")}>
                            <Plus data-icon="inline-start" aria-hidden />
                            Tambah banner
                        </Button>
                    </CardAction>
                </CardHeader>

                <CardContent className="space-y-2">
                    <BannerToolbar
                        search={search}
                        status={status}
                        onSearchChange={handleSearchChange}
                        onStatusChange={handleStatusChange}
                    />
                    {isFiltered && (
                        <p className="text-xs text-muted-foreground">
                            Urutan hanya dapat diubah saat tidak ada pencarian atau filter yang aktif.
                        </p>
                    )}
                </CardContent>

                <CardContent className="px-0">
                    {list.isError ? (
                        <div className="px-(--card-spacing)">
                            <Alert variant="destructive">
                                <CircleAlert aria-hidden />
                                <AlertTitle>Data banner gagal dimuat</AlertTitle>
                                <AlertDescription>{list.error.message}</AlertDescription>
                            </Alert>
                        </div>
                    ) : (
                        <BannerTable
                            items={list.isPending ? undefined : list.data.items}
                            stale={list.isPlaceholderData}
                            canReorder={canReorder}
                            emptyMessage={
                                isFiltered
                                    ? "Tidak ada banner yang cocok dengan filter."
                                    : 'Belum ada banner. Klik "Tambah banner" untuk membuat yang pertama.'
                            }
                            onMove={handleMove}
                            onEdit={setFormTarget}
                            onDelete={setDeleteTarget}
                        />
                    )}
                </CardContent>

                {list.data && list.data.meta.totalPages > 1 && (
                    <CardFooter>
                        <AdminTablePagination
                            meta={list.data.meta}
                            itemLabel="banner"
                            disabled={list.isPlaceholderData}
                            onPageChange={setPage}
                        />
                    </CardFooter>
                )}
            </Card>

            {formTarget && (
                <BannerFormSheet
                    key={formTarget === "new" ? "new" : formTarget.id}
                    target={formTarget}
                    onClose={() => setFormTarget(null)}
                    onSaved={handleSaved}
                />
            )}

            {deleteTarget && (
                <DeleteBannerDialog
                    key={deleteTarget.id}
                    item={deleteTarget}
                    onClose={() => setDeleteTarget(null)}
                    onDeleted={handleDeleted}
                />
            )}
        </div>
    );
}