"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { EDITOR_CMS_KEY } from "@/hooks/editor/use-editor-cms";
import {
    createEditorBanner,
    deleteEditorBanner,
    getEditorBanners,
    reorderEditorBanners,
    updateEditorBanner,
} from "@/services/editor/editor-banner-service";
import type { EditorBannerParams, EditorBannerPayload } from "@/types/editor/editor-banner";

const EDITOR_BANNERS_KEY = ["editor", "banners"] as const;

export function useEditorBanners(params: EditorBannerParams) {
    return useQuery({
        queryKey: [...EDITOR_BANNERS_KEY, "list", params],
        queryFn: () => getEditorBanners(params),
        placeholderData: keepPreviousData,
    });
}

type SaveVariables = { id?: number; payload: EditorBannerPayload };

function useInvalidateBanners() {
    const queryClient = useQueryClient();
    return () =>
        Promise.all([
            queryClient.invalidateQueries({ queryKey: EDITOR_BANNERS_KEY }),
            queryClient.invalidateQueries({ queryKey: EDITOR_CMS_KEY }),
        ]);
}

export function useSaveEditorBanner() {
    const invalidate = useInvalidateBanners();

    return useMutation({
        mutationFn: ({ id, payload }: SaveVariables) =>
            id !== undefined ? updateEditorBanner(id, payload) : createEditorBanner(payload),
        onSuccess: invalidate,
    });
}

export function useDeleteEditorBanner() {
    const invalidate = useInvalidateBanners();

    return useMutation({
        mutationFn: deleteEditorBanner,
        onSuccess: invalidate,
    });
}

export function useReorderEditorBanners() {
    const invalidate = useInvalidateBanners();

    return useMutation({
        mutationFn: reorderEditorBanners,
        onSuccess: invalidate,
    });
}