"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CircleAlert, CircleCheck, Plus, RefreshCw, ScrollText, X } from "lucide-react";
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
import { useAdminProgramOptions, useAdminPrograms, useAdminProgramSummary } from "@/hooks/admin/use-admin-programs";
import { useDebounced } from "@/hooks/use-debounced";
import type { AdminProgram, AdminProgramParams } from "@/types/admin/admin-program";
import { DeleteProgramDialog } from "./delete-program-dialog";
import { ProgramStatCards } from "./program-stat-cards";
import { ProgramTable } from "./program-table";
import { ProgramToolbar } from "./program-toolbar";

type Filters = Pick<AdminProgramParams, "categoryId" | "status" | "running">;

const INITIAL_FILTERS: Filters = { categoryId: "all", status: "all", running: "all" };

const SAVED_NOTICES: Record<string, string> = {
    created: "Program baru berhasil ditambahkan.",
    updated: "Program berhasil diperbarui.",
};

export function ProgramManagementView() {
    const searchParams = useSearchParams();

    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState("");
    const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS);
    const search = useDebounced(searchInput.trim());

    const [deleteTarget, setDeleteTarget] = useState<AdminProgram | null>(null);
    const [notice, setNotice] = useState<string | null>(() => SAVED_NOTICES[searchParams.get("saved") ?? ""] ?? null);

    useEffect(() => {
        if (searchParams.has("saved")) window.history.replaceState(null, "", "/admin/program");
    }, [searchParams]);

    const list = useAdminPrograms({ page, search, ...filters });
    const summary = useAdminProgramSummary();
    const options = useAdminProgramOptions();

    const filtered = Boolean(search) || Object.values(filters).some((value) => value !== "all");
    const refreshing = list.isFetching || summary.isFetching;

    function handleSearchChange(value: string) {
        setSearchInput(value);
        setPage(1);
    }

    function handleFilterChange<K extends keyof Filters>(name: K, value: Filters[K]) {
        setFilters((current) => ({ ...current, [name]: value }));
        setPage(1);
    }

    function handleDeleted(program: AdminProgram) {
        setDeleteTarget(null);
        setNotice(`Program ${program.name} berhasil dihapus.`);
        if (page > 1 && list.data?.programs.length === 1) setPage(page - 1);
    }

    function description() {
        if (!list.data) return "Memuat data program...";
        if (filtered) return `${list.data.meta.total} program cocok dengan filter.`;
        return `Menampilkan ${list.data.meta.total} program sesuai kategori dan format resmi FITALENTA.`;
    }

    return (
        <div className="mx-auto w-full max-w-7xl space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-2xl font-semibold tracking-tight">Manajemen Program</h2>
                    <p className="max-w-2xl text-sm text-muted-foreground">
                        Kelola program pelatihan, penyaluran, kuota, biaya, jadwal, pembayaran, dan informasi pendukung
                        program FITALENTA.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/admin/program/new">
                        <Plus data-icon="inline-start" aria-hidden />
                        Tambah program
                    </Link>
                </Button>
            </div>

            <ProgramStatCards summary={summary.data} />

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
                            <ScrollText className="size-5" aria-hidden />
                        </span>
                        <div className="space-y-0.5">
                            <CardTitle className="text-base">Daftar program</CardTitle>
                            <CardDescription>{description()}</CardDescription>
                        </div>
                    </div>
                    <CardAction>
                        <Button
                            variant="outline"
                            onClick={() => {
                                list.refetch();
                                summary.refetch();
                            }}
                            disabled={refreshing}
                        >
                            <RefreshCw
                                className={refreshing ? "animate-spin" : undefined}
                                data-icon="inline-start"
                                aria-hidden
                            />
                            Refresh
                        </Button>
                    </CardAction>
                </CardHeader>

                <CardContent>
                    <ProgramToolbar
                        search={searchInput}
                        filters={filters}
                        options={options.data}
                        onSearchChange={handleSearchChange}
                        onFilterChange={handleFilterChange}
                    />
                </CardContent>

                <CardContent className="px-0">
                    {list.isError ? (
                        <div className="px-(--card-spacing)">
                            <Alert variant="destructive">
                                <CircleAlert aria-hidden />
                                <AlertTitle>Data program gagal dimuat</AlertTitle>
                                <AlertDescription>{list.error.message}</AlertDescription>
                            </Alert>
                        </div>
                    ) : (
                        <ProgramTable
                            programs={list.isPending ? undefined : list.data.programs}
                            stale={list.isPlaceholderData}
                            onDelete={setDeleteTarget}
                        />
                    )}
                </CardContent>

                {list.data && (
                    <CardFooter>
                        <AdminTablePagination
                            meta={list.data.meta}
                            itemLabel="program"
                            disabled={list.isPlaceholderData}
                            onPageChange={setPage}
                        />
                    </CardFooter>
                )}
            </Card>

            {deleteTarget && (
                <DeleteProgramDialog
                    key={deleteTarget.id}
                    program={deleteTarget}
                    onClose={() => setDeleteTarget(null)}
                    onDeleted={handleDeleted}
                />
            )}
        </div>
    );
}
