import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { EditorTestimonial, EditorTestimonialPayload } from "@/types/editor/editor-testimonial";

function toFormData(payload: EditorTestimonialPayload): FormData {
    const body = new FormData();
    body.append("clientName", payload.clientName);
    body.append("company", payload.company);
    body.append("content", payload.content);
    body.append("rating", String(payload.rating));
    if (payload.image) body.append("image", payload.image);
    return body;
}

const MULTIPART = { headers: { "Content-Type": "multipart/form-data" } };

export async function getEditorTestimonials(): Promise<EditorTestimonial[]> {
    const { data } = await api.get<ApiResponse<EditorTestimonial[]>>("/admin/testimonials");
    return data.data;
}

export async function createEditorTestimonial(payload: EditorTestimonialPayload): Promise<EditorTestimonial> {
    const { data } = await api.post<ApiResponse<EditorTestimonial>>(
        "/admin/testimonials",
        toFormData(payload),
        MULTIPART,
    );
    return data.data;
}

export async function updateEditorTestimonial(
    id: number,
    payload: EditorTestimonialPayload,
): Promise<EditorTestimonial> {
    const { data } = await api.put<ApiResponse<EditorTestimonial>>(
        `/admin/testimonials/${id}`,
        toFormData(payload),
        MULTIPART,
    );
    return data.data;
}

export async function deleteEditorTestimonial(id: number): Promise<void> {
    await api.delete<ApiResponse<null>>(`/admin/testimonials/${id}`);
}

export async function toggleEditorTestimonial(id: number): Promise<EditorTestimonial> {
    const { data } = await api.patch<ApiResponse<EditorTestimonial>>(`/admin/testimonials/${id}/toggle`);
    return data.data;
}
