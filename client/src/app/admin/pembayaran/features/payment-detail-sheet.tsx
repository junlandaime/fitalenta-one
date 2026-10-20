"use client";

import { BadgeCheck, CircleAlert, FileDown, Loader2, Send } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { INVOICE_STATE, PAYMENT_METHOD_META } from "@/constants/admin/admin-payment-constant";
import { PAYMENT_STATUS } from "@/constants/admin/admin-status";
import { formatShortDate, formatShortTime } from "@/helpers/admin/admin-helper";
import { formatDeadline } from "@/helpers/admin/admin-payment-helper";
import { useAdminPayment } from "@/hooks/admin/use-admin-payments";
import type { PaymentDetail, PaymentItem } from "@/types/admin/admin-payment";
import { StatusBadge } from "@/app/admin/dashboard/features/status-badge";
import {
    AmountSummary,
    HistoryTimeline,
    InfoItem,
    InstallmentSteps,
    SectionTitle,
} from "./payment-detail-parts";
import { ProofImage } from "./proof-image";

const dateTime = (iso: string | null) => (iso ? `${formatShortDate(iso)}, ${formatShortTime(iso)}` : null);

function DetailSkeleton() {
    return (
        <div aria-busy="true" aria-label="Memuat detail pembayaran" className="space-y-5 p-4">
            <Skeleton className="h-20 rounded-lg" />
            <Skeleton className="h-40 rounded-lg" />
            <Skeleton className="h-48 rounded-lg" />
        </div>
    );
}

function DetailBody({ payment }: { payment: PaymentDetail }) {
    const { participant, program, registration } = payment;
    const method = PAYMENT_METHOD_META[payment.paymentMethod];
    const settledOrClosed = payment.status === "paid" || payment.status === "cancelled";

    return (
        <div className="space-y-6 p-4">
            <section className="space-y-3">
                <SectionTitle>Pembayaran</SectionTitle>
                <AmountSummary payment={payment} />
            </section>

            {payment.installment && (
                <section className="space-y-3">
                    <SectionTitle>Cicilan</SectionTitle>
                    <InstallmentSteps payment={payment} />
                </section>
            )}

            <section className="space-y-3">
                <SectionTitle>Peserta &amp; program</SectionTitle>
                <dl className="grid gap-x-4 gap-y-3 sm:grid-cols-2">
                    <InfoItem label="Nama">{participant.name}</InfoItem>
                    <InfoItem label="Kode pendaftaran">
                        <span className="font-mono text-xs">{registration.registrationCode}</span>
                    </InfoItem>
                    <InfoItem label="Email">{participant.email}</InfoItem>
                    <InfoItem label="Telepon">{participant.phone}</InfoItem>
                    <InfoItem label="Program">{program.name}</InfoItem>
                    <InfoItem label="Format">{program.programFormat}</InfoItem>
                </dl>
            </section>

            <section className="space-y-3">
                <SectionTitle>Informasi invoice</SectionTitle>
                <dl className="grid gap-x-4 gap-y-3 sm:grid-cols-2">
                    <InfoItem label="Diterbitkan">{dateTime(payment.issuedAt) ?? "Belum diterbitkan"}</InfoItem>
                    <InfoItem label="Jatuh tempo">
                        {settledOrClosed ? "-" : formatDeadline(payment)}
                    </InfoItem>
                    <InfoItem label="Metode">{method?.label ?? payment.paymentMethod}</InfoItem>
                    <InfoItem label="Dibayar pada">{dateTime(payment.paymentDate)}</InfoItem>
                    <InfoItem label="Diverifikasi">
                        {dateTime(payment.verifiedAt)}
                        {payment.verifiedBy && (
                            <span className="block text-xs font-normal text-muted-foreground">
                                oleh {payment.verifiedBy.name}
                            </span>
                        )}
                    </InfoItem>
                    <InfoItem label="No. kwitansi">{payment.receiptNumber}</InfoItem>
                </dl>
                {payment.notes && (
                    <p className="rounded-lg border bg-muted/30 p-3 text-sm whitespace-pre-line">{payment.notes}</p>
                )}
            </section>

            {payment.proofImage && (
                <section className="space-y-3">
                    <SectionTitle>Bukti pembayaran</SectionTitle>
                    <ProofImage src={payment.proofImage} alt={`Bukti pembayaran ${payment.invoiceNumber}`} />
                </section>
            )}

            <section className="space-y-3">
                <SectionTitle>Riwayat</SectionTitle>
                <HistoryTimeline history={payment.history} />
            </section>
        </div>
    );
}

type Props = {
    id: number;
    exporting: boolean;
    onClose: () => void;
    onIssue: (payment: PaymentItem) => void;
    onVerify: (payment: PaymentItem) => void;
    onExport: (payment: PaymentItem) => void;
};

export function PaymentDetailSheet({ id, exporting, onClose, onIssue, onVerify, onExport }: Props) {
    const query = useAdminPayment(id);
    const payment = query.data;

    return (
        <Sheet open onOpenChange={(open) => !open && onClose()}>
            <SheetContent className="gap-0 sm:max-w-xl!">
                <SheetHeader className="border-b pr-12">
                    <SheetTitle className="flex flex-wrap items-center gap-2">
                        <span className="font-mono">{payment?.invoiceNumber ?? "Detail pembayaran"}</span>
                        {payment && <StatusBadge map={PAYMENT_STATUS} value={payment.status} />}
                        {payment?.invoiceState === "draft" && (
                            <Badge variant="outline" className="text-[11px] font-semibold text-muted-foreground">
                                {INVOICE_STATE.draft.label}
                            </Badge>
                        )}
                    </SheetTitle>
                    <SheetDescription>
                        {payment
                            ? `${payment.participant.name || "Peserta"} · ${payment.program.name || "Program"}`
                            : "Rincian tagihan, cicilan, dan riwayat pembayaran."}
                    </SheetDescription>
                </SheetHeader>

                <div className="min-h-0 flex-1 overflow-y-auto">
                    {query.isError ? (
                        <div className="p-4">
                            <Alert variant="destructive">
                                <CircleAlert aria-hidden />
                                <AlertTitle>Detail pembayaran gagal dimuat</AlertTitle>
                                <AlertDescription>{query.error.message}</AlertDescription>
                            </Alert>
                        </div>
                    ) : payment ? (
                        <DetailBody payment={payment} />
                    ) : (
                        <DetailSkeleton />
                    )}
                </div>

                {payment && (
                    <SheetFooter className="border-t sm:flex-row sm:justify-end">
                        <Button
                            variant="outline"
                            disabled={payment.invoiceState !== "issued" || exporting}
                            title={payment.invoiceState === "issued" ? undefined : "Terbitkan tagihan untuk mengunduh invoice"}
                            onClick={() => onExport(payment)}
                        >
                            {exporting ? (
                                <Loader2 className="animate-spin" data-icon="inline-start" aria-hidden />
                            ) : (
                                <FileDown data-icon="inline-start" aria-hidden />
                            )}
                            Unduh PDF
                        </Button>
                        {payment.actions.canIssue && (
                            <Button onClick={() => onIssue(payment)}>
                                <Send data-icon="inline-start" aria-hidden />
                                Terbitkan tagihan
                            </Button>
                        )}
                        {payment.actions.canVerify && (
                            <Button onClick={() => onVerify(payment)}>
                                <BadgeCheck data-icon="inline-start" aria-hidden />
                                Verifikasi pembayaran
                            </Button>
                        )}
                    </SheetFooter>
                )}
            </SheetContent>
        </Sheet>
    );
}
