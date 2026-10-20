import { api } from "@/lib/axios";
import { fetchFile } from "@/lib/file-download";
import { REPORT_PER_PAGE } from "@/constants/admin/financial-report-constant";
import type { ApiResponse } from "@/types/api";
import type { AdminPageMeta } from "@/types/pagination";
import type {
    DownloadedFile,
    ImportResult,
    ReportFilters,
    ReportList,
    ReportParams,
    ReportRow,
    ReportSummary,
} from "@/types/admin/financial-report";

const BASE_URL = "/admin/financial-reports";

function toFilterQuery(filters: ReportFilters) {
    return {
        search: filters.search || undefined,
        status: filters.status === "all" ? undefined : filters.status,
        termin: filters.termin === "all" ? undefined : filters.termin,
        paymentMethod: filters.paymentMethod === "all" ? undefined : filters.paymentMethod,
        dateFrom: filters.dateFrom || undefined,
        dateTo: filters.dateTo || undefined,
    };
}

export async function getFinancialReport({ page, ...filters }: ReportParams): Promise<ReportList> {
    const { data } = await api.get<{ success: boolean; data: ReportRow[]; meta: AdminPageMeta }>(BASE_URL, {
        params: { page, limit: REPORT_PER_PAGE, ...toFilterQuery(filters) },
    });
    return { items: data.data, meta: data.meta };
}

export async function getFinancialReportSummary(filters: ReportFilters): Promise<ReportSummary> {
    const { data } = await api.get<ApiResponse<ReportSummary>>(`${BASE_URL}/summary`, {
        params: toFilterQuery(filters),
    });
    return data.data;
}

const today = () => new Date().toISOString().slice(0, 10);

export function exportFinancialReport(filters: ReportFilters): Promise<DownloadedFile> {
    return fetchFile(`${BASE_URL}/export`, {
        params: toFilterQuery(filters),
        fallbackName: `laporan-keuangan-${today()}.xlsx`,
        errorMessage: "Laporan gagal diekspor. Silakan coba lagi.",
    });
}

export function downloadFinancialReportTemplate(): Promise<DownloadedFile> {
    return fetchFile(`${BASE_URL}/template`, {
        fallbackName: "template-impor-laporan-keuangan.xlsx",
        errorMessage: "Template gagal diunduh. Silakan coba lagi.",
    });
}

type ImportVariables = { file: File; dryRun: boolean };

export async function importFinancialReport({ file, dryRun }: ImportVariables): Promise<ImportResult> {
    const body = new FormData();
    body.append("file", file);
    body.append("dryRun", String(dryRun));

    const { data } = await api.post<ApiResponse<ImportResult>>(
        `${BASE_URL}/import`,
        body,
        { headers: { "Content-Type": "multipart/form-data" } },
    );
    return data.data;
}
