"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TESTIMONIAL_FEATURED_OPTIONS, TESTIMONIAL_RATING_OPTIONS } from "@/constants/editor/editor-testimonial-constant";
import type { EditorTestimonialFilters } from "@/types/editor/editor-testimonial";

type TestimonialToolbarProps = {
    filters: EditorTestimonialFilters;
    onChange: <K extends keyof EditorTestimonialFilters>(name: K, value: EditorTestimonialFilters[K]) => void;
};

export function TestimonialToolbar({ filters, onChange }: TestimonialToolbarProps) {
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
                    placeholder="Cari nama klien, perusahaan, atau isi testimoni..."
                    aria-label="Cari testimoni"
                    className="h-9 pl-8"
                />
            </div>

            <Select
                value={filters.featured}
                onValueChange={(value) => onChange("featured", value as EditorTestimonialFilters["featured"])}
            >
                <SelectTrigger className="h-9 w-full" aria-label="Filter unggulan">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {TESTIMONIAL_FEATURED_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select
                value={filters.rating}
                onValueChange={(value) => onChange("rating", value as EditorTestimonialFilters["rating"])}
            >
                <SelectTrigger className="h-9 w-full" aria-label="Filter rating">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {TESTIMONIAL_RATING_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
