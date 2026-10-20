import { cache } from "react";
import { api } from "@/lib/axios";
import type {
    ServiceDetailData,
    ServicesListData,
} from "@/types/service";
import type { ApiResponse } from "@/types/api";

export async function getServices(): Promise<ServicesListData> {
    try {
        const { data } = await api.get<ApiResponse<ServicesListData>>("/services");
        return data.data ?? [];
    } catch {
        return [];
    }
}

export const getServiceBySlug = cache(
    async (
        slug: string,
        ip = "",
        userAgent = "",
    ): Promise<ServiceDetailData | undefined> => {
        const res = await api.get<ApiResponse<ServiceDetailData>>(`/services/${slug}`, {
            headers: {
                ...(ip && { "x-forwarded-for": ip }),
                ...(userAgent && { "user-agent": userAgent }),
            },
            validateStatus: (s) => s < 500,
        });
        if (res.status === 404) return undefined;
        if (!res.data.success) {
            throw new Error(res.data.message ?? "Gagal memuat layanan");
        }
        return res.data.data;
    },
);