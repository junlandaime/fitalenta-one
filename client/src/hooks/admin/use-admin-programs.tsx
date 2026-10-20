"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    createAdminProgram,
    deleteAdminProgram,
    getAdminProgram,
    getAdminProgramOptions,
    getAdminPrograms,
    getAdminProgramSummary,
    updateAdminProgram,
} from "@/services/admin/admin-program-service";
import type { AdminProgramParams, AdminProgramPayload } from "@/types/admin/admin-program";

const ADMIN_PROGRAMS_KEY = ["admin", "programs"] as const;

export function useAdminPrograms(params: AdminProgramParams) {
    return useQuery({
        queryKey: [...ADMIN_PROGRAMS_KEY, "list", params],
        queryFn: () => getAdminPrograms(params),
        placeholderData: keepPreviousData,
    });
}

export function useAdminProgramSummary() {
    return useQuery({
        queryKey: [...ADMIN_PROGRAMS_KEY, "summary"],
        queryFn: getAdminProgramSummary,
    });
}

export function useAdminProgramOptions() {
    return useQuery({
        queryKey: [...ADMIN_PROGRAMS_KEY, "options"],
        queryFn: getAdminProgramOptions,
    });
}

export function useAdminProgram(id: number | undefined) {
    return useQuery({
        queryKey: [...ADMIN_PROGRAMS_KEY, "detail", id],
        queryFn: () => getAdminProgram(id as number),
        enabled: id !== undefined,
    });
}

type SaveVariables = { id?: number; payload: AdminProgramPayload };

export function useSaveAdminProgram() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: SaveVariables) =>
            id !== undefined ? updateAdminProgram(id, payload) : createAdminProgram(payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ADMIN_PROGRAMS_KEY }),
    });
}

export function useDeleteAdminProgram() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteAdminProgram,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ADMIN_PROGRAMS_KEY }),
    });
}
