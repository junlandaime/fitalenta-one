"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { EDITOR_CMS_KEY } from "@/hooks/editor/use-editor-cms";
import {
    createEditorArticle,
    deleteEditorArticle,
    getEditorArticle,
    getEditorArticles,
    updateEditorArticle,
} from "@/services/editor/editor-article-service";
import type { EditorArticlePayload } from "@/types/editor/editor-article";

const EDITOR_ARTICLES_KEY = ["editor", "articles"] as const;

export function useEditorArticles(page: number) {
    return useQuery({
        queryKey: [...EDITOR_ARTICLES_KEY, "list", page],
        queryFn: () => getEditorArticles(page),
        placeholderData: keepPreviousData,
    });
}

export function useEditorArticle(id: number | undefined) {
    return useQuery({
        queryKey: [...EDITOR_ARTICLES_KEY, "detail", id],
        queryFn: () => getEditorArticle(id as number),
        enabled: id !== undefined,
    });
}

type SaveVariables = { id?: number; payload: EditorArticlePayload };

function useInvalidateArticles() {
    const queryClient = useQueryClient();
    return () =>
        Promise.all([
            queryClient.invalidateQueries({ queryKey: EDITOR_ARTICLES_KEY }),
            queryClient.invalidateQueries({ queryKey: EDITOR_CMS_KEY }),
        ]);
}

export function useSaveEditorArticle() {
    const invalidate = useInvalidateArticles();

    return useMutation({
        mutationFn: ({ id, payload }: SaveVariables) =>
            id !== undefined ? updateEditorArticle(id, payload) : createEditorArticle(payload),
        onSuccess: invalidate,
    });
}

export function useDeleteEditorArticle() {
    const invalidate = useInvalidateArticles();

    return useMutation({
        mutationFn: deleteEditorArticle,
        onSuccess: invalidate,
    });
}
