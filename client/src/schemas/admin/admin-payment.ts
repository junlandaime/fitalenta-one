import { z } from "zod";
import { MAX_INSTALLMENTS, MIN_INSTALLMENTS } from "@/constants/admin/admin-payment-constant";
import { formatIDR } from "@/lib/utils";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const DIGITS_PATTERN = /^\d+$/;

const isPositiveAmount = (value: string) => DIGITS_PATTERN.test(value) && Number(value) > 0;
const isBlankOrDate = (value: string) => value === "" || (DATE_PATTERN.test(value) && !Number.isNaN(Date.parse(value)));

export type InvoiceFormValues = {
    registrationId: number | null;
    amount: string;
    dueDate: string;
    useInstallments: boolean;
    installmentAmounts: string[];
    notes: string;
};

export const invoiceSchema = z
    .object({
        registrationId: z
            .number({ error: "Pendaftaran peserta wajib dipilih" })
            .int()
            .positive("Pendaftaran peserta wajib dipilih"),
        amount: z.string().trim().refine(isPositiveAmount, { error: "Nominal tagihan harus lebih dari 0" }),
        dueDate: z.string().trim().refine(isBlankOrDate, { error: "Tanggal jatuh tempo tidak valid" }),
        useInstallments: z.boolean(),
        installmentAmounts: z.array(z.string().trim()),
        notes: z.string().trim(),
    })
    .superRefine((values, ctx) => {
        if (!values.useInstallments) return;

        const { installmentAmounts: items } = values;
        const issue = (message: string) => ctx.addIssue({ code: "custom", path: ["installmentAmounts"], message });

        if (items.length < MIN_INSTALLMENTS || items.length > MAX_INSTALLMENTS) {
            return issue(`Jumlah cicilan harus ${MIN_INSTALLMENTS}–${MAX_INSTALLMENTS} kali`);
        }
        if (!items.every(isPositiveAmount)) return issue("Nominal setiap cicilan harus lebih dari 0");

        if (!isPositiveAmount(values.amount)) return;
        const total = items.reduce((sum, item) => sum + Number(item), 0);
        if (total !== Number(values.amount)) {
            issue(
                `Total cicilan (${formatIDR(total)}) harus sama dengan nominal tagihan (${formatIDR(values.amount)})`,
            );
        }
    });

export type InvoiceFormErrors = Partial<Record<keyof InvoiceFormValues, string>>;

export function validateInvoiceForm(values: InvoiceFormValues): InvoiceFormErrors {
    const result = invoiceSchema.safeParse(values);
    if (result.success) return {};

    const errors: InvoiceFormErrors = {};
    for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof InvoiceFormValues;
        errors[key] ??= issue.message;
    }
    return errors;
}

export function validateOptionalDate(value: string, label: string): string | undefined {
    return isBlankOrDate(value.trim()) ? undefined : `${label} tidak valid`;
}
