"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BANNER_STATUS_OPTIONS } from "@/constants/editor/editor-banner-constant";
import type { EditorBannerParams } from "@/types/editor/editor-banner";

type BannerToolbarProps = {
    search: string;
    status: EditorBannerParams["status"];
    onSearchChange: (value: string) => void;
    onStatusChange: (value: EditorBannerParams["status"]) => void;
};

export function BannerToolbar({ search, status, onSearchChange, onStatusChange }: BannerToolbarProps) {
    return (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative flex-1">
                <Search
                    className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden
                />
                <Input
                    type="search"
                    value={search}
                    onChange={(event) => onSearchChange(event.target.value)}
                    placeholder="Cari judul atau subjudul..."
                    aria-label="Cari banner"
                    className="h-9 pl-8"
                />
            </div>

            <Select value={status} onValueChange={(value) => onStatusChange(value as EditorBannerParams["status"])}>
                <SelectTrigger className="h-9 w-full sm:w-44" aria-label="Filter status">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {BANNER_STATUS_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}