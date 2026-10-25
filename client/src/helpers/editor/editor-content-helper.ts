import { CONTENT_IMAGE_RULES, JAKARTA_OFFSET } from "@/constants/editor/editor-content-constant";
import { formatPlainText, isPastEvent } from "@/lib/utils";
import type { EditorArticle, EditorArticleStatus } from "@/types/editor/editor-article";

const HOUR_MS = 60 * 60 * 1000;

export function toDateTimeInput(iso?: string | null) {
    if (!iso) return "";
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return "";
    return new Date(date.getTime() + 7 * HOUR_MS).toISOString().slice(0, 16);
}

export function toDateInput(iso?: string | null) {
    return toDateTimeInput(iso).slice(0, 10);
}

export function fromDateTimeInput(value: string) {
    return `${value}:00${JAKARTA_OFFSET}`;
}

export function fromDateInput(value: string) {
    return `${value}T00:00:00${JAKARTA_OFFSET}`;
}

export function validateImageFile(file: File): string | null {
    if (!(CONTENT_IMAGE_RULES.types as readonly string[]).includes(file.type)) {
        return "Format gambar harus JPG, PNG, WEBP, atau GIF";
    }
    if (file.size > CONTENT_IMAGE_RULES.maxSize) return "Ukuran gambar maksimal 5 MB";
    return null;
}

export function looksLikeHtml(text: string) {
    return /<\/?[a-z][^>]*>/i.test(text) || /&[a-z0-9#]+;/i.test(text) || /\\r|\\n/.test(text);
}

export function htmlToPlainText(html: string) {
    return formatPlainText(html);
}

export function getArticleStatus(article: Pick<EditorArticle, "eventDate">): EditorArticleStatus {
    if (!article.eventDate) return "draft";
    return new Date(article.eventDate).getTime() > Date.now() ? "scheduled" : "published";
}

export function getEventStatus(eventDate: string) {
    return isPastEvent(eventDate) ? "past" : "upcoming";
}

export function excerptPreview(text: string, max = 90) {
    const clean = text.replace(/\s+/g, " ").trim();
    return clean.length > max ? `${clean.slice(0, max).trimEnd()}...` : clean;
}
