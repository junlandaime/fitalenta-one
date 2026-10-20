import { Filter, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PAYMENT_STATUS, PLACEMENT_STATUS, SELECTION_STATUS, statusLabel, type StatusMap } from "@/constants/admin/admin-status";
import type { AdminFilterOptions, AdminRegistrationQuery } from "@/types/admin/admin-dashboard";

const controlClass =
    "h-10 w-full rounded-md border bg-background px-3 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:opacity-60";

type Patch = Partial<AdminRegistrationQuery>;

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
    return (
        <label className={`space-y-1.5 ${className ?? ""}`}>
            <span className="text-[11px] font-semibold">{label}</span>
            {children}
        </label>
    );
}

function StatusSelect<T extends string>({
    value,
    onChange,
    allLabel,
    values,
    map,
}: {
    value: T | "";
    onChange: (value: T | "") => void;
    allLabel: string;
    values: T[];
    map: StatusMap;
}) {
    return (
        <select className={controlClass} value={value} onChange={(e) => onChange(e.target.value as T | "")}>
            <option value="">{allLabel}</option>
            {values.map((value) => (
                <option key={value} value={value}>
                    {statusLabel(map, value)}
                </option>
            ))}
        </select>
    );
}

type Props = {
    search: string;
    query: AdminRegistrationQuery;
    options?: AdminFilterOptions;
    onSearchChange: (value: string) => void;
    onChange: (patch: Patch) => void;
};

export function RegistrationFilters({ search, query, options, onSearchChange, onChange }: Props) {
    return (
        <Card className="gap-0 p-0 shadow-xs">
            <div className="flex items-center gap-3 border-b p-5">
                <div className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <Filter className="size-4" aria-hidden />
                </div>
                <div>
                    <p className="text-[10px] font-semibold tracking-wider text-blue-600 uppercase">Filter Data</p>
                    <h3 className="text-lg leading-tight font-bold">Filter &amp; Pencarian</h3>
                    <p className="text-xs text-muted-foreground">Temukan data peserta berdasarkan kriteria tertentu.</p>
                </div>
            </div>

            <div className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-[2fr_1fr_1fr_1fr_1fr]">
                <Field label="Pencarian" className="md:col-span-2 xl:col-span-1">
                    <div className="relative">
                        <Search className="absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" aria-hidden />
                        <input
                            type="search"
                            className={`${controlClass} pl-9`}
                            placeholder="Cari nama, email, telepon, atau kode pendaftaran..."
                            value={search}
                            onChange={(e) => onSearchChange(e.target.value)}
                        />
                    </div>
                </Field>

                <Field label="Program">
                    <select
                        className={controlClass}
                        value={query.programId}
                        onChange={(e) => onChange({ programId: e.target.value })}
                    >
                        <option value="">Semua Program</option>
                        {options?.programs.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.name}
                            </option>
                        ))}
                    </select>
                </Field>

                <Field label="Pembayaran">
                    <StatusSelect
                        value={query.paymentStatus}
                        onChange={(paymentStatus) => onChange({ paymentStatus })}
                        allLabel="Semua Status"
                        values={options?.paymentStatuses ?? []}
                        map={PAYMENT_STATUS}
                    />
                </Field>

                <Field label="Seleksi">
                    <StatusSelect
                        value={query.selectionStatus}
                        onChange={(selectionStatus) => onChange({ selectionStatus })}
                        allLabel="Semua Status"
                        values={options?.selectionStatuses ?? []}
                        map={SELECTION_STATUS}
                    />
                </Field>

                <Field label="Penyaluran">
                    <StatusSelect
                        value={query.placementStatus}
                        onChange={(placementStatus) => onChange({ placementStatus })}
                        allLabel="Semua Status"
                        values={options?.placementStatuses ?? []}
                        map={PLACEMENT_STATUS}
                    />
                </Field>
            </div>
        </Card>
    );
}