import { BadgeCheck, CalendarDays, Eye, FileDown, FileText, Loader2, Mail, Receipt, RefreshCw, Send, Wallet } from "lucide-react";
import { AdminTablePagination } from "@/components/admin/admin-table-pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { INVOICE_STATE, PAYMENT_METHOD_META } from "@/constants/admin/admin-payment-constant";
import { PAYMENT_STATUS } from "@/constants/admin/admin-status";
import { getInitials, formatShortDate } from "@/helpers/admin/admin-helper";
import { formatDeadline } from "@/helpers/admin/admin-payment-helper";
import { cn, formatIDR } from "@/lib/utils";
import type { PaymentItem } from "@/types/admin/admin-payment";
import type { AdminPageMeta } from "@/types/pagination";
import { StatusBadge, ToneBadge } from "@/app/admin/dashboard/features/status-badge";
import { EmptyRow } from "@/app/admin/dashboard/features/table-card";
import { PaymentProgress } from "./payment-progress";

const COLUMNS = ["Invoice", "Peserta", "Program", "Progress", "Status", "Tanggal", "Metode", "Aksi"];

function InvoiceCell({ payment }: { payment: PaymentItem }) {
    return (
        <div className="flex items-center gap-2.5">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-indigo-50 text-indigo-600 dark:bg-indigo-950">
                <FileText className="size-4" aria-hidden />
            </div>
            <div className="min-w-0 space-y-0.5">
                <div className="font-mono text-xs font-semibold whitespace-nowrap">{payment.invoiceNumber}</div>
                {payment.receiptNumber && (
                    <div className="flex items-center gap-1 text-[11px] whitespace-nowrap text-muted-foreground">
                        <Receipt className="size-3 shrink-0" aria-hidden />
                        {payment.receiptNumber}
                    </div>
                )}
                {payment.isManualInvoice && <div className="text-[10px] text-muted-foreground">Input manual</div>}
            </div>
        </div>
    );
}

function ParticipantCell({ payment }: { payment: PaymentItem }) {
    const { participant, registration } = payment;

    return (
        <div className="flex items-center gap-2.5">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-indigo-50 text-xs font-bold text-indigo-600 dark:bg-indigo-950">
                {getInitials(participant.name)}
            </div>
            <div className="min-w-0 space-y-0.5">
                <div className="truncate text-sm font-semibold">{participant.name || "-"}</div>
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Mail className="size-3 shrink-0" aria-hidden />
                    <span className="truncate">{participant.email}</span>
                </div>
                <div className="font-mono text-[10px] text-muted-foreground">{registration.registrationCode}</div>
            </div>
        </div>
    );
}

function ProgramCell({ payment }: { payment: PaymentItem }) {
    const { program, installment } = payment;
    const nextNumber = installment && installment.current < installment.total ? installment.current + 1 : null;

    return (
        <div className="space-y-0.5">
            <div className="text-sm font-semibold">{program.name || "-"}</div>
            {program.programFormat && <div className="text-[11px] text-muted-foreground">{program.programFormat}</div>}
            <div className="text-[11px] text-muted-foreground">
                {installment ? `${installment.total}x cicilan` : "Bayar penuh"} · {formatIDR(payment.amount)}
            </div>
            {nextNumber && (
                <div className="text-[11px] text-muted-foreground">Cicilan berikutnya: Ke-{nextNumber}</div>
            )}
        </div>
    );
}

function StatusCell({ payment }: { payment: PaymentItem }) {
    return (
        <div className="flex flex-col items-start gap-1">
            <StatusBadge map={PAYMENT_STATUS} value={payment.status} />
            {payment.invoiceState === "draft" && (
                <Badge variant="outline" className="text-[11px] font-semibold text-muted-foreground">
                    {INVOICE_STATE.draft.label}
                </Badge>
            )}
            {payment.actions.canVerify && <ToneBadge tone="warning">Perlu verifikasi</ToneBadge>}
        </div>
    );
}

function DateCell({ payment }: { payment: PaymentItem }) {
    const open = payment.status !== "paid" && payment.status !== "cancelled";
    const deadline = open ? formatDeadline(payment) : null;

    return (
        <div className="space-y-0.5 text-xs whitespace-nowrap">
            <div className="flex items-center gap-1.5 font-semibold">
                <CalendarDays className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
                {payment.issuedAt ? formatShortDate(payment.issuedAt) : "Belum terbit"}
            </div>
            {deadline && <div className="text-[11px] text-muted-foreground">Jatuh tempo {deadline}</div>}
        </div>
    );
}

function MethodCell({ method }: { method: PaymentItem["paymentMethod"] }) {
    const meta = PAYMENT_METHOD_META[method];
    const Icon = meta?.icon ?? Wallet;

    return (
        <span className="flex items-center gap-1.5 text-xs whitespace-nowrap text-muted-foreground">
            <Icon className="size-3.5 shrink-0" aria-hidden />
            {meta?.label ?? method}
        </span>
    );
}

type ActionsProps = {
    payment: PaymentItem;
    exporting: boolean;
    onDetail: (payment: PaymentItem) => void;
    onIssue: (payment: PaymentItem) => void;
    onVerify: (payment: PaymentItem) => void;
    onExport: (payment: PaymentItem) => void;
};

function ActionsCell({ payment, exporting, onDetail, onIssue, onVerify, onExport }: ActionsProps) {
    const { invoiceNumber, actions } = payment;
    const issued = payment.invoiceState === "issued";

    return (
        <div className="flex items-center justify-end gap-1.5">
            <Button
                variant="outline"
                size="icon-sm"
                title="Lihat detail"
                aria-label={`Lihat detail ${invoiceNumber}`}
                onClick={() => onDetail(payment)}
            >
                <Eye aria-hidden />
            </Button>

            {actions.canIssue ? (
                <Button
                    variant="outline"
                    size="icon-sm"
                    title="Terbitkan tagihan"
                    aria-label={`Terbitkan ${invoiceNumber}`}
                    className="text-sky-600 hover:text-sky-600"
                    onClick={() => onIssue(payment)}
                >
                    <Send aria-hidden />
                </Button>
            ) : actions.canVerify ? (
                <Button
                    variant="outline"
                    size="icon-sm"
                    title="Verifikasi pembayaran"
                    aria-label={`Verifikasi pembayaran ${invoiceNumber}`}
                    className="text-emerald-600 hover:text-emerald-600"
                    onClick={() => onVerify(payment)}
                >
                    <BadgeCheck aria-hidden />
                </Button>
            ) : (
                <span className="size-7" aria-hidden />
            )}

            <Button
                variant="outline"
                size="icon-sm"
                title={issued ? "Unduh invoice (PDF)" : "Terbitkan tagihan untuk mengunduh invoice"}
                aria-label={`Unduh PDF ${invoiceNumber}`}
                disabled={!issued || exporting}
                onClick={() => onExport(payment)}
            >
                {exporting ? <Loader2 className="animate-spin" aria-hidden /> : <FileDown aria-hidden />}
            </Button>
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
    rows?: PaymentItem[];
    meta?: AdminPageMeta;
    stale?: boolean;
    refreshing: boolean;
    exportingId?: number;
    onRefresh: () => void;
    onPageChange: (page: number) => void;
    onDetail: (payment: PaymentItem) => void;
    onIssue: (payment: PaymentItem) => void;
    onVerify: (payment: PaymentItem) => void;
    onExport: (payment: PaymentItem) => void;
};

export function PaymentTable({
    rows,
    meta,
    stale,
    refreshing,
    exportingId,
    onRefresh,
    onPageChange,
    onDetail,
    onIssue,
    onVerify,
    onExport,
}: Props) {
    return (
        <Card className="gap-0 p-0 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 p-5">
                <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                        <FileText className="size-4" aria-hidden />
                    </div>
                    <div>
                        <p className="text-[10px] font-semibold tracking-wider text-blue-600 uppercase">
                            Database Transaksi
                        </p>
                        <h3 className="text-lg leading-tight font-bold">Daftar Invoice</h3>
                        <p className="text-xs text-muted-foreground">
                            {meta
                                ? `Menampilkan ${meta.total} transaksi berdasarkan filter aktif.`
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
                            <EmptyRow colSpan={COLUMNS.length}>Tidak ada transaksi yang sesuai filter.</EmptyRow>
                        ) : (
                            rows.map((payment) => (
                                <TableRow key={payment.id}>
                                    <TableCell className="pl-5">
                                        <InvoiceCell payment={payment} />
                                    </TableCell>
                                    <TableCell>
                                        <ParticipantCell payment={payment} />
                                    </TableCell>
                                    <TableCell>
                                        <ProgramCell payment={payment} />
                                    </TableCell>
                                    <TableCell>
                                        <PaymentProgress payment={payment} />
                                    </TableCell>
                                    <TableCell>
                                        <StatusCell payment={payment} />
                                    </TableCell>
                                    <TableCell>
                                        <DateCell payment={payment} />
                                    </TableCell>
                                    <TableCell>
                                        <MethodCell method={payment.paymentMethod} />
                                    </TableCell>
                                    <TableCell className="pr-5">
                                        <ActionsCell
                                            payment={payment}
                                            exporting={exportingId === payment.id}
                                            onDetail={onDetail}
                                            onIssue={onIssue}
                                            onVerify={onVerify}
                                            onExport={onExport}
                                        />
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
