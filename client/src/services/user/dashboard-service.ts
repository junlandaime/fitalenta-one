import { api } from "@/lib/axios";
import type { DashboardData } from "@/types/user/dashboard";
import type { ApiResponse } from "@/types/api"

export async function getUserDashboard(): Promise<DashboardData> {
    const { data } = await api.get<ApiResponse<DashboardData>>("/user/dashboard");
    return data.data;
}