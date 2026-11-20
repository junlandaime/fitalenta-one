import type { ContentCategory } from "@/types/editor-content";

export type EditorGalleryItem = {
    id: number;
    title: string;
    description: string | null;
    image: string;
    images?: string[] | null;
    categoryId: number;
    category: ContentCategory | null;
    isFeatured: boolean;
    eventDate: string | null;
    order: number;
    createdAt: string;
    updatedAt: string;
};

export type EditorGalleryFilters = {
    search: string;
    categoryId: string;
    featured: "all" | "true" | "false";
};

export type EditorGalleryPayload = {
    title: string;
    categoryId: number;
    description: string;
    eventDate: string | null;
    isFeatured: boolean;
    order: number;
    image: File | null;
    existingImages?: string[];
    newImages?: File[];
};