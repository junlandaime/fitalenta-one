import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { Pagination } from "@/types/pagination";
import type { EditorArticle, EditorArticleList, EditorArticlePayload } from "@/types/editor/editor-article";

function toFormData(payload: EditorArticlePayload): FormData {
    const body = new FormData();
    body.append("title", payload.title);
    body.append("excerpt", payload.excerpt);
    body.append("content", payload.content);
    body.append("categoryId", String(payload.categoryId));
    body.append("isFeatured", String(payload.isFeatured));
    if (payload.publishedAt) body.append("eventDate", payload.publishedAt);
    if (payload.image) body.append("image", payload.image);
    return body;
}

const MULTIPART = { headers: { "Content-Type": "multipart/form-data" } };

export async function getEditorArticles(page: number): Promise<EditorArticleList> {
    const { data } = await api.get<ApiResponse<{ articles: EditorArticle[]; pagination: Pagination }>>(
        "/admin/articles",
        { params: { page } },
    );
    const { articles, pagination } = data.data;
    return {
        articles,
        meta: {
            total: pagination.total,
            page: pagination.page,
            limit: pagination.perPage,
            totalPages: pagination.totalPages,
        },
    };
}

export async function getEditorArticle(id: number): Promise<EditorArticle> {
    const { data } = await api.get<ApiResponse<EditorArticle>>(`/admin/articles/${id}`);
    return data.data;
}

export async function createEditorArticle(payload: EditorArticlePayload): Promise<EditorArticle> {
    const { data } = await api.post<ApiResponse<EditorArticle>>("/admin/articles", toFormData(payload), MULTIPART);
    return data.data;
}

export async function updateEditorArticle(id: number, payload: EditorArticlePayload): Promise<EditorArticle> {
    const { data } = await api.put<ApiResponse<EditorArticle>>(`/admin/articles/${id}`, toFormData(payload), MULTIPART);
    return data.data;
}

export async function deleteEditorArticle(id: number): Promise<void> {
    await api.delete<ApiResponse<null>>(`/admin/articles/${id}`);
}
