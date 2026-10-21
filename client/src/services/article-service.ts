import { cache } from "react";
import { api } from "@/lib/axios";
import type {
    ArticleDetailData,
    ArticleItem,
    ArticlesListData,
} from "@/types/article";
import type { ApiResponse } from "@/types/api";

export async function getArticles(
    params: { page?: number } = {},
): Promise<ArticlesListData> {
    try {
        const { data } = await api.get<ApiResponse<ArticlesListData>>("/articles", {
            params: { page: params.page && params.page > 1 ? params.page : undefined },
        });
        return data.data ?? { articles: [], pagination: { page: 1, perPage: 7, total: 0, totalPages: 0 } };
    } catch {
        return { articles: [], pagination: { page: 1, perPage: 7, total: 0, totalPages: 0 } };
    }
}

export async function getFeaturedArticles(): Promise<ArticleItem[]> {
    try {
        const { data } = await api.get<ApiResponse<ArticleItem[]>>("/articles/featured");
        return data.data ?? [];
    } catch {
        return [];
    }
}

export const getArticleBySlug = cache(
    async (slug: string): Promise<ArticleDetailData | undefined> => {
        const res = await api.get<ApiResponse<ArticleDetailData>>(`/articles/${slug}`, {
            validateStatus: (s) => s < 500,
        });
        if (res.status === 404) return undefined;
        if (!res.data.success) {
            throw new Error(res.data.message ?? "Gagal memuat artikel");
        }
        return res.data.data;
    },
);
