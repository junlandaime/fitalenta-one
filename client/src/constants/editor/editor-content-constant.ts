export const CONTENT_IMAGE_RULES = {
    maxSize: 5 * 1024 * 1024,
    types: ["image/jpeg", "image/png", "image/webp", "image/gif"],
    accept: "image/jpeg,image/png,image/webp,image/gif",
    label: "JPG, PNG, WEBP, atau GIF • Maksimal 5 MB",
} as const;

export const CONTENT_LIMITS = {
    short: 191,
    excerpt: 500,
    long: 20000,
    galleryDescription: 5000,
    participants: 1_000_000,
    order: 9999,
} as const;

export const JAKARTA_OFFSET = "+07:00";
