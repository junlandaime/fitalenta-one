import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { Pagination } from "@/types/pagination";
import type { EditorService, EditorServiceList, EditorServicePayload } from "@/types/editor/editor-service";

export async function getEditorServices(page: number): Promise<EditorServiceList> {
    const { data } = await api.get<ApiResponse<{ services: EditorService[]; pagination: Pagination }>>(
        "/admin/services",
        { params: { page } },
    );
    const { services, pagination } = data.data;
    return {
        services,
        meta: {
            total: pagination.total,
            page: pagination.page,
            limit: pagination.perPage,
            totalPages: pagination.totalPages,
        },
    };
}

export async function getEditorService(id: number): Promise<EditorService> {
    const { data } = await api.get<ApiResponse<EditorService>>(`/admin/services/${id}`);
    return data.data;
}

export async function createEditorService(payload: EditorServicePayload): Promise<EditorService> {
    const { data } = await api.post<ApiResponse<EditorService>>("/admin/services", payload);
    return data.data;
}

export async function updateEditorService(id: number, payload: EditorServicePayload): Promise<EditorService> {
    const { data } = await api.put<ApiResponse<EditorService>>(`/admin/services/${id}`, payload);
    return data.data;
}

export async function deleteEditorService(id: number): Promise<void> {
    await api.delete<ApiResponse<null>>(`/admin/services/${id}`);
}
