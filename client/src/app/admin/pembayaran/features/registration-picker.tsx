"use client";

import { useState } from "react";
import { Check, CircleAlert, Search, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminParticipants } from "@/hooks/admin/use-admin-selection-placements";
import { useDebounced } from "@/hooks/use-debounced";
import { cn } from "@/lib/utils";
import type { Participant } from "@/types/admin/selection-placement";
import { a11y } from "./form-field";

export type RegistrationOption = {
    id: number;
    code: string;
    name: string;
    email: string;
    program: string;
};

export function toRegistrationOption(row: Participant): RegistrationOption {
    return {
        id: row.registrationId,
        code: row.registrationCode,
        name: row.participant.name,
        email: row.participant.email,
        program: row.program.name,
    };
}

function Summary({ option }: { option: RegistrationOption }) {
    return (
        <div className="min-w-0 space-y-0.5">
            <div className="truncate text-sm font-semibold">{option.name}</div>
            <div className="truncate text-xs text-muted-foreground">{option.email}</div>
            <div className="truncate text-xs text-muted-foreground">
                <span className="font-mono">{option.code}</span>
                {option.program && ` · ${option.program}`}
            </div>
        </div>
    );
}

type Props = {
    id: string;
    selected: RegistrationOption | null;
    error?: string;
    onSelect: (option: RegistrationOption | null) => void;
};

export function RegistrationPicker({ id, selected, error, onSelect }: Props) {
    const [input, setInput] = useState("");
    const search = useDebounced(input.trim());
    const list = useAdminParticipants({ page: 1, search, selectionStatus: "all", placementStatus: "all" });

    if (selected) {
        return (
            <div className="flex items-center justify-between gap-3 rounded-lg border bg-muted/30 p-3">
                <div className="flex min-w-0 items-center gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950">
                        <UserRound className="size-4" aria-hidden />
                    </span>
                    <Summary option={selected} />
                </div>
                <Button type="button" variant="outline" size="sm" onClick={() => onSelect(null)}>
                    Ganti
                </Button>
            </div>
        );
    }

    const items = list.data?.items;
    const total = list.data?.meta.total ?? 0;

    return (
        <div className="space-y-2">
            <div className="relative">
                <Search
                    className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden
                />
                <Input
                    id={id}
                    type="search"
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    placeholder="Cari nama, email, atau kode pendaftaran..."
                    autoComplete="off"
                    className="h-10 pl-8"
                    {...a11y(id, error)}
                />
            </div>

            <div className={cn("max-h-56 overflow-y-auto rounded-lg border", error && "border-destructive")}>
                {list.isError ? (
                    <p className="flex items-center gap-2 p-3 text-sm text-destructive">
                        <CircleAlert className="size-4 shrink-0" aria-hidden />
                        {list.error.message}
                    </p>
                ) : !items ? (
                    <div className="space-y-2 p-3">
                        {Array.from({ length: 3 }, (_, index) => (
                            <Skeleton key={index} className="h-10 w-full" />
                        ))}
                    </div>
                ) : items.length === 0 ? (
                    <p className="p-4 text-center text-sm text-muted-foreground">Pendaftaran tidak ditemukan.</p>
                ) : (
                    <ul className={cn("divide-y transition-opacity", list.isPlaceholderData && "opacity-60")}>
                        {items.map((row) => {
                            const option = toRegistrationOption(row);
                            return (
                                <li key={option.id}>
                                    <button
                                        type="button"
                                        onClick={() => onSelect(option)}
                                        className="flex w-full items-center justify-between gap-3 p-3 text-left transition-colors outline-none hover:bg-muted focus-visible:bg-muted"
                                    >
                                        <Summary option={option} />
                                        <Check className="size-4 shrink-0 text-transparent" aria-hidden />
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>

            {items && total > items.length && (
                <p className="text-xs text-muted-foreground">
                    Menampilkan {items.length} dari {total} pendaftaran. Persempit dengan kata kunci pencarian.
                </p>
            )}
        </div>
    );
}
