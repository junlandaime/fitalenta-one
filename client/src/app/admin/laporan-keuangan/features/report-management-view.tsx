"use client";

import { useState } from "react";
import { ChartNoAxesCombined, CircleAlert, CircleCheck, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { INITIAL_REPORT_FILTERS } from "@/constants/admin/financial-report-constant";
import {
    useDownloadReportTemplate,
    useExportFinancialReport,
    useFinancialReport,
    useFinancialReportSummary,
} from "@/hooks/admin/use-admin-financial-report";
import { useDebounced } from "@/hooks/use-debounced";
import { saveFile } from "@/lib/file-download";
import type { ImportResult } from "@/types/admin/financial-report";
import { ImportReportSheet } from "./import-report-sheet";
import { ReportActionsCard } from "./report-actions-card";
import { ReportFiltersCard, type FilterState } from "./report-filters";
import { ReportStatCards } from "./report-stat-cards";
import { ReportTable } from "./report-table";

type Notice = { tone: "success" | "error"; message: string };

export function ReportManagementView() {
    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState("");
    const [filters, setFilters] = useState<FilterState>(INITIAL_REPORT_FILTERS);
    const search = useDebounced(searchInput.trim());

    const [importOpen, setImportOpen] = useState(false);
    const [notice, setNotice] = useState<Notice | null>(null);

    const rangeInvalid = Boolean(filters.dateFrom && filters.dateTo && filters.dateFrom > filters.dateTo);
    const rangeError = rangeInvalid ? "Tanggal mulai tidak boleh setelah tanggal akhir." : undefined;

    const activeFilters = { search, ...filters };
    const list = useFinancialReport({ page, ...activeFilters }, { enabled: !rangeInvalid });
    const summary = useFinancialReportSummary(activeFilters, { enabled: !rangeInvalid });
    const exportReport = useExportFinancialReport();
    const downloadTemplate = useDownloadReportTemplate();

    const dirty = Boolean(searchInput) || Object.entries(filters).some(([key, value]) => value !== INITIAL_REPORT_FILTERS[key as keyof FilterState]);
    const refreshing = list.isFetching || summary.isFetching;

    function handleSearchChange(value: string) {
        setSearchInput(value);
        setPage(1);
    }

    function handleFilterChange<K extends keyof FilterState>(name: K, value: FilterState[K]) {
        setFilters((current) => ({ ...current, [name]: value }));
        setPage(1);
    }

    function handleReset() {
        setSearchInput("");
        setFilters(INITIAL_REPORT_FILTERS);
        setPage(1);
    }

    function refresh() {
        list.refetch();
        summary.refetch();
    }

    function handleExport() {
        setNotice(null);
        exportReport.mutate(activeFilters, {
            onSuccess: saveFile,
            onError: (error) => setNotice({ tone: "error", message: error.message }),
        });
    }

    function handleTemplate() {
        downloadTemplate.mutate(undefined, {
            onSuccess: saveFile,
            onError: (error) => setNotice({ tone: "error", message: error.message }),
        });
    }

    function handleImported(result: ImportResult) {
        setImportOpen(false);
        setPage(1);
        setNotice({
            tone: "success",
            message: `Import selesai: ${result.created} tagihan dibuat, ${result.updated} diperbarui.`,
        });
    }

    return (
        <div className="mx-auto w-full max-w-7xl space-y-6">
            <div className="space-y-1">
                <p className="flex items-center gap-1.5 text-[10px] font-semibold tracking-wider text-orange-600 uppercase">
                    <ChartNoAxesCombined className="size-3" aria-hidden />
                    Manajemen Keuangan
                </p>
                <h2 className="text-3xl font-bold tracking-tight">Laporan Keuangan</h2>
                <p className="max-w-2xl text-sm text-muted-foreground">
                    Monitoring, analisis, dan rekapitulasi transaksi keuangan seluruh program FITALENTA.
                </p>
            </div>

            {summary.isError ? (
                <Alert variant="destructive">
                    <CircleAlert aria-hidden />
                    <AlertTitle>Ringkasan gagal dimuat</AlertTitle>
                    <AlertDescription>{summary.error.message}</AlertDescription>
                </Alert>
            ) : (
                <ReportStatCards summary={rangeInvalid ? undefined : summary.data} />
            )}

            <ReportFiltersCard
                search={searchInput}
                filters={filters}
                rangeError={rangeError}
                dirty={dirty}
                onSearchChange={handleSearchChange}
                onFilterChange={handleFilterChange}
                onReset={handleReset}
            />

            {notice && (
                <Alert variant={notice.tone === "error" ? "destructive" : "default"}>
                    {notice.tone === "error" ? <CircleAlert aria-hidden /> : <CircleCheck aria-hidden />}
                    <AlertTitle className="pr-8">{notice.message}</AlertTitle>
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

            <ReportActionsCard
                exporting={exportReport.isPending}
                downloadingTemplate={downloadTemplate.isPending}
                exportDisabled={rangeInvalid}
                onExport={handleExport}
                onTemplate={handleTemplate}
                onImport={() => setImportOpen(true)}
            />

            {list.isError ? (
                <Alert variant="destructive">
                    <CircleAlert aria-hidden />
                    <AlertTitle>Data laporan gagal dimuat</AlertTitle>
                    <AlertDescription>{list.error.message}</AlertDescription>
                </Alert>
            ) : (
                <ReportTable
                    rows={list.data?.items}
                    meta={list.data?.meta}
                    stale={list.isPlaceholderData || rangeInvalid}
                    refreshing={refreshing}
                    onRefresh={refresh}
                    onPageChange={setPage}
                />
            )}

            {importOpen && (
                <ImportReportSheet
                    downloadingTemplate={downloadTemplate.isPending}
                    onDownloadTemplate={handleTemplate}
                    onClose={() => setImportOpen(false)}
                    onImported={handleImported}
                />
            )}
        </div>
    );
}
