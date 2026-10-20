import type { ReportFilters, TerminType } from "@/types/admin/financial-report";

export const REPORT_PER_PAGE = 20;

export const INITIAL_REPORT_FILTERS: Omit<ReportFilters, "search"> = {
    status: "all",
    termin: "all",
    paymentMethod: "all",
    dateFrom: "",
    dateTo: "",
};

export const TERMIN_OPTIONS: { value: TerminType; label: string }[] = [
    { value: "cash", label: "Tunai" },
    { value: "installment", label: "Cicilan" },
];

export const IMPORT_ACCEPT = ".xlsx";
