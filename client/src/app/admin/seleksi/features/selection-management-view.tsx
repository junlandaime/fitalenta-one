"use client";

import { useState } from "react";
import { CircleAlert, ClipboardCheck, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
    useAdminParticipants,
    useAdminSelectionOptions,
    useAdminSelectionSummary,
} from "@/hooks/admin/use-admin-selection-placements";
import { useDebounced } from "@/hooks/use-debounced";
import type { ParticipantParams } from "@/types/admin/selection-placement";
import { SelectionFilters } from "./selection-filters";
import { SelectionStatCards } from "./selection-stat-cards";
import { SelectionTable } from "./selection-table";

type Filters = Pick<ParticipantParams, "selectionStatus" | "placementStatus">;

const INITIAL_FILTERS: Filters = { selectionStatus: "all", placementStatus: "all" };

export function SelectionManagementView() {
    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState("");
    const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS);
    const search = useDebounced(searchInput.trim());

    const list = useAdminParticipants({ page, search, ...filters });
    const summary = useAdminSelectionSummary();
    const options = useAdminSelectionOptions();

    const refreshing = list.isFetching || summary.isFetching;

    function handleSearchChange(value: string) {
        setSearchInput(value);
        setPage(1);
    }

    function handleFilterChange<K extends keyof Filters>(name: K, value: Filters[K]) {
        setFilters((current) => ({ ...current, [name]: value }));
        setPage(1);
    }

    function refresh() {
        list.refetch();
        summary.refetch();
    }

    return (
        <div className="mx-auto w-full max-w-7xl space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div className="space-y-1">
                    <p className="flex items-center gap-1.5 text-[10px] font-semibold tracking-wider text-orange-600 uppercase">
                        <ClipboardCheck className="size-3" aria-hidden />
                        Manajemen Peserta
                    </p>
                    <h2 className="text-3xl font-bold tracking-tight">Manajemen Seleksi &amp; Penyaluran</h2>
                    <p className="max-w-2xl text-sm text-muted-foreground">
                        Kelola proses seleksi, kelulusan, penempatan, dan status penyaluran peserta.
                    </p>
                </div>
                <Button onClick={refresh} disabled={refreshing}>
                    <RefreshCw className={refreshing ? "animate-spin" : undefined} data-icon="inline-start" aria-hidden />
                    Refresh Data
                </Button>
            </div>

            {summary.isError ? (
                <Alert variant="destructive">
                    <CircleAlert aria-hidden />
                    <AlertTitle>Statistik gagal dimuat</AlertTitle>
                    <AlertDescription>{summary.error.message}</AlertDescription>
                </Alert>
            ) : (
                <SelectionStatCards summary={summary.data} />
            )}

            <SelectionFilters
                search={searchInput}
                filters={filters}
                options={options.data}
                onSearchChange={handleSearchChange}
                onFilterChange={handleFilterChange}
            />

            {list.isError ? (
                <Alert variant="destructive">
                    <CircleAlert aria-hidden />
                    <AlertTitle>Data peserta gagal dimuat</AlertTitle>
                    <AlertDescription>{list.error.message}</AlertDescription>
                </Alert>
            ) : (
                <SelectionTable
                    rows={list.data?.items}
                    meta={list.data?.meta}
                    stale={list.isPlaceholderData}
                    refreshing={refreshing}
                    onRefresh={refresh}
                    onPageChange={setPage}
                />
            )}
        </div>
    );
}
