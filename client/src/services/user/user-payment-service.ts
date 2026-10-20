import { api } from "@/lib/axios";
import { fetchFile } from "@/lib/file-download";
import { MY_PAYMENTS_PER_PAGE } from "@/constants/user/user-payment-constant";
import type { ApiResponse } from "@/types/api";
import type { DownloadedFile } from "@/types/admin/financial-report";
import type { AdminPageMeta } from "@/types/pagination";
import type {
    MyPaymentDetail,
    MyPaymentItem,
    MyPaymentList,
    MyPaymentParams,
    MyPaymentSummary,
} from "@/types/user/user-payment";

const BASE_URL = "/user/payments";

export async function getMyPaymentSummary(): Promise<MyPaymentSummary> {
    const { data } = await api.get<ApiResponse<MyPaymentSummary>>(`${BASE_URL}/summary`);
    return data.data;
}

export async function getMyPayments(params: MyPaymentParams): Promise<MyPaymentList> {
    const { data } = await api.get<{ success: boolean; data: MyPaymentItem[]; meta: AdminPageMeta }>(BASE_URL, {
        params: {
            page: params.page,
            limit: MY_PAYMENTS_PER_PAGE,
            status: params.status === "all" ? undefined : params.status,
        },
    });
    return { items: data.data, meta: data.meta };
}

export async function getMyPayment(id: number): Promise<MyPaymentDetail> {
    const { data } = await api.get<ApiResponse<MyPaymentDetail>>(`${BASE_URL}/${id}`);
    return data.data;
}

export async function submitPaymentProof(id: number, proof: File): Promise<MyPaymentDetail> {
    const body = new FormData();
    body.append("proof", proof);

    const { data } = await api.post<ApiResponse<MyPaymentDetail>>(`${BASE_URL}/${id}/proof`, body, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return data.data;
}

export function downloadMyInvoice(id: number, fallbackName: string): Promise<DownloadedFile> {
    return fetchFile(`${BASE_URL}/${id}/invoice`, {
        fallbackName,
        errorMessage: "Invoice gagal diunduh. Silakan coba lagi.",
    });
}
