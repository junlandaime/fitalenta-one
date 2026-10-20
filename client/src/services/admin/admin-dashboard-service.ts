import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type {
    AdminDashboardSummary,
    AdminFilterOptions,
    AdminRegistrationList,
    AdminRegistrationListItem,
    AdminRegistrationQuery,
    PaginationMeta,
} from "@/types/admin/admin-dashboard";

export async function getAdminDashboardSummary(): Promise<AdminDashboardSummary> {
    const { data } = await api.get<ApiResponse<AdminDashboardSummary>>("/admin/dashboard/summary");
    return data.data;
}

export async function getAdminFilterOptions(): Promise<AdminFilterOptions> {
    const { data } = await api.get<ApiResponse<AdminFilterOptions>>("/admin/dashboard/filters");
    return data.data;
}

type RegistrationsResponse = {
    success: boolean;
    data: AdminRegistrationListItem[];
    meta: PaginationMeta;
};

export async function getAdminRegistrations(query: AdminRegistrationQuery): Promise<AdminRegistrationList> {
    const { search, programId, paymentStatus, selectionStatus, placementStatus, page, limit } = query;

    const { data: body } = await api.get<RegistrationsResponse>("/admin/dashboard/registrations", {
        params: {
            page,
            limit,
            ...(search.trim() && { search: search.trim() }),
            ...(programId && { programId: Number(programId) }),
            ...(paymentStatus && { paymentStatus }),
            ...(selectionStatus && { selectionStatus }),
            ...(placementStatus && { placementStatus }),
        },
    });

    return { items: body.data, meta: body.meta };
}