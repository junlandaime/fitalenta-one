import { htmlToPlainText, looksLikeHtml, toDateTimeInput } from "@/helpers/editor/editor-content-helper";
import type { EventFormValues } from "@/schemas/editor/editor-event";
import type { ContentCategory } from "@/types/editor/editor-content";
import type { EditorEvent } from "@/types/editor/editor-event";

export function createEmptyEventForm(categories: ContentCategory[]): EventFormValues {
    return {
        title: "",
        description: "",
        location: "",
        eventDate: "",
        link: "",
        maxParticipants: "",
        categoryId: categories.length === 1 ? String(categories[0].id) : "",
        isFeatured: false,
    };
}

export function toEventFormValues(event: EditorEvent): EventFormValues {
    return {
        title: event.title,
        description: looksLikeHtml(event.description) ? htmlToPlainText(event.description) : event.description,
        location: event.location,
        eventDate: toDateTimeInput(event.eventDate),
        link: event.link ?? "",
        maxParticipants: event.maxParticipants === null ? "" : String(event.maxParticipants),
        categoryId: String(event.categoryId),
        isFeatured: event.isFeatured,
    };
}
