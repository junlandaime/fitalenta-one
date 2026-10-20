"use client";

import { useState, type FormEvent } from "react";
import { CircleAlert, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { MIN_INSTALLMENTS } from "@/constants/admin/admin-payment-constant";
import { buildCreatePayload, digitsOnly, splitEvenly } from "@/helpers/admin/admin-payment-helper";
import { useCreateInvoice } from "@/hooks/admin/use-admin-payments";
import { formatIDR } from "@/lib/utils";
import { validateInvoiceForm, type InvoiceFormErrors, type InvoiceFormValues } from "@/schemas/admin/admin-payment";
import type { PaymentDetail } from "@/types/admin/admin-payment";
import { a11y, Field } from "./form-field";
import { InstallmentFields } from "./installment-fields";
import { RegistrationPicker, type RegistrationOption } from "./registration-picker";

const INITIAL_VALUES: InvoiceFormValues = {
    registrationId: null,
    amount: "",
    dueDate: "",
    useInstallments: false,
    installmentAmounts: [],
    notes: "",
};

type Props = {
    onClose: () => void;
    onSaved: (payment: PaymentDetail) => void;
};

export function InvoiceFormSheet({ onClose, onSaved }: Props) {
    const save = useCreateInvoice();

    const [values, setValues] = useState<InvoiceFormValues>(INITIAL_VALUES);
    const [registration, setRegistration] = useState<RegistrationOption | null>(null);
    const [errors, setErrors] = useState<InvoiceFormErrors>({});
    const [installmentsEdited, setInstallmentsEdited] = useState(false);

    function patch(changes: Partial<InvoiceFormValues>) {
        setValues((current) => ({ ...current, ...changes }));
        setErrors((current) => {
            const next = { ...current };
            for (const key of Object.keys(changes) as (keyof InvoiceFormValues)[]) next[key] = undefined;
            return next;
        });
    }

    function handleRegistration(option: RegistrationOption | null) {
        setRegistration(option);
        patch({ registrationId: option?.id ?? null });
    }

    function handleAmountChange(raw: string) {
        const amount = digitsOnly(raw);
        const follow = values.useInstallments && !installmentsEdited;

        patch({
            amount,
            ...(follow ? { installmentAmounts: splitEvenly(Number(amount), values.installmentAmounts.length) } : {}),
        });
        setErrors((current) => ({ ...current, installmentAmounts: undefined }));
    }

    function handleToggleInstallments(checked: boolean) {
        setInstallmentsEdited(false);
        patch({
            useInstallments: checked,
            installmentAmounts: checked ? splitEvenly(Number(values.amount), MIN_INSTALLMENTS) : [],
        });
    }

    function handleCountChange(count: number) {
        setInstallmentsEdited(false);
        patch({ installmentAmounts: splitEvenly(Number(values.amount), count) });
    }

    function handleInstallmentChange(index: number, raw: string) {
        setInstallmentsEdited(true);
        patch({
            installmentAmounts: values.installmentAmounts.map((item, i) => (i === index ? digitsOnly(raw) : item)),
        });
    }

    function handleSplitEvenly() {
        setInstallmentsEdited(false);
        patch({ installmentAmounts: splitEvenly(Number(values.amount), values.installmentAmounts.length) });
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const nextErrors = validateInvoiceForm(values);
        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            return;
        }

        save.mutate(buildCreatePayload(values), { onSuccess: onSaved });
    }

    return (
        <Sheet open onOpenChange={(open) => !open && !save.isPending && onClose()}>
            <SheetContent className="gap-0 sm:max-w-lg!">
                <SheetHeader className="border-b">
                    <SheetTitle>Buat tagihan</SheetTitle>
                    <SheetDescription>
                        Input transaksi manual. Tagihan dibuat sebagai draft dan baru diterima peserta setelah
                        diterbitkan.
                    </SheetDescription>
                </SheetHeader>

                <form onSubmit={handleSubmit} noValidate className="flex min-h-0 flex-1 flex-col">
                    <div className="flex-1 space-y-4 overflow-y-auto p-4">
                        <Field id="registrationId" label="Pendaftaran peserta" required error={errors.registrationId}>
                            <RegistrationPicker
                                id="registrationId"
                                selected={registration}
                                error={errors.registrationId}
                                onSelect={handleRegistration}
                            />
                        </Field>

                        <Field
                            id="amount"
                            label="Nominal tagihan"
                            required
                            error={errors.amount}
                            hint={
                                Number(values.amount) > 0
                                    ? formatIDR(values.amount)
                                    : "Total yang harus dibayar peserta, dalam Rupiah."
                            }
                        >
                            <div className="relative">
                                <span className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-sm text-muted-foreground">
                                    Rp
                                </span>
                                <Input
                                    id="amount"
                                    inputMode="numeric"
                                    value={values.amount}
                                    onChange={(event) => handleAmountChange(event.target.value)}
                                    autoComplete="off"
                                    className="h-10 pl-9 tabular-nums"
                                    {...a11y("amount", errors.amount, "x")}
                                />
                            </div>
                        </Field>

                        <Field id="dueDate" label="Jatuh tempo" error={errors.dueDate} hint="Opsional.">
                            <Input
                                id="dueDate"
                                type="date"
                                value={values.dueDate}
                                onChange={(event) => patch({ dueDate: event.target.value })}
                                className="h-10"
                                {...a11y("dueDate", errors.dueDate, "x")}
                            />
                        </Field>

                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="useInstallments"
                                    checked={values.useInstallments}
                                    onCheckedChange={(checked) => handleToggleInstallments(checked === true)}
                                />
                                <Label htmlFor="useInstallments">Bayar dengan cicilan</Label>
                            </div>
                            {values.useInstallments && (
                                <InstallmentFields
                                    amounts={values.installmentAmounts}
                                    total={values.amount}
                                    error={errors.installmentAmounts}
                                    onCountChange={handleCountChange}
                                    onAmountChange={handleInstallmentChange}
                                    onSplitEvenly={handleSplitEvenly}
                                />
                            )}
                        </div>

                        <Field id="notes" label="Catatan" error={errors.notes} hint="Opsional. Dicatat pada tagihan.">
                            <Textarea
                                id="notes"
                                rows={3}
                                value={values.notes}
                                onChange={(event) => patch({ notes: event.target.value })}
                                {...a11y("notes", errors.notes, "x")}
                            />
                        </Field>

                        {save.isError && (
                            <Alert variant="destructive">
                                <CircleAlert aria-hidden />
                                <AlertTitle>Gagal membuat tagihan</AlertTitle>
                                <AlertDescription>{save.error.message}</AlertDescription>
                            </Alert>
                        )}
                    </div>

                    <SheetFooter className="border-t sm:flex-row sm:justify-end">
                        <Button type="button" variant="outline" onClick={onClose} disabled={save.isPending}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={save.isPending}>
                            {save.isPending && <Loader2 className="animate-spin" data-icon="inline-start" aria-hidden />}
                            {save.isPending ? "Menyimpan..." : "Buat tagihan"}
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
}
