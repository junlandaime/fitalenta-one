export type GalleryCategory = {
    id: number;
    name: string;
};

export type GalleryItem = {
    id: number;
    title: string;
    description?: string | null;
    image: string;
    images?: string[] | null;
    eventDate?: string | null;
    isFeatured: boolean;
    order: number;
    categoryId: number;
    category?: GalleryCategory | null;
    createdAt?: string;
};

export type GalleryListData = GalleryItem[];

export type GalleryDetailData = {
    image: GalleryItem;
    relatedImages: GalleryItem[];
};