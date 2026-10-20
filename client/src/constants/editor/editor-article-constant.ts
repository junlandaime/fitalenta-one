import type { EditorArticleStatus } from "@/types/editor/editor-article";

type StatusMeta = { label: string; variant: "default" | "secondary" | "outline" };

export const ARTICLE_STATUS_META: Record<EditorArticleStatus, StatusMeta> = {
    published: { label: "Terbit", variant: "default" },
    scheduled: { label: "Terjadwal", variant: "secondary" },
    draft: { label: "Draft", variant: "outline" },
};
