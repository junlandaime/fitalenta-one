"use client";

import { useState, type FormEvent } from "react";
import { BadgeCheck, CircleAlert, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { PAYMENT_METHOD_META } from "@/constants/admin/admin-payment-constant";
import { formatShortDate, formatShortTime } from "@/helpers/admin/admin-helper";
import { formatDeadline, getVerifyPreview } from "@/helpers/admin/admin-payment-helper";
import { useVerifyPayment } from "@/hooks/admin/use-admin-payments";
import { formatIDR } from "@/lib/utils";
import { validateOptionalDate } from "@/schemas/admin/admin-payment";
import type { PaymentDetail, PaymentItem } from "@/types/admin/admin-payment";
import { a11y, Field } from "./form-field";
import { ProofImage } from "./proof-image";

type Props = {
    payment: PaymentItem;
    onClose: () => void;
    onVerified: (payment: PaymentDetail) => void;
};

function Row({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex items-start justify-between gap-4 text-sm">
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="text-right font-medium">{children}</dd>
        </div>
    );
}

export function VerifyPaymentSheet({ payment, onClose, onVerified }: Props) {
    const verify = useVerifyPayment(payment.id);
    const preview = getVerifyPreview(payment);
    const method = PAYMENT_METHOD_META[payment.paymentMethod];
    const currentDeadline = formatDeadline(payment);

    const [nextDueDate, setNextDueDate] = useState("");
    const [notes, setNotes] = useState("");
    const [dateError, setDateError] = useState<string>();

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const invalid = preview.settled ? undefined : validateOptionalDate(nextDueDate, "Jatuh tempo berikutnya");
        if (invalid) {
            setDateError(invalid);
            return;
        }

        verify.mutate(
            {
                ...(!preview.settled && nextDueDate.trim() ? { nextDueDate: nextDueDate.trim() } : {}),
                ...(notes.trim() ? { notes: notes.trim() } : {}),
            },
            { onSuccess: onVerified },
        );
    }

    return (
        <Sheet open onOpenChange={(open) => !open && !verify.isPending && onClose()}>
            <SheetContent className="gap-0 sm:max-w-lg!">
                <SheetHeader className="border-b">
                    <SheetTitle>Verifikasi pembayaran</SheetTitle>
                    <SheetDescription>
                        Periksa bukti pembayaran {payment.participant.name || "peserta"} untuk{" "}
                        <span className="font-mono">{payment.invoiceNumber}</span>.
                    </SheetDescription>
                </SheetHeader>

                <form onSubmit={handleSubmit} noValidate className="flex min-h-0 flex-1 flex-col">
                    <div className="flex-1 space-y-5 overflow-y-auto p-4">
                        <ProofImage src={payment.proofImage} alt={`Bukti pembayaran ${payment.invoiceNumber}`} />

                        <dl className="space-y-2.5 rounded-lg border p-3">
                            <Row label="Yang diverifikasi">
                                {preview.installmentNumber
                                    ? `Cicilan ke-${preview.installmentNumber} dari ${preview.installmentTotal}`
                                    : "Pembayaran penuh"}
                            </Row>
                            <Row label="Nominal">{formatIDR(preview.amount)}</Row>
                            <Row label="Metode">{method?.label ?? payment.paymentMethod}</Row>
                            {payment.paymentDate && (
                                <Row label="Dibayar pada">
                                    {formatShortDate(payment.paymentDate)}, {formatShortTime(payment.paymentDate)}
                                </Row>
                            )}
                            <Row label="Setelah verifikasi">
                                {preview.settled
                                    ? "Tagihan lunas"
                                    : `Terbayar ${formatIDR(Number(payment.amountPaid) + Number(preview.amount))} dari ${formatIDR(payment.amount)}`}
                            </Row>
                        </dl>

                        {!preview.settled && (
                            <Field
                                id="verify-nextDueDate"
                                label="Jatuh tempo cicilan berikutnya"
                                error={dateError}
                                hint={
                                    currentDeadline
                                        ? `Kosongkan untuk mempertahankan ${currentDeadline}.`
                                        : "Opsional."
                                }
                            >
                                <Input
                                    id="verify-nextDueDate"
                                    type="date"
                                    value={nextDueDate}
                                    onChange={(event) => {
                                        setNextDueDate(event.target.value);
                                        setDateError(undefined);
                                    }}
                                    className="h-10"
                                    {...a11y("verify-nextDueDate", dateError, "x")}
                                />
                            </Field>
                        )}

                        <Field id="verify-notes" label="Catatan" hint="Opsional. Dicatat pada riwayat pembayaran.">
                            <Textarea
                                id="verify-notes"
                                rows={3}
                                value={notes}
                                onChange={(event) => setNotes(event.target.value)}
                                {...a11y("verify-notes", undefined, "x")}
                            />
                        </Field>

                        {verify.isError && (
                            <Alert variant="destructive">
                                <CircleAlert aria-hidden />
                                <AlertTitle>Gagal memverifikasi pembayaran</AlertTitle>
                                <AlertDescription>{verify.error.message}</AlertDescription>
                            </Alert>
                        )}
                    </div>

                    <SheetFooter className="border-t sm:flex-row sm:justify-end">
                        <Button type="button" variant="outline" onClick={onClose} disabled={verify.isPending}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={verify.isPending}>
                            {verify.isPending ? (
                                <Loader2 className="animate-spin" data-icon="inline-start" aria-hidden />
                            ) : (
                                <BadgeCheck data-icon="inline-start" aria-hidden />
                            )}
                            {verify.isPending ? "Memverifikasi..." : "Verifikasi pembayaran"}
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
}
