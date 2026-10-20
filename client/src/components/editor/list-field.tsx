"use client";

import type { ReactNode } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { FieldShell, fieldA11y } from "@/components/editor/form-fields";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { moveItem, removeAt, updateAt } from "@/helpers/editor/editor-list-helper";

type RenderItemArgs<T> = {
    item: T;
    index: number;
    rowId: string;
    setItem: (next: T) => void;
    errorFor: (field?: string) => string | undefined;
};

type ListFieldProps<T> = {
    id: string;
    label: string;
    itemLabel: string;
    description?: string;
    items: T[];
    max?: number;
    errors?: Record<string, string>;
    createItem: () => T;
    onChange: (items: T[]) => void;
    renderItem: (args: RenderItemArgs<T>) => ReactNode;
};

export function ListField<T>({
    id,
    label,
    itemLabel,
    description,
    items,
    max,
    errors = {},
    createItem,
    onChange,
    renderItem,
}: ListFieldProps<T>) {
    const canAdd = max === undefined || items.length < max;
    const noun = itemLabel.toLowerCase();

    return (
        <div role="group" aria-labelledby={`${id}-label`} className="space-y-3">
            <div className="space-y-1">
                <p id={`${id}-label`} className="text-sm leading-none font-medium">
                    {label}
                </p>
                {description && <p className="text-sm text-muted-foreground">{description}</p>}
            </div>

            {items.length === 0 ? (
                <p className="rounded-lg border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">
                    Belum ada {noun}. Klik &quot;Tambah {noun}&quot; untuk menambahkan.
                </p>
            ) : (
                <ol className="space-y-3">
                    {items.map((item, index) => (
                        <li key={index} className="space-y-3 rounded-lg border p-3">
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-sm font-medium">
                                    {itemLabel} {index + 1}
                                </span>
                                <div className="flex gap-1">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon-sm"
                                        aria-label={`Naikkan ${noun} ${index + 1}`}
                                        disabled={index === 0}
                                        onClick={() => onChange(moveItem(items, index, index - 1))}
                                    >
                                        <ArrowUp aria-hidden />
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon-sm"
                                        aria-label={`Turunkan ${noun} ${index + 1}`}
                                        disabled={index === items.length - 1}
                                        onClick={() => onChange(moveItem(items, index, index + 1))}
                                    >
                                        <ArrowDown aria-hidden />
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon-sm"
                                        aria-label={`Hapus ${noun} ${index + 1}`}
                                        className="text-destructive hover:text-destructive"
                                        onClick={() => onChange(removeAt(items, index))}
                                    >
                                        <Trash2 aria-hidden />
                                    </Button>
                                </div>
                            </div>

                            {renderItem({
                                item,
                                index,
                                rowId: `${id}-${index}`,
                                setItem: (next) => onChange(updateAt(items, index, next)),
                                errorFor: (field) => errors[field ? `${index}.${field}` : String(index)],
                            })}
                        </li>
                    ))}
                </ol>
            )}

            {errors._ && (
                <p role="alert" className="text-sm text-destructive">
                    {errors._}
                </p>
            )}

            <div className="flex items-center gap-3">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={!canAdd}
                    onClick={() => onChange([...items, createItem()])}
                >
                    <Plus data-icon="inline-start" aria-hidden />
                    Tambah {noun}
                </Button>
                {!canAdd && <span className="text-xs text-muted-foreground">Maksimal {max} {noun}.</span>}
            </div>
        </div>
    );
}

type ListRowFieldProps = {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    hint?: string;
    required?: boolean;
    multiline?: boolean;
    rows?: number;
    placeholder?: string;
};

export function ListRowField({
    id,
    label,
    value,
    onChange,
    error,
    hint,
    required,
    multiline,
    rows = 3,
    placeholder,
}: ListRowFieldProps) {
    return (
        <FieldShell id={id} label={label} required={required} hint={hint} error={error}>
            {multiline ? (
                <Textarea
                    id={id}
                    rows={rows}
                    value={value}
                    placeholder={placeholder}
                    onChange={(event) => onChange(event.target.value)}
                    {...fieldA11y(id, error, hint)}
                />
            ) : (
                <Input
                    id={id}
                    value={value}
                    placeholder={placeholder}
                    onChange={(event) => onChange(event.target.value)}
                    className="h-10"
                    {...fieldA11y(id, error, hint)}
                />
            )}
        </FieldShell>
    );
}
