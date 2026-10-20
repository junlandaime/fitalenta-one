"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

type CategoryToolbarProps = {
    search: string;
    onSearchChange: (value: string) => void;
};

export function CategoryToolbar({ search, onSearchChange }: CategoryToolbarProps) {
    return (
        <div className="relative">
            <Search
                className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
            />
            <Input
                type="search"
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Cari nama kategori..."
                aria-label="Cari kategori program"
                className="h-9 pl-8"
            />
        </div>
    );
}
