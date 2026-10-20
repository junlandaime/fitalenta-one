import type { AdminPageMeta } from "@/types/pagination";

export type EditorServicePoint = {
    title: string;
    desc: string;
};

export type EditorServiceContent = {
    intro: string;
    listTitle?: string;
    points?: EditorServicePoint[];
    secondParagraph?: string;
    images?: string;
    closing?: string;
};

export type EditorService = {
    id: number;
    slug: string;
    title: string;
    icon: string | null;
    summary: string;
    content: EditorServiceContent;
    isFeatured: boolean;
    views: number;
    createdAt: string;
    updatedAt: string;
};

export type EditorServiceList = {
    services: EditorService[];
    meta: AdminPageMeta;
};

export type EditorServicePayload = {
    slug: string;
    title: string;
    icon: string;
    summary: string;
    content: EditorServiceContent;
    isFeatured: boolean;
};
