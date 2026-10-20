"use client";

import { useState } from "react";
import { CircleAlert, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { useIssueInvoice } from "@/hooks/admin/use-admin-payments";
import { formatIDR } from "@/lib/utils";
import { validateOptionalDate } from "@/schemas/admin/admin-payment";
import type { PaymentDetail, PaymentItem } from "@/types/admin/admin-payment";
import { a11y, Field } from "./form-field";

type Props = {
    payment: PaymentItem;
    onClose: () => void;
    onIssued: (payment: PaymentDetail) => void;
};

export function IssueInvoiceDialog({ payment, onClose, onIssued }: Props) {
    const issue = useIssueInvoice(payment.id);
    const [dueDate, setDueDate] = useState(payment.dueDate ?? "");
    const [error, setError] = useState<string>();

    function handleConfirm() {
        const invalid = validateOptionalDate(dueDate, "Tanggal jatuh tempo");
        if (invalid) {
            setError(invalid);
            return;
        }

        issue.mutate({ ...(dueDate.trim() ? { dueDate: dueDate.trim() } : {}) }, { onSuccess: onIssued });
    }

    return (
        <AlertDialog open onOpenChange={(open) => !open && !issue.isPending && onClose()}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Terbitkan tagihan ini?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Tagihan <strong className="text-foreground">{payment.invoiceNumber}</strong> sebesar{" "}
                        <strong className="text-foreground">{formatIDR(payment.amount)}</strong> akan diterbitkan dan{" "}
                        {payment.participant.name || "peserta"} menerima pemberitahuan. Setelah terbit, tagihan tidak
                        dapat diterbitkan ulang.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <Field
                    id="issue-dueDate"
                    label="Jatuh tempo"
                    error={error}
                    hint={payment.dueDate ? "Ubah jika perlu." : "Opsional. Kosongkan jika tanpa jatuh tempo."}
                >
                    <Input
                        id="issue-dueDate"
                        type="date"
                        value={dueDate}
                        onChange={(event) => {
                            setDueDate(event.target.value);
                            setError(undefined);
                        }}
                        disabled={issue.isPending}
                        className="h-10"
                        {...a11y("issue-dueDate", error, "x")}
                    />
                </Field>

                {issue.isError && (
                    <Alert variant="destructive">
                        <CircleAlert aria-hidden />
                        <AlertDescription>{issue.error.message}</AlertDescription>
                    </Alert>
                )}

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={issue.isPending}>Batal</AlertDialogCancel>
                    <AlertDialogAction
                        disabled={issue.isPending}
                        onClick={(event) => {
                            event.preventDefault();
                            handleConfirm();
                        }}
                    >
                        {issue.isPending && <Loader2 className="animate-spin" aria-hidden />}
                        {issue.isPending ? "Menerbitkan..." : "Terbitkan"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
