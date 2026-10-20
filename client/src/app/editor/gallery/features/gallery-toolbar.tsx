"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GALLERY_FEATURED_OPTIONS } from "@/constants/editor/editor-gallery-constant";
import type { ContentCategory } from "@/types/editor/editor-content";
import type { EditorGalleryFilters } from "@/types/editor/editor-gallery";

type GalleryToolbarProps = {
    filters: EditorGalleryFilters;
    categories: ContentCategory[];
    onChange: <K extends keyof EditorGalleryFilters>(name: K, value: EditorGalleryFilters[K]) => void;
};

export function GalleryToolbar({ filters, categories, onChange }: GalleryToolbarProps) {
    return (
        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-[1fr_12rem_12rem]">
            <div className="relative md:col-span-2 xl:col-span-1">
                <Search
                    className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden
                />
                <Input
                    type="search"
                    value={filters.search}
                    onChange={(event) => onChange("search", event.target.value)}
                    placeholder="Cari judul atau deskripsi gambar..."
                    aria-label="Cari gambar"
                    className="h-9 pl-8"
                />
            </div>

            <Select value={filters.categoryId} onValueChange={(value) => onChange("categoryId", value)}>
                <SelectTrigger className="h-9 w-full" aria-label="Filter kategori">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Semua kategori</SelectItem>
                    {categories.map((category) => (
                        <SelectItem key={category.id} value={String(category.id)}>
                            {category.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select
                value={filters.featured}
                onValueChange={(value) => onChange("featured", value as EditorGalleryFilters["featured"])}
            >
                <SelectTrigger className="h-9 w-full" aria-label="Filter jenis gambar">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {GALLERY_FEATURED_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
