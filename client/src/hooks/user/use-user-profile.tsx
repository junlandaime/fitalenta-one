"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isApiError } from "@/lib/api-error";
import { getMyProfile, updateMyProfile } from "@/services/user/user-profile-service";
import type { MyProfile, MyProfileUpdateResult } from "@/types/user/user-profile";

const PROFILE_KEY = ["user", "profile"] as const;

export function useMyProfile() {
    return useQuery({
        queryKey: PROFILE_KEY,
        queryFn: getMyProfile,
        staleTime: 60_000,
        retry: (count, error) => !(isApiError(error) && error.status === 401) && count < 2,
    });
}

export function useUpdateMyProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateMyProfile,
        onSuccess: (updated: MyProfileUpdateResult) => {
            queryClient.setQueryData<MyProfile>(PROFILE_KEY, (previous) =>
                previous ? { ...previous, ...updated } : previous,
            );
            queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
        },
    });
}
