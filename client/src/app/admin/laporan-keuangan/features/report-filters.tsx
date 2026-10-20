import { Filter, RotateCcw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PAYMENT_METHOD_META, PAYMENT_STATUS_VALUES } from "@/constants/admin/admin-payment-constant";
import { PAYMENT_STATUS, statusLabel } from "@/constants/admin/admin-status";
import { TERMIN_OPTIONS } from "@/constants/admin/financial-report-constant";
import type { PaymentMethod, PaymentStatus } from "@/types/admin/admin-payment";
import type { ReportFilters, TerminType } from "@/types/admin/financial-report";

const controlClass =
    "h-10 w-full rounded-md border bg-background px-3 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:opacity-60";

export type FilterState = Omit<ReportFilters, "search">;

const METHOD_VALUES = Object.keys(PAYMENT_METHOD_META) as PaymentMethod[];

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
    return (
        <label className={`space-y-1.5 ${className ?? ""}`}>
            <span className="text-[11px] font-semibold">{label}</span>
            {children}
        </label>
    );
}

type Props = {
    search: string;
    filters: FilterState;
    rangeError?: string;
    dirty: boolean;
    onSearchChange: (value: string) => void;
    onFilterChange: <K extends keyof FilterState>(name: K, value: FilterState[K]) => void;
    onReset: () => void;
};

export function ReportFiltersCard({ search, filters, rangeError, dirty, onSearchChange, onFilterChange, onReset }: Props) {
    return (
        <Card className="gap-0 p-0 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b p-5">
                <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                        <Filter className="size-4" aria-hidden />
                    </div>
                    <div>
                        <p className="text-[10px] font-semibold tracking-wider text-blue-600 uppercase">Filter Data</p>
                        <h3 className="text-lg leading-tight font-bold">Filter &amp; Pencarian</h3>
                        <p className="text-xs text-muted-foreground">
                            Sesuaikan laporan berdasarkan status, termin, metode, periode, atau peserta.
                        </p>
                    </div>
                </div>
                <Button variant="outline" size="sm" onClick={onReset} disabled={!dirty}>
                    <RotateCcw data-icon="inline-start" aria-hidden />
                    Reset filter
                </Button>
            </div>

            <div className="grid gap-4 p-5 sm:grid-cols-2 xl:grid-cols-5">
                <Field label="Pencarian" className="sm:col-span-2 xl:col-span-5">
                    <div className="relative">
                        <Search
                            className="absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground"
                            aria-hidden
                        />
                        <input
                            type="search"
                            className={`${controlClass} pl-9`}
                            placeholder="Cari peserta, email, program, nomor invoice, atau kwitansi..."
                            value={search}
                            onChange={(e) => onSearchChange(e.target.value)}
                        />
                    </div>
                </Field>

                <Field label="Status Pembayaran">
                    <select
                        className={controlClass}
                        value={filters.status}
                        onChange={(e) => onFilterChange("status", e.target.value as PaymentStatus | "all")}
                    >
                        <option value="all">Semua Status</option>
                        {PAYMENT_STATUS_VALUES.map((status) => (
                            <option key={status} value={status}>
                                {statusLabel(PAYMENT_STATUS, status)}
                            </option>
                        ))}
                    </select>
                </Field>

                <Field label="Termin">
                    <select
                        className={controlClass}
                        value={filters.termin}
                        onChange={(e) => onFilterChange("termin", e.target.value as TerminType | "all")}
                    >
                        <option value="all">Semua Termin</option>
                        {TERMIN_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </Field>

                <Field label="Metode Pembayaran">
                    <select
                        className={controlClass}
                        value={filters.paymentMethod}
                        onChange={(e) => onFilterChange("paymentMethod", e.target.value as PaymentMethod | "all")}
                    >
                        <option value="all">Semua Metode</option>
                        {METHOD_VALUES.map((method) => (
                            <option key={method} value={method}>
                                {PAYMENT_METHOD_META[method].label}
                            </option>
                        ))}
                    </select>
                </Field>

                <Field label="Tanggal Mulai">
                    <input
                        type="date"
                        className={controlClass}
                        value={filters.dateFrom}
                        max={filters.dateTo || undefined}
                        aria-invalid={Boolean(rangeError)}
                        onChange={(e) => onFilterChange("dateFrom", e.target.value)}
                    />
                </Field>

                <Field label="Tanggal Akhir">
                    <input
                        type="date"
                        className={controlClass}
                        value={filters.dateTo}
                        min={filters.dateFrom || undefined}
                        aria-invalid={Boolean(rangeError)}
                        onChange={(e) => onFilterChange("dateTo", e.target.value)}
                    />
                </Field>

                {rangeError && (
                    <p role="alert" className="text-sm text-destructive sm:col-span-2 xl:col-span-5">
                        {rangeError}
                    </p>
                )}
            </div>
        </Card>
    );
}
