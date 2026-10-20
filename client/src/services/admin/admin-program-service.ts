import { api } from "@/lib/axios";
import { PROGRAMS_PER_PAGE } from "@/constants/admin/admin-program-constant";
import type { ApiResponse } from "@/types/api";
import type { AdminPageMeta } from "@/types/pagination";
import type {
    AdminProgram,
    AdminProgramDetail,
    AdminProgramList,
    AdminProgramOptions,
    AdminProgramParams,
    AdminProgramPayload,
    AdminProgramSummary,
} from "@/types/admin/admin-program";

export async function getAdminProgramSummary(): Promise<AdminProgramSummary> {
    const { data } = await api.get<ApiResponse<AdminProgramSummary>>("/admin/programs/summary");
    return data.data;
}

export async function getAdminProgramOptions(): Promise<AdminProgramOptions> {
    const { data } = await api.get<ApiResponse<AdminProgramOptions>>("/admin/programs/options");
    return data.data;
}

export async function getAdminPrograms(params: AdminProgramParams): Promise<AdminProgramList> {
    const { data } = await api.get<{ success: boolean; data: AdminProgram[]; meta: AdminPageMeta }>(
        "/admin/programs",
        {
            params: {
                page: params.page,
                limit: PROGRAMS_PER_PAGE,
                search: params.search || undefined,
                categoryId: params.categoryId === "all" ? undefined : params.categoryId,
                status: params.status === "all" ? undefined : params.status,
                isRunning: params.running === "all" ? undefined : params.running,
            },
        },
    );
    return { programs: data.data, meta: data.meta };
}

export async function getAdminProgram(id: number): Promise<AdminProgramDetail> {
    const { data } = await api.get<ApiResponse<AdminProgramDetail>>(`/admin/programs/${id}`);
    return data.data;
}

export async function createAdminProgram(payload: AdminProgramPayload): Promise<AdminProgramDetail> {
    const { data } = await api.post<ApiResponse<AdminProgramDetail>>("/admin/programs", payload);
    return data.data;
}

export async function updateAdminProgram(id: number, payload: AdminProgramPayload): Promise<AdminProgramDetail> {
    const { data } = await api.put<ApiResponse<AdminProgramDetail>>(`/admin/programs/${id}`, payload);
    return data.data;
}

export async function deleteAdminProgram(id: number): Promise<void> {
    await api.delete<ApiResponse<null>>(`/admin/programs/${id}`);
}
