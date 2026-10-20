import { toDateInput } from "@/helpers/editor/editor-content-helper";
import type { GalleryFormValues } from "@/schemas/editor/editor-gallery";
import type { ContentCategory } from "@/types/editor/editor-content";
import type { EditorGalleryFilters, EditorGalleryItem } from "@/types/editor/editor-gallery";

export function createEmptyGalleryForm(categories: ContentCategory[]): GalleryFormValues {
    return {
        title: "",
        categoryId: categories.length === 1 ? String(categories[0].id) : "",
        description: "",
        eventDate: "",
        order: "0",
        isFeatured: false,
    };
}

export function toGalleryFormValues(item: EditorGalleryItem): GalleryFormValues {
    return {
        title: item.title,
        categoryId: String(item.categoryId),
        description: item.description ?? "",
        eventDate: toDateInput(item.eventDate),
        order: String(item.order),
        isFeatured: item.isFeatured,
    };
}

export function filterGallery(items: EditorGalleryItem[], { search, categoryId, featured }: EditorGalleryFilters) {
    const query = search.trim().toLowerCase();

    return items.filter((item) => {
        if (categoryId !== "all" && String(item.categoryId) !== categoryId) return false;
        if (featured !== "all" && String(item.isFeatured) !== featured) return false;
        if (!query) return true;
        return (
            item.title.toLowerCase().includes(query) ||
            (item.description ?? "").toLowerCase().includes(query) ||
            (item.category?.name ?? "").toLowerCase().includes(query)
        );
    });
}
