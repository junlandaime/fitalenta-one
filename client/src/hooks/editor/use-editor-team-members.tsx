"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { MemberKind } from "@/constants/editor/editor-team-member-constant";
import { EDITOR_CMS_KEY } from "@/hooks/editor/use-editor-cms";
import {
    createEditorMember,
    deleteEditorMember,
    getEditorMembers,
    updateEditorMember,
} from "@/services/editor/editor-team-member-service";
import type { EditorMemberParams, EditorMemberPayload } from "@/types/editor/editor-team-member";

const EDITOR_TEAM_KEY = ["editor", "team-members"] as const;

export function useEditorMembers(kind: MemberKind, params: EditorMemberParams) {
    return useQuery({
        queryKey: [...EDITOR_TEAM_KEY, kind, "list", params],
        queryFn: () => getEditorMembers(kind, params),
        placeholderData: keepPreviousData,
    });
}

type SaveVariables = { id?: number; payload: EditorMemberPayload };

function useInvalidateMembers() {
    const queryClient = useQueryClient();
    return () =>
        Promise.all([
            queryClient.invalidateQueries({ queryKey: EDITOR_TEAM_KEY }),
            queryClient.invalidateQueries({ queryKey: EDITOR_CMS_KEY }),
        ]);
}

export function useSaveEditorMember(kind: MemberKind) {
    const invalidate = useInvalidateMembers();

    return useMutation({
        mutationFn: ({ id, payload }: SaveVariables) =>
            id !== undefined ? updateEditorMember(kind, id, payload) : createEditorMember(kind, payload),
        onSuccess: invalidate,
    });
}

export function useDeleteEditorMember(kind: MemberKind) {
    const invalidate = useInvalidateMembers();

    return useMutation({
        mutationFn: (id: number) => deleteEditorMember(kind, id),
        onSuccess: invalidate,
    });
}