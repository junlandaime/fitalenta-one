"use client";

import { CircleAlert, FileDown, Loader2, Upload } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { ProofImage } from "@/app/admin/pembayaran/features/proof-image";
import { PAYMENT_METHOD_LABEL } from "@/constants/user/dashboard-constant";
import { formatShortDate, formatShortTime } from "@/helpers/admin/admin-helper";
import { formatDeadline, getDueLabel, isOpenPayment } from "@/helpers/user/user-payment-helper";
import { useMyPayment } from "@/hooks/user/use-user-payments";
import { formatIDR } from "@/lib/utils";
import type { MyPaymentDetail } from "@/types/user/user-payment";
import { AccountCard } from "./account-card";
import { AmountSummary, HistoryTimeline, InfoItem, InstallmentSteps, SectionTitle } from "./detail-parts";
import { PaymentStateBadges } from "./payment-state-badges";

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

function DetailBody({ payment }: { payment: MyPaymentDetail }) {
    const open = isOpenPayment(payment);
    const deadline = open ? formatDeadline(payment) : null;
    const method = PAYMENT_METHOD_LABEL[payment.paymentMethod] ?? payment.paymentMethod;

    return (
        <div className="space-y-6 p-4">
            {open && (
                <section className="space-y-1 rounded-xl bg-primary p-4 text-primary-foreground">
                    <p className="text-xs text-primary-foreground/70">Tagihan saat ini · {getDueLabel(payment)}</p>
                    <p className="text-2xl font-extrabold tracking-tight tabular-nums">{formatIDR(payment.amountDue)}</p>
                    {deadline && (
                        <p className="text-xs text-primary-foreground/80">
                            {payment.isOverdue ? "Lewat jatuh tempo sejak" : "Jatuh tempo"} {deadline}
                        </p>
                    )}
                </section>
            )}

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

            {payment.paymentAccount && (
                <section className="space-y-3">
                    <SectionTitle>Cara pembayaran</SectionTitle>
                    <AccountCard account={payment.paymentAccount} />
                </section>
            )}

            <section className="space-y-3">
                <SectionTitle>Informasi invoice</SectionTitle>
                <dl className="grid gap-x-4 gap-y-3 sm:grid-cols-2">
                    <InfoItem label="Program">{payment.program.name}</InfoItem>
                    <InfoItem label="Kode pendaftaran">
                        <span className="font-mono text-xs">{payment.registration.registrationCode}</span>
                    </InfoItem>
                    <InfoItem label="Diterbitkan">{dateTime(payment.issuedAt)}</InfoItem>
                    <InfoItem label="Metode">{method}</InfoItem>
                    <InfoItem label="Dibayar pada">{dateTime(payment.paymentDate)}</InfoItem>
                    <InfoItem label="Diverifikasi">{dateTime(payment.verifiedAt)}</InfoItem>
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
    downloading: boolean;
    onClose: () => void;
    onUpload: (payment: MyPaymentDetail) => void;
    onDownload: (payment: MyPaymentDetail) => void;
};

export function PaymentDetailSheet({ id, downloading, onClose, onUpload, onDownload }: Props) {
    const query = useMyPayment(id);
    const payment = query.data;

    return (
        <Sheet open onOpenChange={(open) => !open && onClose()}>
            <SheetContent className="gap-0 sm:max-w-xl!">
                <SheetHeader className="border-b pr-12">
                    <SheetTitle className="flex flex-wrap items-center gap-2">
                        <span className="font-mono">{payment?.invoiceNumber ?? "Detail pembayaran"}</span>
                        {payment && <PaymentStateBadges payment={payment} />}
                    </SheetTitle>
                    <SheetDescription>
                        {payment
                            ? `${payment.program.name || "Program"} · ${payment.registration.registrationCode}`
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
                        <Button variant="outline" disabled={downloading} onClick={() => onDownload(payment)}>
                            {downloading ? (
                                <Loader2 className="animate-spin" data-icon="inline-start" aria-hidden />
                            ) : (
                                <FileDown data-icon="inline-start" aria-hidden />
                            )}
                            Unduh PDF
                        </Button>
                        {payment.actions.canUploadProof && (
                            <Button onClick={() => onUpload(payment)}>
                                <Upload data-icon="inline-start" aria-hidden />
                                {payment.state === "awaiting_verification" ? "Ganti Bukti" : "Upload Bukti"}
                            </Button>
                        )}
                    </SheetFooter>
                )}
            </SheetContent>
        </Sheet>
    );
}
