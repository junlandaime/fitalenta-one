"use client";

import { useState } from "react";
import { CircleAlert, CircleCheck, Plus, Wallet, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
    useAdminPaymentOptions,
    useAdminPayments,
    useAdminPaymentSummary,
    useExportInvoice,
} from "@/hooks/admin/use-admin-payments";
import { useDebounced } from "@/hooks/use-debounced";
import { saveBlob } from "@/helpers/admin/admin-payment-helper";
import type { PaymentDetail, PaymentItem, PaymentParams } from "@/types/admin/admin-payment";
import { InvoiceFormSheet } from "./invoice-form-sheet";
import { IssueInvoiceDialog } from "./issue-invoice-dialog";
import { PaymentDetailSheet } from "./payment-detail-sheet";
import { PaymentFilters } from "./payment-filters";
import { PaymentStatCards } from "./payment-stat-cards";
import { PaymentTable } from "./payment-table";
import { VerifyPaymentSheet } from "./verify-payment-sheet";

type Filters = Pick<PaymentParams, "status" | "invoiceState">;

const INITIAL_FILTERS: Filters = { status: "all", invoiceState: "all" };

type Panel =
    | { type: "create" }
    | { type: "detail"; id: number }
    | { type: "issue"; payment: PaymentItem }
    | { type: "verify"; payment: PaymentItem };

type Notice = { tone: "success" | "error"; message: string };

export function PaymentManagementView() {
    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState("");
    const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS);
    const search = useDebounced(searchInput.trim());

    const [panel, setPanel] = useState<Panel | null>(null);
    const [notice, setNotice] = useState<Notice | null>(null);

    const list = useAdminPayments({ page, search, ...filters });
    const summary = useAdminPaymentSummary();
    const options = useAdminPaymentOptions();
    const exportInvoice = useExportInvoice();

    const refreshing = list.isFetching || summary.isFetching;
    const exportingId = exportInvoice.isPending ? exportInvoice.variables?.id : undefined;

    function handleSearchChange(value: string) {
        setSearchInput(value);
        setPage(1);
    }

    function handleFilterChange<K extends keyof Filters>(name: K, value: Filters[K]) {
        setFilters((current) => ({ ...current, [name]: value }));
        setPage(1);
    }

    function refresh() {
        list.refetch();
        summary.refetch();
    }

    function finish(message: string) {
        setPanel(null);
        setNotice({ tone: "success", message });
    }

    function handleCreated(payment: PaymentDetail) {
        setPage(1);
        setSearchInput("");
        setFilters(INITIAL_FILTERS);
        finish(`Tagihan ${payment.invoiceNumber} berhasil dibuat sebagai draft. Terbitkan agar diterima peserta.`);
    }

    function handleExport(payment: PaymentItem) {
        setNotice(null);
        exportInvoice.mutate(
            { id: payment.id, invoiceNumber: payment.invoiceNumber },
            {
                onSuccess: ({ blob, filename }) => saveBlob(blob, filename),
                onError: (error) => setNotice({ tone: "error", message: error.message }),
            },
        );
    }

    return (
        <div className="mx-auto w-full max-w-7xl space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div className="space-y-1">
                    <p className="flex items-center gap-1.5 text-[10px] font-semibold tracking-wider text-orange-600 uppercase">
                        <Wallet className="size-3" aria-hidden />
                        Manajemen Keuangan
                    </p>
                    <h2 className="text-3xl font-bold tracking-tight">Manajemen Pembayaran</h2>
                    <p className="max-w-2xl text-sm text-muted-foreground">
                        Kelola pembayaran, verifikasi transaksi, dan pantau progress pelunasan peserta.
                    </p>
                </div>
                <Button onClick={() => setPanel({ type: "create" })}>
                    <Plus data-icon="inline-start" aria-hidden />
                    Buat tagihan
                </Button>
            </div>

            {summary.isError ? (
                <Alert variant="destructive">
                    <CircleAlert aria-hidden />
                    <AlertTitle>Statistik gagal dimuat</AlertTitle>
                    <AlertDescription>{summary.error.message}</AlertDescription>
                </Alert>
            ) : (
                <PaymentStatCards summary={summary.data} />
            )}

            {notice && (
                <Alert variant={notice.tone === "error" ? "destructive" : "default"}>
                    {notice.tone === "error" ? <CircleAlert aria-hidden /> : <CircleCheck aria-hidden />}
                    <AlertTitle className="pr-8">{notice.message}</AlertTitle>
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        className="absolute top-2 right-2"
                        aria-label="Tutup pemberitahuan"
                        onClick={() => setNotice(null)}
                    >
                        <X aria-hidden />
                    </Button>
                </Alert>
            )}

            <PaymentFilters
                search={searchInput}
                filters={filters}
                options={options.data}
                onSearchChange={handleSearchChange}
                onFilterChange={handleFilterChange}
            />

            {list.isError ? (
                <Alert variant="destructive">
                    <CircleAlert aria-hidden />
                    <AlertTitle>Data pembayaran gagal dimuat</AlertTitle>
                    <AlertDescription>{list.error.message}</AlertDescription>
                </Alert>
            ) : (
                <PaymentTable
                    rows={list.data?.items}
                    meta={list.data?.meta}
                    stale={list.isPlaceholderData}
                    refreshing={refreshing}
                    exportingId={exportingId}
                    onRefresh={refresh}
                    onPageChange={setPage}
                    onDetail={(payment) => setPanel({ type: "detail", id: payment.id })}
                    onIssue={(payment) => setPanel({ type: "issue", payment })}
                    onVerify={(payment) => setPanel({ type: "verify", payment })}
                    onExport={handleExport}
                />
            )}

            {panel?.type === "create" && <InvoiceFormSheet onClose={() => setPanel(null)} onSaved={handleCreated} />}

            {panel?.type === "detail" && (
                <PaymentDetailSheet
                    key={panel.id}
                    id={panel.id}
                    exporting={exportingId === panel.id}
                    onClose={() => setPanel(null)}
                    onIssue={(payment) => setPanel({ type: "issue", payment })}
                    onVerify={(payment) => setPanel({ type: "verify", payment })}
                    onExport={handleExport}
                />
            )}

            {panel?.type === "issue" && (
                <IssueInvoiceDialog
                    key={panel.payment.id}
                    payment={panel.payment}
                    onClose={() => setPanel(null)}
                    onIssued={(payment) => finish(`Tagihan ${payment.invoiceNumber} berhasil diterbitkan.`)}
                />
            )}

            {panel?.type === "verify" && (
                <VerifyPaymentSheet
                    key={panel.payment.id}
                    payment={panel.payment}
                    onClose={() => setPanel(null)}
                    onVerified={(payment) =>
                        finish(
                            payment.status === "paid"
                                ? `Pembayaran ${payment.invoiceNumber} diverifikasi dan tagihan lunas.`
                                : `Pembayaran ${payment.invoiceNumber} berhasil diverifikasi.`,
                        )
                    }
                />
            )}
        </div>
    );
}
