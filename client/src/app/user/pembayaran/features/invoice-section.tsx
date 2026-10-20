import { CircleAlert, ReceiptText } from "lucide-react";
import { AdminTablePagination } from "@/components/admin/admin-table-pagination";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshButton } from "@/app/user/dashboard/features/refresh";
import { PAYMENT_STATUS_VALUES } from "@/constants/admin/admin-payment-constant";
import { statusLabel } from "@/constants/user/dashboard-constant";
import { cn } from "@/lib/utils";
import type { AdminPageMeta } from "@/types/pagination";
import type { MyPaymentItem, MyPaymentParams } from "@/types/user/user-payment";
import { InvoiceCard } from "./invoice-card";
import { InvoiceEmpty, InvoiceFilteredEmpty } from "./invoice-empty";

type Status = MyPaymentParams["status"];

type Props = {
    rows?: MyPaymentItem[];
    meta?: AdminPageMeta;
    error: Error | null;
    status: Status;
    stale: boolean;
    refreshing: boolean;
    downloadingId?: number;
    onStatusChange: (status: Status) => void;
    onRefresh: () => void;
    onPageChange: (page: number) => void;
    onDetail: (payment: MyPaymentItem) => void;
    onUpload: (payment: MyPaymentItem) => void;
    onDownload: (payment: MyPaymentItem) => void;
};

function LoadingList() {
    return (
        <div aria-busy="true" aria-label="Memuat invoice" className="space-y-4 p-6">
            {Array.from({ length: 2 }, (_, i) => (
                <Skeleton key={i} className="h-52 rounded-2xl" />
            ))}
        </div>
    );
}

export function InvoiceSection({
    rows,
    meta,
    error,
    status,
    stale,
    refreshing,
    downloadingId,
    onStatusChange,
    onRefresh,
    onPageChange,
    onDetail,
    onUpload,
    onDownload,
}: Props) {
    const showFilter = status !== "all" || (meta?.total ?? 0) > 0;

    return (
        <Card className="gap-0 overflow-hidden rounded-3xl py-0 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b p-6">
                <div className="flex items-center gap-3">
                    <span className="grid size-11 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
                        <ReceiptText className="size-5" aria-hidden />
                    </span>
                    <div>
                        <h2 className="text-xl font-bold text-primary">Invoice Pembayaran</h2>
                        <p className="text-sm text-muted-foreground">
                            Lihat tagihan, progress, jatuh tempo, dan status pembayaran Anda.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {showFilter && (
                        <select
                            aria-label="Filter status pembayaran"
                            value={status}
                            onChange={(event) => onStatusChange(event.target.value as Status)}
                            className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                        >
                            <option value="all">Semua status</option>
                            {PAYMENT_STATUS_VALUES.map((value) => (
                                <option key={value} value={value}>
                                    {statusLabel(value, "payment")}
                                </option>
                            ))}
                        </select>
                    )}
                    <RefreshButton onRefresh={onRefresh} loading={refreshing} />
                </div>
            </div>

            {error ? (
                <div className="p-6">
                    <Alert variant="destructive">
                        <CircleAlert aria-hidden />
                        <AlertTitle>Data pembayaran gagal dimuat</AlertTitle>
                        <AlertDescription>{error.message}</AlertDescription>
                    </Alert>
                </div>
            ) : !rows ? (
                <LoadingList />
            ) : rows.length === 0 ? (
                status === "all" ? <InvoiceEmpty /> : <InvoiceFilteredEmpty onReset={() => onStatusChange("all")} />
            ) : (
                <ul className={cn("space-y-4 p-6 transition-opacity", stale && "opacity-60")}>
                    {rows.map((payment) => (
                        <InvoiceCard
                            key={payment.id}
                            payment={payment}
                            downloading={downloadingId === payment.id}
                            onDetail={onDetail}
                            onUpload={onUpload}
                            onDownload={onDownload}
                        />
                    ))}
                </ul>
            )}

            {meta && meta.total > 0 && (
                <div className="border-t bg-muted/30 px-6 py-3">
                    <AdminTablePagination meta={meta} itemLabel="invoice" disabled={stale} onPageChange={onPageChange} />
                </div>
            )}
        </Card>
    );
}
