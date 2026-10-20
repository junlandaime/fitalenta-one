import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { Pagination } from "@/types/pagination";
import type { EditorEvent, EditorEventList, EditorEventPayload } from "@/types/editor/editor-event";

function toFormData(payload: EditorEventPayload): FormData {
    const body = new FormData();
    body.append("title", payload.title);
    body.append("description", payload.description);
    body.append("location", payload.location);
    body.append("eventDate", payload.eventDate);
    body.append("link", payload.link);
    body.append("categoryId", String(payload.categoryId));
    body.append("isFeatured", String(payload.isFeatured));
    if (payload.maxParticipants !== null) body.append("maxParticipants", String(payload.maxParticipants));
    if (payload.image) body.append("image", payload.image);
    return body;
}

const MULTIPART = { headers: { "Content-Type": "multipart/form-data" } };

export async function getEditorEvents(page: number): Promise<EditorEventList> {
    const { data } = await api.get<ApiResponse<{ events: EditorEvent[]; pagination: Pagination }>>("/admin/events", {
        params: { page },
    });
    const { events, pagination } = data.data;
    return {
        events,
        meta: {
            total: pagination.total,
            page: pagination.page,
            limit: pagination.perPage,
            totalPages: pagination.totalPages,
        },
    };
}

export async function getEditorEvent(id: number): Promise<EditorEvent> {
    const { data } = await api.get<ApiResponse<EditorEvent>>(`/admin/events/${id}`);
    return data.data;
}

export async function createEditorEvent(payload: EditorEventPayload): Promise<EditorEvent> {
    const { data } = await api.post<ApiResponse<EditorEvent>>("/admin/events", toFormData(payload), MULTIPART);
    return data.data;
}

export async function updateEditorEvent(id: number, payload: EditorEventPayload): Promise<EditorEvent> {
    const { data } = await api.put<ApiResponse<EditorEvent>>(`/admin/events/${id}`, toFormData(payload), MULTIPART);
    return data.data;
}

export async function deleteEditorEvent(id: number): Promise<void> {
    await api.delete<ApiResponse<null>>(`/admin/events/${id}`);
}
