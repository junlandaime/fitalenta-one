import { cache } from "react";
import { api } from "@/lib/axios";
import type {
    GalleryDetailData,
    GalleryListData,
} from "@/types/gallery";
import type { ApiResponse } from "@/types/api";

export async function getGallery(): Promise<GalleryListData> {
    try {
        const { data } = await api.get<ApiResponse<GalleryListData>>("/gallery");
        return data.data ?? [];
    } catch {
        return [];
    }
}

export const getGalleryById = cache(
    async (id: number): Promise<GalleryDetailData | undefined> => {
        const res = await api.get<ApiResponse<GalleryDetailData>>(`/gallery/${id}`, {
            validateStatus: (s) => s < 500,
        });
        if (res.status === 404) return undefined;
        if (!res.data.success) {
            throw new Error(res.data.message ?? "Gagal memuat gallery");
        }
        return res.data.data;
    },
);