import { api } from "@/lib/axios";
import { PROGRAM_CATEGORIES_PER_PAGE } from "@/constants/admin/admin-program-category-constant";
import type { ApiResponse } from "@/types/api";
import type { AdminPageMeta } from "@/types/pagination";
import type {
    AdminProgramCategory,
    AdminProgramCategoryCreatePayload,
    AdminProgramCategoryList,
    AdminProgramCategoryParams,
    AdminProgramCategoryUpdatePayload,
} from "@/types/admin/admin-program-category";

const BASE_URL = "/admin/program-categories";

export async function getAdminProgramCategories({
    page,
    search,
}: AdminProgramCategoryParams): Promise<AdminProgramCategoryList> {
    const { data } = await api.get<{ success: boolean; data: AdminProgramCategory[]; meta: AdminPageMeta }>(BASE_URL, {
        params: {
            page,
            limit: PROGRAM_CATEGORIES_PER_PAGE,
            search: search || undefined,
        },
    });
    return { categories: data.data, meta: data.meta };
}

export async function createAdminProgramCategory(
    payload: AdminProgramCategoryCreatePayload,
): Promise<AdminProgramCategory> {
    const { data } = await api.post<ApiResponse<AdminProgramCategory>>(BASE_URL, payload);
    return data.data;
}

export async function updateAdminProgramCategory(
    id: number,
    payload: AdminProgramCategoryUpdatePayload,
): Promise<AdminProgramCategory> {
    const { data } = await api.put<ApiResponse<AdminProgramCategory>>(`${BASE_URL}/${id}`, payload);
    return data.data;
}

export async function deleteAdminProgramCategory(id: number): Promise<void> {
    await api.delete<ApiResponse<null>>(`${BASE_URL}/${id}`);
}
