import { CalendarDays, Eye, FileDown, FileText, Hourglass, Loader2, Receipt, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/app/admin/pembayaran/features/payment-progress";
import { PAYMENT_METHOD_LABEL } from "@/constants/user/dashboard-constant";
import { formatShortDate } from "@/helpers/admin/admin-helper";
import { paymentPercent } from "@/helpers/admin/admin-payment-helper";
import { formatDeadline, getDueLabel, isOpenPayment } from "@/helpers/user/user-payment-helper";
import { cn, formatIDR } from "@/lib/utils";
import type { MyPaymentItem } from "@/types/user/user-payment";
import { PaymentStateBadges } from "./payment-state-badges";

type Props = {
    payment: MyPaymentItem;
    downloading: boolean;
    onDetail: (payment: MyPaymentItem) => void;
    onUpload: (payment: MyPaymentItem) => void;
    onDownload: (payment: MyPaymentItem) => void;
};

export function InvoiceCard({ payment, downloading, onDetail, onUpload, onDownload }: Props) {
    const open = isOpenPayment(payment);
    const deadline = open ? formatDeadline(payment) : null;
    const method = PAYMENT_METHOD_LABEL[payment.paymentMethod] ?? payment.paymentMethod;
    const verifying = payment.state === "awaiting_verification";

    return (
        <li className={cn("rounded-2xl border bg-card p-5 transition-shadow hover:shadow-sm", payment.isOverdue && "border-red-200")}>
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex min-w-0 items-start gap-3">
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
                        <FileText className="size-5" aria-hidden />
                    </span>
                    <div className="min-w-0 space-y-0.5">
                        <p className="font-mono text-sm font-semibold wrap-break-word">{payment.invoiceNumber}</p>
                        <p className="text-sm font-medium text-primary">{payment.program.name || "-"}</p>
                        <p className="text-xs text-muted-foreground">
                            <span className="font-mono">{payment.registration.registrationCode || "-"}</span> · {method}
                        </p>
                    </div>
                </div>
                <PaymentStateBadges payment={payment} />
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
                <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">{open ? "Tagihan saat ini" : "Total tagihan"}</p>
                    <p className="text-2xl font-extrabold tracking-tight text-primary tabular-nums">
                        {formatIDR(open ? payment.amountDue : payment.amount)}
                    </p>
                    {open && <p className="text-xs font-medium text-indigo-600">{getDueLabel(payment)}</p>}
                    {deadline && (
                        <p
                            className={cn(
                                "flex items-center gap-1.5 text-xs text-muted-foreground",
                                payment.isOverdue && "font-semibold text-red-600",
                            )}
                        >
                            <CalendarDays className="size-3.5" aria-hidden />
                            Jatuh tempo {deadline}
                        </p>
                    )}
                    {payment.state === "paid" && payment.receiptNumber && (
                        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Receipt className="size-3.5" aria-hidden />
                            Kwitansi {payment.receiptNumber}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <div className="flex items-baseline justify-between gap-3 text-xs">
                        <span className="text-muted-foreground tabular-nums">{paymentPercent(payment)}% terbayar</span>
                        <span className="font-semibold text-emerald-600 tabular-nums">{formatIDR(payment.amountPaid)}</span>
                    </div>
                    <ProgressBar payment={payment} />
                    <p className="text-xs text-muted-foreground tabular-nums">
                        Sisa {formatIDR(payment.remainingAmount)} dari {formatIDR(payment.amount)}
                    </p>
                </div>
            </div>

            {verifying && (
                <p className="mt-4 flex items-start gap-2 rounded-lg bg-indigo-50/70 px-3 py-2 text-xs text-indigo-700">
                    <Hourglass className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                    Bukti pembayaran
                    {payment.paymentDate ? ` (${formatShortDate(payment.paymentDate)})` : ""} sudah diterima dan sedang
                    diperiksa admin.
                </p>
            )}

            <div className="mt-5 flex flex-wrap justify-end gap-2 border-t pt-4">
                <Button variant="outline" onClick={() => onDetail(payment)}>
                    <Eye data-icon="inline-start" aria-hidden />
                    Lihat Detail
                </Button>
                <Button
                    variant="outline"
                    disabled={downloading}
                    aria-label={`Unduh invoice ${payment.invoiceNumber}`}
                    onClick={() => onDownload(payment)}
                >
                    {downloading ? (
                        <Loader2 className="animate-spin" data-icon="inline-start" aria-hidden />
                    ) : (
                        <FileDown data-icon="inline-start" aria-hidden />
                    )}
                    Unduh Invoice
                </Button>
                {payment.actions.canUploadProof && (
                    <Button
                        variant={verifying ? "outline" : "default"}
                        className={verifying ? undefined : "bg-primary hover:bg-primary/90"}
                        onClick={() => onUpload(payment)}
                    >
                        <Upload data-icon="inline-start" aria-hidden />
                        {verifying ? "Ganti Bukti" : "Upload Bukti"}
                    </Button>
                )}
            </div>
        </li>
    );
}
