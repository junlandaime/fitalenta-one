"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PROGRAM_STATUS_OPTIONS, RUNNING_FILTER_OPTIONS } from "@/constants/admin/admin-program-constant";
import type { AdminProgramOptions, AdminProgramParams } from "@/types/admin/admin-program";

type ProgramToolbarProps = {
    search: string;
    filters: Pick<AdminProgramParams, "categoryId" | "status" | "running">;
    options?: AdminProgramOptions;
    onSearchChange: (value: string) => void;
    onFilterChange: <K extends keyof ProgramToolbarProps["filters"]>(
        name: K,
        value: ProgramToolbarProps["filters"][K],
    ) => void;
};

export function ProgramToolbar({ search, filters, options, onSearchChange, onFilterChange }: ProgramToolbarProps) {
    return (
        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-[1fr_11rem_10rem_11rem]">
            <div className="relative md:col-span-2 xl:col-span-1">
                <Search
                    className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden
                />
                <Input
                    type="search"
                    value={search}
                    onChange={(event) => onSearchChange(event.target.value)}
                    placeholder="Cari nama atau format program..."
                    aria-label="Cari program"
                    className="h-9 pl-8"
                />
            </div>

            <Select value={filters.categoryId} onValueChange={(value) => onFilterChange("categoryId", value)}>
                <SelectTrigger className="h-9 w-full" aria-label="Filter kategori">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Semua kategori</SelectItem>
                    {options?.categories.map((category) => (
                        <SelectItem key={category.id} value={String(category.id)}>
                            {category.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select
                value={filters.status}
                onValueChange={(value) => onFilterChange("status", value as AdminProgramParams["status"])}
            >
                <SelectTrigger className="h-9 w-full" aria-label="Filter status">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Semua status</SelectItem>
                    {PROGRAM_STATUS_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select
                value={filters.running}
                onValueChange={(value) => onFilterChange("running", value as AdminProgramParams["running"])}
            >
                <SelectTrigger className="h-9 w-full" aria-label="Filter jadwal berjalan">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {RUNNING_FILTER_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
