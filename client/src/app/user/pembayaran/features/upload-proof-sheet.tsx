"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { CircleAlert, ImagePlus, Loader2, Send } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { PAYMENT_PROOF_RULES } from "@/constants/user/user-payment-constant";
import { formatDeadline, getDueLabel, validateProofFile } from "@/helpers/user/user-payment-helper";
import { useMyPayment, useSubmitPaymentProof } from "@/hooks/user/use-user-payments";
import { cn, formatIDR } from "@/lib/utils";
import type { MyPaymentDetail } from "@/types/user/user-payment";
import { AccountCard } from "./account-card";

type Picked = { file: File; preview: string };

type Props = {
    id: number;
    onClose: () => void;
    onUploaded: (payment: MyPaymentDetail) => void;
};

export function UploadProofSheet({ id, onClose, onUploaded }: Props) {
    const query = useMyPayment(id);
    const submit = useSubmitPaymentProof(id);
    const payment = query.data;

    const inputRef = useRef<HTMLInputElement>(null);
    const previewRef = useRef<string | null>(null);
    const [picked, setPicked] = useState<Picked | null>(null);
    const [fileError, setFileError] = useState<string | null>(null);

    useEffect(
        () => () => {
            if (previewRef.current) URL.revokeObjectURL(previewRef.current);
        },
        [],
    );

    function handleChange(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        event.target.value = "";
        if (!file) return;

        const message = validateProofFile(file);
        if (message) {
            setFileError(message);
            return;
        }

        if (previewRef.current) URL.revokeObjectURL(previewRef.current);
        const preview = URL.createObjectURL(file);
        previewRef.current = preview;

        setFileError(null);
        setPicked({ file, preview });
    }

    function handleSubmit() {
        if (!picked) {
            setFileError("Pilih file bukti pembayaran terlebih dahulu");
            return;
        }
        submit.mutate(picked.file, { onSuccess: onUploaded });
    }

    const canUpload = payment?.actions.canUploadProof ?? false;
    const replacing = payment?.state === "awaiting_verification";
    const deadline = payment ? formatDeadline(payment) : null;

    return (
        <Sheet open onOpenChange={(open) => !open && !submit.isPending && onClose()}>
            <SheetContent className="gap-0 sm:max-w-md!">
                <SheetHeader className="border-b pr-12">
                    <SheetTitle>Upload Bukti Pembayaran</SheetTitle>
                    <SheetDescription>
                        {payment ? <span className="font-mono">{payment.invoiceNumber}</span> : "Memuat tagihan..."}
                    </SheetDescription>
                </SheetHeader>

                <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-4">
                    {query.isError ? (
                        <Alert variant="destructive">
                            <CircleAlert aria-hidden />
                            <AlertTitle>Tagihan gagal dimuat</AlertTitle>
                            <AlertDescription>{query.error.message}</AlertDescription>
                        </Alert>
                    ) : !payment ? (
                        <div aria-busy="true" aria-label="Memuat tagihan" className="space-y-4">
                            <Skeleton className="h-24 rounded-xl" />
                            <Skeleton className="h-32 rounded-xl" />
                            <Skeleton className="h-44 rounded-xl" />
                        </div>
                    ) : (
                        <>
                            <section className="space-y-1 rounded-xl bg-primary p-4 text-primary-foreground">
                                <p className="text-xs text-primary-foreground/70">
                                    Nominal yang harus dibayar · {getDueLabel(payment)}
                                </p>
                                <p className="text-2xl font-extrabold tracking-tight tabular-nums">
                                    {formatIDR(payment.amountDue)}
                                </p>
                                {deadline && <p className="text-xs text-primary-foreground/80">Jatuh tempo {deadline}</p>}
                            </section>

                            {payment.paymentAccount && <AccountCard account={payment.paymentAccount} />}

                            {!canUpload ? (
                                <Alert variant="destructive">
                                    <CircleAlert aria-hidden />
                                    <AlertTitle>Bukti tidak dapat diunggah</AlertTitle>
                                    <AlertDescription>Tagihan ini sudah lunas atau tidak lagi aktif.</AlertDescription>
                                </Alert>
                            ) : (
                                <section className="space-y-3">
                                    {replacing && (
                                        <Alert>
                                            <CircleAlert aria-hidden />
                                            <AlertTitle>Bukti sebelumnya akan diganti</AlertTitle>
                                            <AlertDescription>
                                                Bukti yang sedang diperiksa admin akan digantikan oleh file baru ini.
                                            </AlertDescription>
                                        </Alert>
                                    )}

                                    <div className="space-y-1.5">
                                        <p className="text-sm font-semibold text-primary">Bukti transfer</p>

                                        <button
                                            type="button"
                                            onClick={() => inputRef.current?.click()}
                                            aria-describedby="proof-hint"
                                            className={cn(
                                                "flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed p-4 text-center transition-colors",
                                                "hover:border-indigo-300 hover:bg-indigo-50/40 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                                                fileError && "border-destructive",
                                            )}
                                        >
                                            {picked ? (
                                                <>
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img
                                                        src={picked.preview}
                                                        alt="Pratinjau bukti pembayaran"
                                                        className="max-h-64 w-full rounded-lg object-contain"
                                                    />
                                                    <span className="max-w-full truncate text-xs text-muted-foreground">
                                                        {picked.file.name}
                                                    </span>
                                                    <span className="text-xs font-semibold text-indigo-600">Ganti file</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="grid size-12 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
                                                        <ImagePlus className="size-5" aria-hidden />
                                                    </span>
                                                    <span className="text-sm font-semibold text-primary">Pilih file bukti</span>
                                                </>
                                            )}
                                        </button>

                                        <p
                                            id="proof-hint"
                                            role={fileError ? "alert" : undefined}
                                            className={cn(
                                                "text-xs",
                                                fileError ? "text-destructive" : "text-muted-foreground",
                                            )}
                                        >
                                            {fileError ?? PAYMENT_PROOF_RULES.label}
                                        </p>

                                        <input
                                            ref={inputRef}
                                            type="file"
                                            accept={PAYMENT_PROOF_RULES.accept}
                                            onChange={handleChange}
                                            tabIndex={-1}
                                            className="hidden"
                                        />
                                    </div>
                                </section>
                            )}

                            {submit.isError && (
                                <Alert variant="destructive">
                                    <CircleAlert aria-hidden />
                                    <AlertTitle>Bukti gagal dikirim</AlertTitle>
                                    <AlertDescription>{submit.error.message}</AlertDescription>
                                </Alert>
                            )}
                        </>
                    )}
                </div>

                <SheetFooter className="border-t sm:flex-row sm:justify-end">
                    <Button variant="outline" disabled={submit.isPending} onClick={onClose}>
                        Batal
                    </Button>
                    <Button disabled={!canUpload || !picked || submit.isPending} onClick={handleSubmit}>
                        {submit.isPending ? (
                            <Loader2 className="animate-spin" data-icon="inline-start" aria-hidden />
                        ) : (
                            <Send data-icon="inline-start" aria-hidden />
                        )}
                        {submit.isPending ? "Mengirim..." : "Kirim Bukti"}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
