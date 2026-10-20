import { api } from "@/lib/axios";
import { PAYMENTS_PER_PAGE } from "@/constants/admin/admin-payment-constant";
import type { ApiResponse } from "@/types/api";
import type { AdminPageMeta } from "@/types/pagination";
import type {
    CreateInvoicePayload,
    InvoiceFile,
    IssueInvoicePayload,
    PaymentDetail,
    PaymentList,
    PaymentOptions,
    PaymentParams,
    PaymentSummary,
    VerifyPaymentPayload,
} from "@/types/admin/admin-payment";

const BASE_URL = "/admin/payments";

export async function getPaymentSummary(): Promise<PaymentSummary> {
    const { data } = await api.get<ApiResponse<PaymentSummary>>(`${BASE_URL}/summary`);
    return data.data;
}

export async function getPaymentOptions(): Promise<PaymentOptions> {
    const { data } = await api.get<ApiResponse<PaymentOptions>>(`${BASE_URL}/options`);
    return data.data;
}

export async function getPayments(params: PaymentParams): Promise<PaymentList> {
    const { data } = await api.get<{ success: boolean; data: PaymentList["items"]; meta: AdminPageMeta }>(BASE_URL, {
        params: {
            page: params.page,
            limit: PAYMENTS_PER_PAGE,
            search: params.search || undefined,
            status: params.status === "all" ? undefined : params.status,
            invoiceState: params.invoiceState === "all" ? undefined : params.invoiceState,
        },
    });
    return { items: data.data, meta: data.meta };
}

export async function getPayment(id: number): Promise<PaymentDetail> {
    const { data } = await api.get<ApiResponse<PaymentDetail>>(`${BASE_URL}/${id}`);
    return data.data;
}

export async function createInvoice(payload: CreateInvoicePayload): Promise<PaymentDetail> {
    const { data } = await api.post<ApiResponse<PaymentDetail>>(BASE_URL, payload);
    return data.data;
}

export async function issueInvoice(id: number, payload: IssueInvoicePayload): Promise<PaymentDetail> {
    const { data } = await api.post<ApiResponse<PaymentDetail>>(`${BASE_URL}/${id}/issue`, payload);
    return data.data;
}

export async function verifyPayment(id: number, payload: VerifyPaymentPayload): Promise<PaymentDetail> {
    const { data } = await api.post<ApiResponse<PaymentDetail>>(`${BASE_URL}/${id}/verify`, payload);
    return data.data;
}

async function readBlobMessage(blob: Blob): Promise<string> {
    const fallback = "Invoice gagal diunduh. Silakan coba lagi.";
    try {
        const body = JSON.parse(await blob.text()) as { message?: string };
        return body.message ?? fallback;
    } catch {
        return fallback;
    }
}

function filenameFromHeader(header: unknown): string | null {
    if (typeof header !== "string") return null;
    const match = /filename\*?=(?:UTF-8'')?"?([^";]+)"?/i.exec(header);
    return match ? decodeURIComponent(match[1]) : null;
}

export async function exportInvoicePdf(id: number, fallbackName: string): Promise<InvoiceFile> {
    const response = await api.get<Blob>(`${BASE_URL}/${id}/invoice`, {
        responseType: "blob",
        validateStatus: () => true,
    });

    if (response.status >= 400) throw new Error(await readBlobMessage(response.data));

    return {
        blob: response.data,
        filename: filenameFromHeader(response.headers["content-disposition"]) ?? fallbackName,
    };
}
