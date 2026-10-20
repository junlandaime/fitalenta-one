"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { EDITOR_CMS_KEY } from "@/hooks/editor/use-editor-cms";
import {
    createEditorEvent,
    deleteEditorEvent,
    getEditorEvent,
    getEditorEvents,
    updateEditorEvent,
} from "@/services/editor/editor-event-service";
import type { EditorEventPayload } from "@/types/editor/editor-event";

const EDITOR_EVENTS_KEY = ["editor", "events"] as const;

export function useEditorEvents(page: number) {
    return useQuery({
        queryKey: [...EDITOR_EVENTS_KEY, "list", page],
        queryFn: () => getEditorEvents(page),
        placeholderData: keepPreviousData,
    });
}

export function useEditorEvent(id: number | undefined) {
    return useQuery({
        queryKey: [...EDITOR_EVENTS_KEY, "detail", id],
        queryFn: () => getEditorEvent(id as number),
        enabled: id !== undefined,
    });
}

type SaveVariables = { id?: number; payload: EditorEventPayload };

function useInvalidateEvents() {
    const queryClient = useQueryClient();
    return () =>
        Promise.all([
            queryClient.invalidateQueries({ queryKey: EDITOR_EVENTS_KEY }),
            queryClient.invalidateQueries({ queryKey: EDITOR_CMS_KEY }),
        ]);
}

export function useSaveEditorEvent() {
    const invalidate = useInvalidateEvents();

    return useMutation({
        mutationFn: ({ id, payload }: SaveVariables) =>
            id !== undefined ? updateEditorEvent(id, payload) : createEditorEvent(payload),
        onSuccess: invalidate,
    });
}

export function useDeleteEditorEvent() {
    const invalidate = useInvalidateEvents();

    return useMutation({
        mutationFn: deleteEditorEvent,
        onSuccess: invalidate,
    });
}
