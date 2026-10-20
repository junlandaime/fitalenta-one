import { CalendarDays, FileText, Mail, Receipt, RefreshCw, Wallet } from "lucide-react";
import { AdminTablePagination } from "@/components/admin/admin-table-pagination";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PAYMENT_METHOD_META } from "@/constants/admin/admin-payment-constant";
import { PAYMENT_STATUS } from "@/constants/admin/admin-status";
import { formatShortDate, getInitials } from "@/helpers/admin/admin-helper";
import { paymentPercent } from "@/helpers/admin/admin-payment-helper";
import { cn, formatIDR } from "@/lib/utils";
import type { ReportRow } from "@/types/admin/financial-report";
import type { AdminPageMeta } from "@/types/pagination";
import { StatusBadge } from "@/app/admin/dashboard/features/status-badge";
import { EmptyRow } from "@/app/admin/dashboard/features/table-card";
import { ProgressBar } from "@/app/admin/pembayaran/features/payment-progress";

const COLUMNS = ["Invoice", "Peserta", "Program & Termin", "Tagihan", "Dibayar", "Status", "Metode", "Tanggal"];
const NUMERIC = new Set(["Tagihan"]);

function InvoiceCell({ row }: { row: ReportRow }) {
    return (
        <div className="space-y-0.5">
            <div className="font-mono text-xs font-semibold whitespace-nowrap">{row.invoiceNumber}</div>
            {row.receiptNumber && (
                <div className="flex items-center gap-1 text-[11px] whitespace-nowrap text-muted-foreground">
                    <Receipt className="size-3 shrink-0" aria-hidden />
                    {row.receiptNumber}
                </div>
            )}
        </div>
    );
}

function ParticipantCell({ row }: { row: ReportRow }) {
    return (
        <div className="flex items-center gap-2.5">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-indigo-50 text-xs font-bold text-indigo-600 dark:bg-indigo-950">
                {getInitials(row.participantName)}
            </div>
            <div className="min-w-0 space-y-0.5">
                <div className="truncate text-sm font-semibold">{row.participantName || "-"}</div>
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Mail className="size-3 shrink-0" aria-hidden />
                    <span className="truncate">{row.email || "-"}</span>
                </div>
            </div>
        </div>
    );
}

function PaidCell({ row }: { row: ReportRow }) {
    const cancelled = row.status === "cancelled";
    const remaining = Number(row.amount) - Number(row.amountPaid);

    return (
        <div className="min-w-32 space-y-1.5">
            <div className="flex items-baseline justify-between gap-3 text-[11px]">
                <span className="text-muted-foreground tabular-nums">{paymentPercent(row)}%</span>
                <span className="font-semibold text-emerald-600 tabular-nums dark:text-emerald-400">
                    {formatIDR(row.amountPaid)}
                </span>
            </div>
            <ProgressBar payment={row} />
            <p className="text-[11px] text-muted-foreground tabular-nums">
                {cancelled ? "Tidak ditagih" : `Sisa ${formatIDR(remaining)}`}
            </p>
        </div>
    );
}

function MethodCell({ method }: { method: ReportRow["paymentMethod"] }) {
    const meta = PAYMENT_METHOD_META[method];
    const Icon = meta?.icon ?? Wallet;

    return (
        <span className="flex items-center gap-1.5 text-xs whitespace-nowrap text-muted-foreground">
            <Icon className="size-3.5 shrink-0" aria-hidden />
            {meta?.label ?? method}
        </span>
    );
}

function DateCell({ row }: { row: ReportRow }) {
    return (
        <div className="space-y-0.5 text-xs whitespace-nowrap">
            <div className="flex items-center gap-1.5 font-semibold">
                <CalendarDays className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
                {formatShortDate(row.createdAt)}
            </div>
            {row.paymentDate && (
                <div className="text-[11px] text-muted-foreground">Dibayar {formatShortDate(row.paymentDate)}</div>
            )}
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
    rows?: ReportRow[];
    meta?: AdminPageMeta;
    stale?: boolean;
    refreshing: boolean;
    onRefresh: () => void;
    onPageChange: (page: number) => void;
};

export function ReportTable({ rows, meta, stale, refreshing, onRefresh, onPageChange }: Props) {
    return (
        <Card className="gap-0 p-0 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 p-5">
                <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                        <FileText className="size-4" aria-hidden />
                    </div>
                    <div>
                        <p className="text-[10px] font-semibold tracking-wider text-blue-600 uppercase">
                            Database Keuangan
                        </p>
                        <h3 className="text-lg leading-tight font-bold">Detail Transaksi</h3>
                        <p className="text-xs text-muted-foreground">
                            {meta
                                ? `Menampilkan ${meta.total} transaksi berdasarkan filter yang diterapkan. Hanya tagihan yang sudah diterbitkan.`
                                : "Memuat data transaksi..."}
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
                                        index === COLUMNS.length - 1 && "pr-5",
                                        NUMERIC.has(column) && "text-right",
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
                            <EmptyRow colSpan={COLUMNS.length}>Tidak ada transaksi yang sesuai filter.</EmptyRow>
                        ) : (
                            rows.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell className="pl-5">
                                        <InvoiceCell row={row} />
                                    </TableCell>
                                    <TableCell>
                                        <ParticipantCell row={row} />
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-0.5">
                                            <div className="text-sm font-semibold">{row.program || "-"}</div>
                                            <div className="text-[11px] text-muted-foreground">{row.termin.label}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right text-sm font-semibold whitespace-nowrap tabular-nums">
                                        {formatIDR(row.amount)}
                                    </TableCell>
                                    <TableCell>
                                        <PaidCell row={row} />
                                    </TableCell>
                                    <TableCell>
                                        <StatusBadge map={PAYMENT_STATUS} value={row.status} />
                                    </TableCell>
                                    <TableCell>
                                        <MethodCell method={row.paymentMethod} />
                                    </TableCell>
                                    <TableCell className="pr-5">
                                        <DateCell row={row} />
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
                        itemLabel="transaksi"
                        disabled={stale}
                        onPageChange={onPageChange}
                    />
                </div>
            )}
        </Card>
    );
}
