"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ROLE_FILTER_OPTIONS } from "@/constants/admin/admin-user-constant";
import type { AdminUserParams } from "@/types/admin/admin-user";

type UserToolbarProps = {
    search: string;
    role: AdminUserParams["role"];
    onSearchChange: (value: string) => void;
    onRoleChange: (value: AdminUserParams["role"]) => void;
};

export function UserToolbar({ search, role, onSearchChange, onRoleChange }: UserToolbarProps) {
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
                    placeholder="Cari nama, email, atau telepon..."
                    aria-label="Cari user"
                    className="h-9 pl-8"
                />
            </div>

            <Select value={role} onValueChange={(value) => onRoleChange(value as AdminUserParams["role"])}>
                <SelectTrigger className="h-9 w-full sm:w-44" aria-label="Filter tipe user">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {ROLE_FILTER_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
