"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    downloadFinancialReportTemplate,
    exportFinancialReport,
    getFinancialReport,
    getFinancialReportSummary,
    importFinancialReport,
} from "@/services/admin/admin-financial-report-service";
import type { ReportFilters, ReportParams } from "@/types/admin/financial-report";

const REPORT_KEY = ["admin", "financial-reports"] as const;

type Options = { enabled?: boolean };

export function useFinancialReport(params: ReportParams, { enabled = true }: Options = {}) {
    return useQuery({
        queryKey: [...REPORT_KEY, "list", params],
        queryFn: () => getFinancialReport(params),
        placeholderData: keepPreviousData,
        enabled,
    });
}

export function useFinancialReportSummary(filters: ReportFilters, { enabled = true }: Options = {}) {
    return useQuery({
        queryKey: [...REPORT_KEY, "summary", filters],
        queryFn: () => getFinancialReportSummary(filters),
        placeholderData: keepPreviousData,
        enabled,
    });
}

export function useExportFinancialReport() {
    return useMutation({ mutationFn: exportFinancialReport });
}

export function useDownloadReportTemplate() {
    return useMutation({ mutationFn: downloadFinancialReportTemplate });
}

export function useImportFinancialReport() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: importFinancialReport,
        onSuccess: (result) => {
            if (!result.committed) return;
            queryClient.invalidateQueries({ queryKey: REPORT_KEY });
            queryClient.invalidateQueries({ queryKey: ["admin", "payments"] });
            queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
        },
    });
}
