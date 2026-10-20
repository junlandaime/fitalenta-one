"use client";

import { useState } from "react";
import { CircleAlert, CircleCheck, X } from "lucide-react";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useDownloadMyInvoice, useMyPayments, useMyPaymentSummary } from "@/hooks/user/use-user-payments";
import { saveFile } from "@/lib/file-download";
import type { MyPaymentDetail, MyPaymentItem, MyPaymentParams } from "@/types/user/user-payment";
import { PaymentDetailSheet } from "./detail-sheet";
import { InvoiceSection } from "./invoice-section";
import { PaymentSummaryCards } from "./summary-cards";
import { UploadProofSheet } from "./upload-proof-sheet";

type Panel = { type: "detail"; id: number } | { type: "upload"; id: number };

type Notice = { tone: "success" | "error"; message: string };

export function PaymentView() {
    const [page, setPage] = useState(1);
    const [status, setStatus] = useState<MyPaymentParams["status"]>("all");
    const [panel, setPanel] = useState<Panel | null>(null);
    const [notice, setNotice] = useState<Notice | null>(null);

    const list = useMyPayments({ page, status });
    const summary = useMyPaymentSummary();
    const downloadInvoice = useDownloadMyInvoice();

    const refreshing = list.isFetching || summary.isFetching;
    const downloadingId = downloadInvoice.isPending ? downloadInvoice.variables?.id : undefined;

    function handleStatusChange(next: MyPaymentParams["status"]) {
        setStatus(next);
        setPage(1);
    }

    function refresh() {
        list.refetch();
        summary.refetch();
    }

    function handleDownload(payment: Pick<MyPaymentItem, "id" | "invoiceNumber">) {
        setNotice(null);
        downloadInvoice.mutate(
            { id: payment.id, invoiceNumber: payment.invoiceNumber },
            {
                onSuccess: saveFile,
                onError: (error) => setNotice({ tone: "error", message: error.message }),
            },
        );
    }

    function handleUploaded(payment: MyPaymentDetail) {
        setPanel(null);
        setNotice({
            tone: "success",
            message: `Bukti pembayaran ${payment.invoiceNumber} berhasil dikirim. Admin akan memverifikasi dalam 1-2 hari kerja.`,
        });
    }

    return (
        <div className="space-y-6">
            {summary.data && summary.data.totalInvoices > 0 && <PaymentSummaryCards summary={summary.data} />}

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

            <InvoiceSection
                rows={list.data?.items}
                meta={list.data?.meta}
                error={list.isError ? list.error : null}
                status={status}
                stale={list.isPlaceholderData}
                refreshing={refreshing}
                downloadingId={downloadingId}
                onStatusChange={handleStatusChange}
                onRefresh={refresh}
                onPageChange={setPage}
                onDetail={(payment) => setPanel({ type: "detail", id: payment.id })}
                onUpload={(payment) => setPanel({ type: "upload", id: payment.id })}
                onDownload={handleDownload}
            />

            {panel?.type === "detail" && (
                <PaymentDetailSheet
                    key={panel.id}
                    id={panel.id}
                    downloading={downloadingId === panel.id}
                    onClose={() => setPanel(null)}
                    onUpload={(payment) => setPanel({ type: "upload", id: payment.id })}
                    onDownload={handleDownload}
                />
            )}

            {panel?.type === "upload" && (
                <UploadProofSheet
                    key={panel.id}
                    id={panel.id}
                    onClose={() => setPanel(null)}
                    onUploaded={handleUploaded}
                />
            )}
        </div>
    );
}
