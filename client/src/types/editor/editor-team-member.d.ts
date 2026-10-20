import type { AdminPageMeta } from "@/types/pagination";

export type EditorMember = {
    id: number;
    name: string;
    position: string;
    bio: string | null;
    image: string | null;
    order: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
};

export type EditorMemberSummary = {
    total: number;
    active: number;
    inactive: number;
};

export type EditorMemberList = {
    items: EditorMember[];
    meta: AdminPageMeta;
    summary: EditorMemberSummary;
};

export type EditorMemberParams = {
    page: number;
    search: string;
    isActive: "all" | "true" | "false";
};

export type EditorMemberPayload = {
    name: string;
    position: string;
    bio: string;
    order: number;
    isActive: boolean;
    image: File | null;
    removeImage: boolean;
};