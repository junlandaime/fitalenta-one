import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { PublicBanner } from "@/types/banner";

export async function getActiveBanners(): Promise<PublicBanner[]> {
    const { data } = await api.get<ApiResponse<PublicBanner[]>>("/banners");
    return data.data ?? [];
}