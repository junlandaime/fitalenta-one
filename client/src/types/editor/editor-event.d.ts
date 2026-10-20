import type { AdminPageMeta } from "@/types/pagination";
import type { ContentCategory } from "@/types/editor-content";

export type EditorEvent = {
    id: number;
    title: string;
    slug: string;
    description: string;
    eventDate: string;
    location: string;
    link: string | null;
    isFeatured: boolean;
    maxParticipants: number | null;
    image: string | null;
    categoryId: number;
    category: ContentCategory | null;
    views: number;
    createdAt: string;
    updatedAt: string;
};

export type EditorEventList = {
    events: EditorEvent[];
    meta: AdminPageMeta;
};

export type EditorEventPayload = {
    title: string;
    description: string;
    location: string;
    eventDate: string;
    link: string;
    maxParticipants: number | null;
    categoryId: number;
    isFeatured: boolean;
    image: File | null;
};
