import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type {
    AdminPageMeta,
    AdminUser,
    AdminUserCreatePayload,
    AdminUserList,
    AdminUserParams,
    AdminUserSummary,
    AdminUserUpdatePayload,
} from "@/types/admin/admin-user";
import { USERS_PER_PAGE } from "@/constants/admin/admin-user-constant";

export async function getAdminUserSummary(): Promise<AdminUserSummary> {
    const { data } = await api.get<ApiResponse<AdminUserSummary>>("/admin/users/summary");
    return data.data;
}

export async function getAdminUsers({ page, search, role }: AdminUserParams): Promise<AdminUserList> {
    const { data } = await api.get<{ success: boolean; data: AdminUser[]; meta: AdminPageMeta }>("/admin/users", {
        params: {
            page,
            limit: USERS_PER_PAGE,
            search: search || undefined,
            role: role === "all" ? undefined : role,
        },
    });
    return { users: data.data, meta: data.meta };
}

export async function createAdminUser(payload: AdminUserCreatePayload): Promise<AdminUser> {
    const { data } = await api.post<ApiResponse<AdminUser>>("/admin/users", payload);
    return data.data;
}

export async function updateAdminUser(id: number, payload: AdminUserUpdatePayload): Promise<AdminUser> {
    const { data } = await api.put<ApiResponse<AdminUser>>(`/admin/users/${id}`, payload);
    return data.data;
}

export async function deleteAdminUser(id: number): Promise<void> {
    await api.delete<ApiResponse<null>>(`/admin/users/${id}`);
}
