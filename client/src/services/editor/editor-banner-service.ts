import { api } from "@/lib/axios";
import { BANNERS_PER_PAGE } from "@/constants/editor/editor-banner-constant";
import type { ApiResponse } from "@/types/api";
import type { AdminPageMeta } from "@/types/pagination";
import type {
    EditorBanner,
    EditorBannerList,
    EditorBannerParams,
    EditorBannerPayload,
    EditorBannerSummary,
} from "@/types/editor/editor-banner";

const BASE = "/admin/banners";

const MULTIPART = { headers: { "Content-Type": "multipart/form-data" } };

function toFormData(payload: EditorBannerPayload): FormData {
    const body = new FormData();
    body.append("title", payload.title);
    body.append("subtitle", payload.subtitle);
    body.append("ctaLabel", payload.ctaLabel);
    body.append("linkUrl", payload.linkUrl);
    body.append("startsAt", payload.startsAt ?? "");
    body.append("endsAt", payload.endsAt ?? "");
    body.append("isActive", String(payload.isActive));
    if (payload.image) body.append("image", payload.image);
    return body;
}

type BannerListBody = {
    data: EditorBanner[];
    meta: AdminPageMeta;
    summary: EditorBannerSummary;
};

export async function getEditorBanners({ page, search, status }: EditorBannerParams): Promise<EditorBannerList> {
    const { data } = await api.get<BannerListBody>(BASE, {
        params: {
            page,
            limit: BANNERS_PER_PAGE,
            search: search || undefined,
            status: status === "all" ? undefined : status,
        },
    });

    return { items: data.data, meta: data.meta, summary: data.summary };
}

export async function createEditorBanner(payload: EditorBannerPayload): Promise<EditorBanner> {
    const { data } = await api.post<ApiResponse<EditorBanner>>(BASE, toFormData(payload), MULTIPART);
    return data.data;
}

export async function updateEditorBanner(id: number, payload: EditorBannerPayload): Promise<EditorBanner> {
    const { data } = await api.put<ApiResponse<EditorBanner>>(`${BASE}/${id}`, toFormData(payload), MULTIPART);
    return data.data;
}

export async function deleteEditorBanner(id: number): Promise<void> {
    await api.delete<ApiResponse<null>>(`${BASE}/${id}`);
}

export async function reorderEditorBanners(ids: number[]): Promise<void> {
    await api.patch<ApiResponse<EditorBanner[]>>(`${BASE}/reorder`, { ids });
}