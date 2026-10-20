export const TESTIMONIALS_PER_PAGE = 10;

export const TESTIMONIAL_LIMITS = {
    clientName: 191,
    company: 191,
    content: 2000,
} as const;

const RATING_LABELS = ["Sangat kurang", "Kurang", "Cukup", "Baik", "Sangat baik"] as const;

export const RATING_OPTIONS = [5, 4, 3, 2, 1].map((value) => ({
    value: String(value),
    label: `${value} - ${RATING_LABELS[value - 1]}`,
}));

export const TESTIMONIAL_FEATURED_OPTIONS = [
    { value: "all", label: "Semua testimoni" },
    { value: "true", label: "Unggulan" },
    { value: "false", label: "Bukan unggulan" },
] as const;

export const TESTIMONIAL_RATING_OPTIONS = [
    { value: "all", label: "Semua rating" },
    { value: "5", label: "5 bintang" },
    { value: "4", label: "4 bintang" },
    { value: "3", label: "3 bintang" },
    { value: "2", label: "2 bintang" },
    { value: "1", label: "1 bintang" },
] as const;
