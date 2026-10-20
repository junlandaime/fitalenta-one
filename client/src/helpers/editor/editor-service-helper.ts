import { icons } from "lucide-react";
import type { ServiceFormValues, ServicePointValue } from "@/schemas/editor/editor-service";
import type { EditorService, EditorServicePayload } from "@/types/editor/editor-service";

export function createEmptyServiceForm(): ServiceFormValues {
    return {
        title: "",
        slug: "",
        icon: "",
        summary: "",
        intro: "",
        listTitle: "",
        secondParagraph: "",
        closing: "",
        images: "",
        isFeatured: false,
    };
}

export function toServiceFormValues(service: EditorService): ServiceFormValues {
    const { content } = service;
    return {
        title: service.title,
        slug: service.slug,
        icon: service.icon ?? "",
        summary: service.summary,
        intro: content.intro ?? "",
        listTitle: content.listTitle ?? "",
        secondParagraph: content.secondParagraph ?? "",
        closing: content.closing ?? "",
        images: content.images ?? "",
        isFeatured: service.isFeatured,
    };
}

export function toServicePoints(service?: EditorService): ServicePointValue[] {
    return (service?.content.points ?? []).map((point) => ({ title: point.title, desc: point.desc }));
}

type ServiceSchemaOutput = ServiceFormValues & { points: ServicePointValue[] };

export function toServicePayload(data: ServiceSchemaOutput): EditorServicePayload {
    const content: EditorServicePayload["content"] = { intro: data.intro };
    if (data.listTitle) content.listTitle = data.listTitle;
    if (data.points.length > 0) content.points = data.points;
    if (data.secondParagraph) content.secondParagraph = data.secondParagraph;
    if (data.images) content.images = data.images;
    if (data.closing) content.closing = data.closing;

    return {
        slug: data.slug,
        title: data.title,
        icon: data.icon,
        summary: data.summary,
        content,
        isFeatured: data.isFeatured,
    };
}

export function slugify(text: string) {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 120);
}

const toPascal = (name: string) =>
    name
        .trim()
        .split(/[-_\s]+/)
        .filter(Boolean)
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join("");

export function isKnownIcon(name: string) {
    return toPascal(name) in icons;
}
