import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { EditorGalleryItem, EditorGalleryPayload } from "@/types/editor/editor-gallery";

function toFormData(payload: EditorGalleryPayload): FormData {
    const body = new FormData();
    body.append("title", payload.title);
    body.append("categoryId", String(payload.categoryId));
    body.append("description", payload.description);
    body.append("isFeatured", String(payload.isFeatured));
    body.append("order", String(payload.order));
    if (payload.eventDate) body.append("eventDate", payload.eventDate);
    if (payload.image) body.append("image", payload.image);
    return body;
}

const MULTIPART = { headers: { "Content-Type": "multipart/form-data" } };

export async function getEditorGallery(): Promise<EditorGalleryItem[]> {
    const { data } = await api.get<ApiResponse<EditorGalleryItem[]>>("/admin/gallery");
    return data.data;
}

export async function createEditorGalleryItem(payload: EditorGalleryPayload): Promise<EditorGalleryItem> {
    const { data } = await api.post<ApiResponse<EditorGalleryItem>>("/admin/gallery", toFormData(payload), MULTIPART);
    return data.data;
}

export async function updateEditorGalleryItem(id: number, payload: EditorGalleryPayload): Promise<EditorGalleryItem> {
    const { data } = await api.put<ApiResponse<EditorGalleryItem>>(
        `/admin/gallery/${id}`,
        toFormData(payload),
        MULTIPART,
    );
    return data.data;
}

export async function deleteEditorGalleryItem(id: number): Promise<void> {
    await api.delete<ApiResponse<null>>(`/admin/gallery/${id}`);
}
