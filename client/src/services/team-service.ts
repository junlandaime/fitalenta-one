import { api } from "@/lib/axios";
import type { Team } from "@/types/team";
import type { ApiResponse } from "@/types/api";

export async function getPublicExperts(): Promise<Team[]> {
    try {
        const { data } = await api.get<ApiResponse<Team[]>>("/team-members/experts");
        return (data.data ?? data) as Team[];
    } catch (error) {
        console.error("Failed to fetch experts:", error);
        return [];
    }
}

export async function getPublicTeamMembers(): Promise<Team[]> {
    try {
        const { data } = await api.get<ApiResponse<Team[]>>("/team-members");
        return (data.data ?? data) as Team[];
    } catch (error) {
        console.error("Failed to fetch team members:", error);
        return [];
    }
}
