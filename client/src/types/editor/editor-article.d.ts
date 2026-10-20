import type { AdminPageMeta } from "@/types/pagination";
import type { ContentCategory } from "@/types/editor-content";

export type EditorArticleStatus = "published" | "scheduled" | "draft";

export type EditorArticle = {
    id: number;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    image: string | null;
    eventDate: string | null;
    isFeatured: boolean;
    categoryId: number;
    category: ContentCategory | null;
    author: { id: number; name: string } | null;
    views: number;
    createdAt: string;
    updatedAt: string;
};

export type EditorArticleList = {
    articles: EditorArticle[];
    meta: AdminPageMeta;
};

export type EditorArticlePayload = {
    title: string;
    excerpt: string;
    content: string;
    categoryId: number;
    publishedAt: string | null;
    isFeatured: boolean;
    image: File | null;
};
