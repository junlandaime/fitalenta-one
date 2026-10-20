"use client";

import type { ComponentProps, ReactNode } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { CmsForm } from "@/hooks/editor/use-cms-form";

type FormValues = Record<string, string | boolean>;
type StringKeys<T extends FormValues> = { [K in keyof T & string]: T[K] extends string ? K : never }[keyof T & string];
type BooleanKeys<T extends FormValues> = { [K in keyof T & string]: T[K] extends boolean ? K : never }[keyof T & string];

const CONTROL_CLASS = "h-10";

type FieldShellProps = {
    id: string;
    label: string;
    required?: boolean;
    hint?: string;
    error?: string;
    children: ReactNode;
};

export function FieldShell({ id, label, required, hint, error, children }: FieldShellProps) {
    return (
        <div className="space-y-2">
            <Label htmlFor={id}>
                {label}
                {required && (
                    <span aria-hidden className="text-destructive">
                        *
                    </span>
                )}
            </Label>
            {children}
            {error ? (
                <p id={`${id}-error`} role="alert" className="text-sm text-destructive">
                    {error}
                </p>
            ) : hint ? (
                <p id={`${id}-hint`} className="text-sm text-muted-foreground">
                    {hint}
                </p>
            ) : null}
        </div>
    );
}

export const fieldA11y = (id: string, error?: string, hint?: string) => ({
    "aria-invalid": Boolean(error),
    "aria-describedby": error ? `${id}-error` : hint ? `${id}-hint` : undefined,
});

type BaseFieldProps<T extends FormValues> = {
    form: CmsForm<T>;
    name: StringKeys<T>;
    label: string;
    required?: boolean;
    hint?: string;
};

type TextFieldProps<T extends FormValues> = BaseFieldProps<T> &
    Omit<ComponentProps<typeof Input>, "id" | "name" | "value" | "onChange" | "form">;

export function TextField<T extends FormValues>({ form, name, label, required, hint, ...inputProps }: TextFieldProps<T>) {
    const id = `${form.id}-${name}`;
    const error = form.errors[name];

    return (
        <FieldShell id={id} label={label} required={required} hint={hint} error={error}>
            <Input
                id={id}
                value={String(form.values[name])}
                onChange={(event) => form.setValue(name, event.target.value as T[typeof name])}
                className={CONTROL_CLASS}
                {...fieldA11y(id, error, hint)}
                {...inputProps}
            />
        </FieldShell>
    );
}

type NumberFieldProps<T extends FormValues> = BaseFieldProps<T> & { min?: number; step?: number };

export function NumberField<T extends FormValues>({ form, name, label, required, hint, min = 0, step = 1 }: NumberFieldProps<T>) {
    const id = `${form.id}-${name}`;
    const error = form.errors[name];

    return (
        <FieldShell id={id} label={label} required={required} hint={hint} error={error}>
            <Input
                id={id}
                type="number"
                inputMode="numeric"
                min={min}
                step={step}
                value={String(form.values[name])}
                onChange={(event) => form.setValue(name, event.target.value as T[typeof name])}
                onWheel={(event) => event.currentTarget.blur()}
                className={CONTROL_CLASS}
                {...fieldA11y(id, error, hint)}
            />
        </FieldShell>
    );
}

type TextareaFieldProps<T extends FormValues> = BaseFieldProps<T> & { rows?: number };

export function TextareaField<T extends FormValues>({ form, name, label, required, hint, rows = 4 }: TextareaFieldProps<T>) {
    const id = `${form.id}-${name}`;
    const error = form.errors[name];

    return (
        <FieldShell id={id} label={label} required={required} hint={hint} error={error}>
            <Textarea
                id={id}
                rows={rows}
                value={String(form.values[name])}
                onChange={(event) => form.setValue(name, event.target.value as T[typeof name])}
                {...fieldA11y(id, error, hint)}
            />
        </FieldShell>
    );
}

type SelectFieldProps<T extends FormValues> = BaseFieldProps<T> & {
    options: { value: string; label: string }[];
    placeholder?: string;
};

export function SelectField<T extends FormValues>({ form, name, label, required, hint, options, placeholder }: SelectFieldProps<T>) {
    const id = `${form.id}-${name}`;
    const error = form.errors[name];
    const value = String(form.values[name]);

    return (
        <FieldShell id={id} label={label} required={required} hint={hint} error={error}>
            <Select value={value} onValueChange={(next) => form.setValue(name, next as T[typeof name])}>
                <SelectTrigger id={id} className={`${CONTROL_CLASS} w-full`} {...fieldA11y(id, error, hint)}>
                    <SelectValue placeholder={placeholder ?? `Pilih ${label.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </FieldShell>
    );
}

type CheckboxFieldProps<T extends FormValues> = {
    form: CmsForm<T>;
    name: BooleanKeys<T>;
    label: string;
    description: string;
};

export function CheckboxField<T extends FormValues>({ form, name, label, description }: CheckboxFieldProps<T>) {
    const id = `${form.id}-${name}`;

    return (
        <div className="flex items-start gap-3 rounded-lg border p-3">
            <Checkbox
                id={id}
                checked={Boolean(form.values[name])}
                onCheckedChange={(checked) => form.setValue(name, (checked === true) as T[typeof name])}
                className="mt-0.5"
                aria-describedby={`${id}-hint`}
            />
            <div className="space-y-1">
                <Label htmlFor={id}>{label}</Label>
                <p id={`${id}-hint`} className="text-sm text-muted-foreground">
                    {description}
                </p>
            </div>
        </div>
    );
}
