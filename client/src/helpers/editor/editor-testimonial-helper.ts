import type { TestimonialFormValues } from "@/schemas/editor/editor-testimonial";
import type { EditorTestimonial, EditorTestimonialFilters } from "@/types/editor/editor-testimonial";

export function createEmptyTestimonialForm(): TestimonialFormValues {
    return { clientName: "", company: "", content: "", rating: "5" };
}

export function toTestimonialFormValues(item: EditorTestimonial): TestimonialFormValues {
    return {
        clientName: item.clientName,
        company: item.company,
        content: item.content,
        rating: String(item.rating),
    };
}

export function filterTestimonials(
    items: EditorTestimonial[],
    { search, featured, rating }: EditorTestimonialFilters,
) {
    const query = search.trim().toLowerCase();

    return items.filter((item) => {
        if (featured !== "all" && String(item.isFeatured) !== featured) return false;
        if (rating !== "all" && String(item.rating) !== rating) return false;
        if (!query) return true;
        return (
            item.clientName.toLowerCase().includes(query) ||
            item.company.toLowerCase().includes(query) ||
            item.content.toLowerCase().includes(query)
        );
    });
}

export function averageRating(items: EditorTestimonial[]) {
    if (items.length === 0) return 0;
    const total = items.reduce((sum, item) => sum + item.rating, 0);
    return Math.round((total / items.length) * 10) / 10;
}
