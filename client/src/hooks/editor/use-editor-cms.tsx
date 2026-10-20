"use client";

import { useQuery } from "@tanstack/react-query";
import { getContentCategories, getEditorCmsSummary } from "@/services/editor/editor-cms-service";

export const EDITOR_CMS_KEY = ["editor", "cms"] as const;

export function useEditorCmsSummary() {
    return useQuery({
        queryKey: [...EDITOR_CMS_KEY, "summary"],
        queryFn: getEditorCmsSummary,
    });
}

export function useContentCategories() {
    return useQuery({
        queryKey: [...EDITOR_CMS_KEY, "categories"],
        queryFn: getContentCategories,
        staleTime: 5 * 60_000,
    });
}
