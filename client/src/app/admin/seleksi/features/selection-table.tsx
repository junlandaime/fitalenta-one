import Link from "next/link";
import { Building2, CalendarDays, Clock, Mail, Pencil, RefreshCw, UserRoundCheck } from "lucide-react";
import { AdminTablePagination } from "@/components/admin/admin-table-pagination";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PLACEMENT_STATUS, SELECTION_STATUS } from "@/constants/admin/admin-status";
import { cn } from "@/lib/utils";
import type { AdminPageMeta } from "@/types/pagination";
import type { Participant } from "@/types/admin/selection-placement";
import { StatusBadge, ToneBadge } from "@/app/admin/dashboard/features/status-badge";
import { EmptyRow } from "@/app/admin/dashboard/features/table-card";
import { ParticipantAvatar } from "@/components/admin/participant-avatar";

const COLUMNS = ["Peserta", "Program", "Seleksi Diklat", "Penyaluran Kerja", "Perusahaan", "Penempatan", "Aksi"];

const manageHref = (id: number) => `/admin/seleksi/${id}?mode=edit`;

const dateFmt = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Jakarta",
});

function formatPlacementDate(value: string | null) {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : dateFmt.format(date);
}

function Note({ children }: { children?: string | null }) {
    if (!children) return null;
    return (
        <p title={children} className="mt-1 line-clamp-1 max-w-52 text-[11px] text-muted-foreground">
            {children}
        </p>
    );
}

function ParticipantCell({ row }: { row: Participant }) {
    const { participant } = row;

    return (
        <div className="flex items-center gap-3">
            <ParticipantAvatar
                key={`${participant.name}-${participant.photoPath ?? ""}`}
                name={participant.name}
                photoPath={participant.photoPath}
            />
            <div className="min-w-0 space-y-0.5">
                <div className="truncate text-sm font-semibold">{participant.name}</div>
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Mail className="size-3 shrink-0" aria-hidden />
                    <span className="truncate">{participant.email}</span>
                </div>
                <div className="font-mono text-[10px] text-muted-foreground">{row.registrationCode}</div>
            </div>
        </div>
    );
}

function PlacementCell({ placement }: { placement: Participant["placement"] }) {
    return (
        <div>
            {placement.determined ? (
                <StatusBadge map={PLACEMENT_STATUS} value={placement.status} />
            ) : (
                <ToneBadge tone="muted">Belum Ditentukan</ToneBadge>
            )}
            <Note>{placement.notes}</Note>
        </div>
    );
}

function CompanyCell({ companyName }: { companyName: string | null }) {
    if (!companyName) return <span className="text-xs text-muted-foreground">Belum ditentukan</span>;

    return (
        <div className="flex items-center gap-1.5 text-xs font-semibold">
            <Building2 className="size-3.5 shrink-0 text-indigo-600" aria-hidden />
            {companyName}
        </div>
    );
}

function DateCell({ value }: { value: string | null }) {
    const formatted = formatPlacementDate(value);
    if (!formatted) return <span className="text-muted-foreground">-</span>;

    return (
        <div className="flex items-center gap-1.5 text-xs whitespace-nowrap">
            <CalendarDays className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
            {formatted}
        </div>
    );
}

function LoadingRows() {
    return Array.from({ length: 6 }, (_, row) => (
        <TableRow key={row}>
            {COLUMNS.map((column, index) => (
                <TableCell key={column} className={cn(index === 0 && "pl-5", index === COLUMNS.length - 1 && "pr-5")}>
                    <Skeleton className="h-5 w-full max-w-28" />
                </TableCell>
            ))}
        </TableRow>
    ));
}

type Props = {
    rows?: Participant[];
    meta?: AdminPageMeta;
    stale?: boolean;
    refreshing: boolean;
    onRefresh: () => void;
    onPageChange: (page: number) => void;
};

export function SelectionTable({ rows, meta, stale, refreshing, onRefresh, onPageChange }: Props) {
    return (
        <Card className="gap-0 p-0 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 p-5">
                <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                        <UserRoundCheck className="size-4" aria-hidden />
                    </div>
                    <div>
                        <p className="text-[10px] font-semibold tracking-wider text-blue-600 uppercase">
                            Database Peserta
                        </p>
                        <h3 className="text-lg leading-tight font-bold">Daftar Peserta</h3>
                        <p className="text-xs text-muted-foreground">
                            {meta
                                ? `Menampilkan ${meta.total} peserta berdasarkan filter aktif.`
                                : "Memuat data peserta..."}
                        </p>
                    </div>
                </div>
                <Button variant="outline" size="sm" onClick={onRefresh} disabled={refreshing}>
                    <RefreshCw className={refreshing ? "animate-spin" : undefined} data-icon="inline-start" aria-hidden />
                    Refresh
                </Button>
            </div>

            <div className="overflow-x-auto border-t">
                <Table className={cn("transition-opacity", stale && "opacity-60")}>
                    <TableHeader>
                        <TableRow className="bg-muted/30 text-[10px] tracking-wider uppercase">
                            {COLUMNS.map((column, index) => (
                                <TableHead
                                    key={column}
                                    className={cn(
                                        index === 0 && "pl-5",
                                        index === COLUMNS.length - 1 && "pr-5 text-right",
                                    )}
                                >
                                    {column}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!rows ? (
                            <LoadingRows />
                        ) : rows.length === 0 ? (
                            <EmptyRow colSpan={COLUMNS.length}>Tidak ada peserta yang sesuai filter.</EmptyRow>
                        ) : (
                            rows.map((row) => (
                                <TableRow key={row.registrationId}>
                                    <TableCell className="pl-5">
                                        <ParticipantCell row={row} />
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm font-semibold">{row.program.name || "-"}</div>
                                        {row.program.duration && (
                                            <div className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                                                <Clock className="size-3 shrink-0" aria-hidden />
                                                {row.program.duration}
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <StatusBadge map={SELECTION_STATUS} value={row.selection.status} />
                                        <Note>{row.selection.notes}</Note>
                                    </TableCell>
                                    <TableCell>
                                        <PlacementCell placement={row.placement} />
                                    </TableCell>
                                    <TableCell>
                                        <CompanyCell companyName={row.placement.companyName} />
                                    </TableCell>
                                    <TableCell>
                                        <DateCell value={row.placement.placementDate} />
                                    </TableCell>
                                    <TableCell className="pr-5">
                                        <div className="flex justify-end">
                                            <Button asChild variant="outline" size="sm">
                                                <Link
                                                    href={manageHref(row.registrationId)}
                                                    aria-label={`Kelola ${row.participant.name}`}
                                                >
                                                    <Pencil data-icon="inline-start" aria-hidden />
                                                    Kelola
                                                </Link>
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {meta && (
                <div className="border-t bg-muted/30 px-5 py-3">
                    <AdminTablePagination
                        meta={meta}
                        itemLabel="peserta"
                        disabled={stale}
                        onPageChange={onPageChange}
                    />
                </div>
            )}
        </Card>
    );
}
