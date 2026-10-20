"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    downloadMyInvoice,
    getMyPayment,
    getMyPayments,
    getMyPaymentSummary,
    submitPaymentProof,
} from "@/services/user/user-payment-service";
import type { MyPaymentDetail, MyPaymentParams } from "@/types/user/user-payment";

const PAYMENTS_KEY = ["user", "payments"] as const;
const detailKey = (id: number | undefined) => [...PAYMENTS_KEY, "detail", id] as const;

export function useMyPayments(params: MyPaymentParams) {
    return useQuery({
        queryKey: [...PAYMENTS_KEY, "list", params],
        queryFn: () => getMyPayments(params),
        placeholderData: keepPreviousData,
        staleTime: 30_000,
    });
}

export function useMyPaymentSummary() {
    return useQuery({
        queryKey: [...PAYMENTS_KEY, "summary"],
        queryFn: getMyPaymentSummary,
        staleTime: 30_000,
    });
}

export function useMyPayment(id: number | undefined) {
    return useQuery({
        queryKey: detailKey(id),
        queryFn: () => getMyPayment(id as number),
        enabled: id !== undefined,
    });
}

export function useSubmitPaymentProof(id: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (proof: File) => submitPaymentProof(id, proof),
        onSuccess: (payment: MyPaymentDetail) => {
            queryClient.setQueryData(detailKey(payment.id), payment);
            queryClient.invalidateQueries({ queryKey: PAYMENTS_KEY });
            queryClient.invalidateQueries({ queryKey: ["user-dashboard"] });
        },
    });
}

type DownloadVariables = { id: number; invoiceNumber: string };

export function useDownloadMyInvoice() {
    return useMutation({
        mutationFn: ({ id, invoiceNumber }: DownloadVariables) => downloadMyInvoice(id, `${invoiceNumber}.pdf`),
    });
}
