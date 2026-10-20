"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { EDITOR_CMS_KEY } from "@/hooks/editor/use-editor-cms";
import {
    createEditorService,
    deleteEditorService,
    getEditorService,
    getEditorServices,
    updateEditorService,
} from "@/services/editor/editor-service-service";
import type { EditorServicePayload } from "@/types/editor/editor-service";

const EDITOR_SERVICES_KEY = ["editor", "services"] as const;

export function useEditorServices(page: number) {
    return useQuery({
        queryKey: [...EDITOR_SERVICES_KEY, "list", page],
        queryFn: () => getEditorServices(page),
        placeholderData: keepPreviousData,
    });
}

export function useEditorService(id: number | undefined) {
    return useQuery({
        queryKey: [...EDITOR_SERVICES_KEY, "detail", id],
        queryFn: () => getEditorService(id as number),
        enabled: id !== undefined,
    });
}

type SaveVariables = { id?: number; payload: EditorServicePayload };

function useInvalidateServices() {
    const queryClient = useQueryClient();
    return () =>
        Promise.all([
            queryClient.invalidateQueries({ queryKey: EDITOR_SERVICES_KEY }),
            queryClient.invalidateQueries({ queryKey: EDITOR_CMS_KEY }),
        ]);
}

export function useSaveEditorService() {
    const invalidate = useInvalidateServices();

    return useMutation({
        mutationFn: ({ id, payload }: SaveVariables) =>
            id !== undefined ? updateEditorService(id, payload) : createEditorService(payload),
        onSuccess: invalidate,
    });
}

export function useDeleteEditorService() {
    const invalidate = useInvalidateServices();

    return useMutation({
        mutationFn: deleteEditorService,
        onSuccess: invalidate,
    });
}
