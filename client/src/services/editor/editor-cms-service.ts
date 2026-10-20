import { api } from "@/lib/axios";
import { getEditorArticles } from "@/services/editor/editor-article-service";
import { getEditorEvents } from "@/services/editor/editor-event-service";
import { getEditorGallery } from "@/services/editor/editor-gallery-service";
import type { ApiResponse } from "@/types/api";
import type { ContentCategory, EditorCmsSummary } from "@/types/editor/editor-content";

export async function getEditorCmsSummary(): Promise<EditorCmsSummary> {
    const { data } = await api.get<ApiResponse<EditorCmsSummary>>("/admin/cms/summary");
    return data.data;
}

export async function getContentCategories(): Promise<ContentCategory[]> {
    const results = await Promise.allSettled([getEditorArticles(1), getEditorEvents(1), getEditorGallery()]);

    const failed = results.filter((result): result is PromiseRejectedResult => result.status === "rejected");
    if (failed.length === results.length) throw failed[0].reason;

    const found = new Map<number, ContentCategory>();
    const collect = (category: ContentCategory | null) => {
        if (category) found.set(category.id, { id: category.id, name: category.name });
    };

    for (const result of results) {
        if (result.status !== "fulfilled") continue;
        const value = result.value;
        if (Array.isArray(value)) value.forEach((item) => collect(item.category));
        else if ("articles" in value) value.articles.forEach((item) => collect(item.category));
        else value.events.forEach((item) => collect(item.category));
    }

    return [...found.values()].sort((a, b) => a.name.localeCompare(b.name, "id"));
}
