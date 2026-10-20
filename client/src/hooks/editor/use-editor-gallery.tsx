"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { EDITOR_CMS_KEY } from "@/hooks/editor/use-editor-cms";
import {
    createEditorGalleryItem,
    deleteEditorGalleryItem,
    getEditorGallery,
    updateEditorGalleryItem,
} from "@/services/editor/editor-gallery-service";
import type { EditorGalleryPayload } from "@/types/editor/editor-gallery";

const EDITOR_GALLERY_KEY = ["editor", "gallery"] as const;

export function useEditorGallery() {
    return useQuery({
        queryKey: [...EDITOR_GALLERY_KEY, "list"],
        queryFn: getEditorGallery,
    });
}

type SaveVariables = { id?: number; payload: EditorGalleryPayload };

function useInvalidateGallery() {
    const queryClient = useQueryClient();
    return () =>
        Promise.all([
            queryClient.invalidateQueries({ queryKey: EDITOR_GALLERY_KEY }),
            queryClient.invalidateQueries({ queryKey: EDITOR_CMS_KEY }),
        ]);
}

export function useSaveEditorGalleryItem() {
    const invalidate = useInvalidateGallery();

    return useMutation({
        mutationFn: ({ id, payload }: SaveVariables) =>
            id !== undefined ? updateEditorGalleryItem(id, payload) : createEditorGalleryItem(payload),
        onSuccess: invalidate,
    });
}

export function useDeleteEditorGalleryItem() {
    const invalidate = useInvalidateGallery();

    return useMutation({
        mutationFn: deleteEditorGalleryItem,
        onSuccess: invalidate,
    });
}
