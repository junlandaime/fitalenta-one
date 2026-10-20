"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    createInvoice,
    exportInvoicePdf,
    getPayment,
    getPaymentOptions,
    getPayments,
    getPaymentSummary,
    issueInvoice,
    verifyPayment,
} from "@/services/admin/admin-payment-service";
import type {
    CreateInvoicePayload,
    IssueInvoicePayload,
    PaymentDetail,
    PaymentParams,
    VerifyPaymentPayload,
} from "@/types/admin/admin-payment";

const PAYMENTS_KEY = ["admin", "payments"] as const;
const detailKey = (id: number | undefined) => [...PAYMENTS_KEY, "detail", id] as const;

export function useAdminPayments(params: PaymentParams) {
    return useQuery({
        queryKey: [...PAYMENTS_KEY, "list", params],
        queryFn: () => getPayments(params),
        placeholderData: keepPreviousData,
    });
}

export function useAdminPaymentSummary() {
    return useQuery({
        queryKey: [...PAYMENTS_KEY, "summary"],
        queryFn: getPaymentSummary,
    });
}

export function useAdminPaymentOptions() {
    return useQuery({
        queryKey: [...PAYMENTS_KEY, "options"],
        queryFn: getPaymentOptions,
        staleTime: 5 * 60_000,
    });
}

export function useAdminPayment(id: number | undefined) {
    return useQuery({
        queryKey: detailKey(id),
        queryFn: () => getPayment(id as number),
        enabled: id !== undefined,
    });
}

function useAfterPaymentChange() {
    const queryClient = useQueryClient();

    return (payment: PaymentDetail) => {
        queryClient.setQueryData(detailKey(payment.id), payment);
        queryClient.invalidateQueries({ queryKey: PAYMENTS_KEY });
        queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    };
}

export function useCreateInvoice() {
    const afterChange = useAfterPaymentChange();

    return useMutation({
        mutationFn: (payload: CreateInvoicePayload) => createInvoice(payload),
        onSuccess: afterChange,
    });
}

export function useIssueInvoice(id: number) {
    const afterChange = useAfterPaymentChange();

    return useMutation({
        mutationFn: (payload: IssueInvoicePayload) => issueInvoice(id, payload),
        onSuccess: afterChange,
    });
}

export function useVerifyPayment(id: number) {
    const afterChange = useAfterPaymentChange();

    return useMutation({
        mutationFn: (payload: VerifyPaymentPayload) => verifyPayment(id, payload),
        onSuccess: afterChange,
    });
}

type ExportVariables = { id: number; invoiceNumber: string };

export function useExportInvoice() {
    return useMutation({
        mutationFn: ({ id, invoiceNumber }: ExportVariables) => exportInvoicePdf(id, `${invoiceNumber}.pdf`),
    });
}
