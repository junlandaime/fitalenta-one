"use client";

import { useMemo, useState } from "react";
import { CircleAlert, CircleCheck, MessageSquareQuote, Plus, RefreshCw, X } from "lucide-react";
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
import { TESTIMONIALS_PER_PAGE } from "@/constants/editor/editor-testimonial-constant";
import { averageRating, filterTestimonials } from "@/helpers/editor/editor-testimonial-helper";
import { useEditorTestimonials, useToggleEditorTestimonial } from "@/hooks/editor/use-editor-testimonials";
import type { EditorTestimonial, EditorTestimonialFilters } from "@/types/editor/editor-testimonial";
import { DeleteTestimonialDialog } from "./delete-testimonial-dialog";
import { TestimonialFormSheet } from "./testimonial-form-sheet";
import { TestimonialStatCards } from "./testimonial-stat-cards";
import { TestimonialTable } from "./testimonial-table";
import { TestimonialToolbar } from "./testimonial-toolbar";

const INITIAL_FILTERS: EditorTestimonialFilters = { search: "", featured: "all", rating: "all" };

export function TestimonialManagementView() {
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState<EditorTestimonialFilters>(INITIAL_FILTERS);

    const [formTarget, setFormTarget] = useState<EditorTestimonial | "new" | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<EditorTestimonial | null>(null);
    const [notice, setNotice] = useState<string | null>(null);
    const [toggleError, setToggleError] = useState<string | null>(null);

    const list = useEditorTestimonials();
    const toggle = useToggleEditorTestimonial();
    const items = list.data;

    const filtered = useMemo(() => (items ? filterTestimonials(items, filters) : undefined), [items, filters]);
    const isFiltered = filters.search.trim() !== "" || filters.featured !== "all" || filters.rating !== "all";

    const totalPages = Math.max(1, Math.ceil((filtered?.length ?? 0) / TESTIMONIALS_PER_PAGE));
    const currentPage = Math.min(page, totalPages);
    const pageItems = filtered?.slice((currentPage - 1) * TESTIMONIALS_PER_PAGE, currentPage * TESTIMONIALS_PER_PAGE);

    function handleFilterChange<K extends keyof EditorTestimonialFilters>(name: K, value: EditorTestimonialFilters[K]) {
        setFilters((current) => ({ ...current, [name]: value }));
        setPage(1);
    }

    function handleSaved(message: string) {
        setFormTarget(null);
        setNotice(message);
    }

    function handleDeleted(item: EditorTestimonial) {
        setDeleteTarget(null);
        setNotice(`Testimoni dari ${item.clientName} berhasil dihapus.`);
    }

    function handleToggle(item: EditorTestimonial) {
        setToggleError(null);
        toggle.mutate(item.id, {
            onSuccess: (updated) =>
                setNotice(
                    updated.isFeatured
                        ? `Testimoni dari ${item.clientName} ditandai sebagai unggulan.`
                        : `Testimoni dari ${item.clientName} tidak lagi ditandai unggulan.`,
                ),
            onError: (error) => setToggleError(error.message),
        });
    }

    function description() {
        if (!items || !filtered) return "Memuat data testimoni...";
        if (isFiltered) return `${filtered.length} testimoni cocok dengan filter.`;
        return `Menampilkan ${items.length} testimoni, diurutkan dari yang terbaru dibuat.`;
    }

    return (
        <div className="mx-auto w-full max-w-7xl space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-2xl font-semibold tracking-tight">Manajemen Testimoni</h2>
                    <p className="max-w-2xl text-sm text-muted-foreground">
                        Kelola testimoni klien FITALENTA beserta rating dan penandaan unggulan yang tampil di website.
                    </p>
                </div>
                <Button onClick={() => setFormTarget("new")}>
                    <Plus data-icon="inline-start" aria-hidden />
                    Tambah testimoni
                </Button>
            </div>

            <TestimonialStatCards
                total={items?.length}
                featured={items?.filter((item) => item.isFeatured).length}
                average={items ? averageRating(items) : undefined}
            />

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

            {toggleError && (
                <Alert variant="destructive">
                    <CircleAlert aria-hidden />
                    <AlertTitle>Status unggulan gagal diubah</AlertTitle>
                    <AlertDescription>{toggleError}</AlertDescription>
                </Alert>
            )}

            <Card>
                <CardHeader className="border-b">
                    <div className="flex items-center gap-3">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                            <MessageSquareQuote className="size-5" aria-hidden />
                        </span>
                        <div className="space-y-0.5">
                            <CardTitle className="text-base">Daftar testimoni</CardTitle>
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
                    <TestimonialToolbar filters={filters} onChange={handleFilterChange} />
                </CardContent>

                <CardContent className="px-0">
                    {list.isError ? (
                        <div className="px-(--card-spacing)">
                            <Alert variant="destructive">
                                <CircleAlert aria-hidden />
                                <AlertTitle>Data testimoni gagal dimuat</AlertTitle>
                                <AlertDescription>{list.error.message}</AlertDescription>
                            </Alert>
                        </div>
                    ) : (
                        <TestimonialTable
                            items={pageItems}
                            emptyMessage={
                                isFiltered
                                    ? "Tidak ada testimoni yang cocok dengan filter."
                                    : "Belum ada testimoni. Klik \"Tambah testimoni\" untuk membuat yang pertama."
                            }
                            togglingId={toggle.isPending ? toggle.variables : undefined}
                            onToggle={handleToggle}
                            onEdit={setFormTarget}
                            onDelete={setDeleteTarget}
                        />
                    )}
                </CardContent>

                {filtered && filtered.length > 0 && (
                    <CardFooter>
                        <AdminTablePagination
                            meta={{ total: filtered.length, page: currentPage, limit: TESTIMONIALS_PER_PAGE, totalPages }}
                            itemLabel="testimoni"
                            onPageChange={setPage}
                        />
                    </CardFooter>
                )}
            </Card>

            {formTarget && (
                <TestimonialFormSheet
                    key={formTarget === "new" ? "new" : formTarget.id}
                    target={formTarget}
                    onClose={() => setFormTarget(null)}
                    onSaved={handleSaved}
                />
            )}

            {deleteTarget && (
                <DeleteTestimonialDialog
                    key={deleteTarget.id}
                    item={deleteTarget}
                    onClose={() => setDeleteTarget(null)}
                    onDeleted={handleDeleted}
                />
            )}
        </div>
    );
}
