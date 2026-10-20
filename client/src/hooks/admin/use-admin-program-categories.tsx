"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    createAdminProgramCategory,
    deleteAdminProgramCategory,
    getAdminProgramCategories,
    updateAdminProgramCategory,
} from "@/services/admin/admin-program-category-service";
import type {
    AdminProgramCategoryCreatePayload,
    AdminProgramCategoryParams,
    AdminProgramCategoryUpdatePayload,
} from "@/types/admin/admin-program-category";

const ADMIN_PROGRAM_CATEGORIES_KEY = ["admin", "program-categories"] as const;
const ADMIN_PROGRAMS_KEY = ["admin", "programs"] as const;

export function useAdminProgramCategories(params: AdminProgramCategoryParams) {
    return useQuery({
        queryKey: [...ADMIN_PROGRAM_CATEGORIES_KEY, "list", params],
        queryFn: () => getAdminProgramCategories(params),
        placeholderData: keepPreviousData,
    });
}

function useInvalidateCategories() {
    const queryClient = useQueryClient();

    return () =>
        Promise.all([
            queryClient.invalidateQueries({ queryKey: ADMIN_PROGRAM_CATEGORIES_KEY }),
            // Opsi kategori & nama kategori pada modul program ikut berubah.
            queryClient.invalidateQueries({ queryKey: ADMIN_PROGRAMS_KEY }),
        ]);
}

type SaveVariables =
    | { id: number; payload: AdminProgramCategoryUpdatePayload }
    | { id?: undefined; payload: AdminProgramCategoryCreatePayload };

export function useSaveAdminProgramCategory() {
    const invalidate = useInvalidateCategories();

    return useMutation({
        mutationFn: (variables: SaveVariables) =>
            variables.id !== undefined
                ? updateAdminProgramCategory(variables.id, variables.payload)
                : createAdminProgramCategory(variables.payload),
        onSuccess: invalidate,
    });
}

export function useDeleteAdminProgramCategory() {
    const invalidate = useInvalidateCategories();

    return useMutation({
        mutationFn: deleteAdminProgramCategory,
        onSuccess: invalidate,
    });
}
