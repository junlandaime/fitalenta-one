import { Filter, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PLACEMENT_STATUS, SELECTION_STATUS, statusLabel, type StatusMap } from "@/constants/admin/admin-status";
import { PLACEMENT_STATUS_VALUES, SELECTION_STATUS_VALUES } from "@/constants/admin/selection-placement-constant";
import type {
    ParticipantParams,
    PlacementStatus,
    SelectionPlacementOptions,
    SelectionStatus,
} from "@/types/admin/selection-placement";

const controlClass =
    "h-10 w-full rounded-md border bg-background px-3 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:opacity-60";

type Filters = Pick<ParticipantParams, "selectionStatus" | "placementStatus">;

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
    value: T | "all";
    onChange: (value: T | "all") => void;
    allLabel: string;
    values: readonly T[];
    map: StatusMap;
}) {
    return (
        <select className={controlClass} value={value} onChange={(e) => onChange(e.target.value as T | "all")}>
            <option value="all">{allLabel}</option>
            {values.map((item) => (
                <option key={item} value={item}>
                    {statusLabel(map, item)}
                </option>
            ))}
        </select>
    );
}

type Props = {
    search: string;
    filters: Filters;
    options?: SelectionPlacementOptions;
    onSearchChange: (value: string) => void;
    onFilterChange: <K extends keyof Filters>(name: K, value: Filters[K]) => void;
};

export function SelectionFilters({ search, filters, options, onSearchChange, onFilterChange }: Props) {
    return (
        <Card className="gap-0 p-0 shadow-xs">
            <div className="flex items-center gap-3 border-b p-5">
                <div className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <Filter className="size-4" aria-hidden />
                </div>
                <div>
                    <p className="text-[10px] font-semibold tracking-wider text-blue-600 uppercase">Filter Data</p>
                    <h3 className="text-lg leading-tight font-bold">Filter &amp; Pencarian</h3>
                    <p className="text-xs text-muted-foreground">
                        Temukan peserta berdasarkan status seleksi, penyaluran, atau nama.
                    </p>
                </div>
            </div>

            <div className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">
                <Field label="Pencarian" className="md:col-span-2 xl:col-span-1">
                    <div className="relative">
                        <Search
                            className="absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground"
                            aria-hidden
                        />
                        <input
                            type="search"
                            className={`${controlClass} pl-9`}
                            placeholder="Cari nama, email, atau kode pendaftaran..."
                            value={search}
                            onChange={(e) => onSearchChange(e.target.value)}
                        />
                    </div>
                </Field>

                <Field label="Status Seleksi Diklat">
                    <StatusSelect<SelectionStatus>
                        value={filters.selectionStatus}
                        onChange={(value) => onFilterChange("selectionStatus", value)}
                        allLabel="Semua Status Seleksi"
                        values={options?.selectionStatuses ?? SELECTION_STATUS_VALUES}
                        map={SELECTION_STATUS}
                    />
                </Field>

                <Field label="Status Penyaluran">
                    <StatusSelect<PlacementStatus>
                        value={filters.placementStatus}
                        onChange={(value) => onFilterChange("placementStatus", value)}
                        allLabel="Semua Status Penyaluran"
                        values={options?.placementStatuses ?? PLACEMENT_STATUS_VALUES}
                        map={PLACEMENT_STATUS}
                    />
                </Field>
            </div>
        </Card>
    );
}
