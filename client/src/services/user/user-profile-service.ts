import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { MyProfile, MyProfileUpdatePayload, MyProfileUpdateResult } from "@/types/user/user-profile";

const BASE_URL = "/user/profile";

export async function getMyProfile(): Promise<MyProfile> {
    const { data } = await api.get<ApiResponse<MyProfile>>(BASE_URL);
    return data.data;
}

export async function updateMyProfile(payload: MyProfileUpdatePayload): Promise<MyProfileUpdateResult> {
    const { data } = await api.put<ApiResponse<MyProfileUpdateResult>>(BASE_URL, payload);
    return data.data;
}
