"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    createAdminUser,
    deleteAdminUser,
    getAdminUsers,
    getAdminUserSummary,
    updateAdminUser,
} from "@/services/admin/admin-user-service";
import type { AdminUserCreatePayload, AdminUserParams, AdminUserUpdatePayload } from "@/types/admin/admin-user";

const ADMIN_USERS_KEY = ["admin", "users"] as const;

export function useAdminUsers(params: AdminUserParams) {
    return useQuery({
        queryKey: [...ADMIN_USERS_KEY, "list", params],
        queryFn: () => getAdminUsers(params),
        placeholderData: keepPreviousData,
    });
}

export function useAdminUserSummary() {
    return useQuery({
        queryKey: [...ADMIN_USERS_KEY, "summary"],
        queryFn: getAdminUserSummary,
    });
}

type SaveVariables =
    | { id: number; payload: AdminUserUpdatePayload }
    | { id?: undefined; payload: AdminUserCreatePayload };

export function useSaveAdminUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (variables: SaveVariables) =>
            variables.id !== undefined
                ? updateAdminUser(variables.id, variables.payload)
                : createAdminUser(variables.payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ADMIN_USERS_KEY }),
    });
}

export function useDeleteAdminUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteAdminUser,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ADMIN_USERS_KEY }),
    });
}
