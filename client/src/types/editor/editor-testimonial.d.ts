export type EditorTestimonial = {
    id: number;
    clientName: string;
    company: string;
    content: string;
    rating: number;
    image: string | null;
    isFeatured: boolean;
    createdAt: string;
    updatedAt: string;
};

export type EditorTestimonialFilters = {
    search: string;
    featured: "all" | "true" | "false";
    rating: "all" | "1" | "2" | "3" | "4" | "5";
};

export type EditorTestimonialPayload = {
    clientName: string;
    company: string;
    content: string;
    rating: number;
    image: File | null;
};
