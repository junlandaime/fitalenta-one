"use client";

import type { ComponentProps, ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useRegistrationStore } from "@/store/registration-store";
import type { StringFieldName } from "@/types/user/registration";

export const CONTROL_CLASS = "h-10";

type FieldShellProps = {
    id: string;
    label: string;
    required?: boolean;
    hint?: string;
    error?: string;
    className?: string;
    children: ReactNode;
};

export function FieldShell({ id, label, required, hint, error, className, children }: FieldShellProps) {
    return (
        <div className={cn("space-y-2", className)}>
            <Label id={`${id}-label`} htmlFor={id}>
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

export function fieldA11y(id: string, error?: string, hint?: string) {
    return {
        "aria-invalid": Boolean(error),
        "aria-describedby": error ? `${id}-error` : hint ? `${id}-hint` : undefined,
    };
}

type TextFieldProps = Omit<ComponentProps<typeof Input>, "id" | "name" | "value" | "onChange"> & {
    name: StringFieldName;
    label: string;
    hint?: string;
    required?: boolean;
    format?: (value: string) => string;
};

export function TextField({
    name,
    label,
    hint,
    required = true,
    format,
    className,
    ...inputProps
}: TextFieldProps) {
    const value = useRegistrationStore((state) => state.draft[name]);
    const error = useRegistrationStore((state) => state.errors[name]);
    const setField = useRegistrationStore((state) => state.setField);

    return (
        <FieldShell id={name} label={label} required={required} hint={hint} error={error}>
            <Input
                id={name}
                name={name}
                value={value}
                onChange={(event) =>
                    setField(name, format ? format(event.target.value) : event.target.value)
                }
                className={cn(CONTROL_CLASS, className)}
                {...fieldA11y(name, error, hint)}
                {...inputProps}
            />
        </FieldShell>
    );
}

type SelectFieldProps = {
    name: StringFieldName;
    label: string;
    options: readonly string[];
    placeholder?: string;
    hint?: string;
    required?: boolean;
};

export function SelectField({
    name,
    label,
    options,
    placeholder,
    hint,
    required = true,
}: SelectFieldProps) {
    const value = useRegistrationStore((state) => state.draft[name]);
    const error = useRegistrationStore((state) => state.errors[name]);
    const setField = useRegistrationStore((state) => state.setField);

    return (
        <FieldShell id={name} label={label} required={required} hint={hint} error={error}>
            <Select value={value} onValueChange={(next) => setField(name, next)}>
                <SelectTrigger id={name} className={cn(CONTROL_CLASS, "w-full")} {...fieldA11y(name, error, hint)}>
                    <SelectValue placeholder={placeholder ?? `Pilih ${label.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option} value={option}>
                            {option}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </FieldShell>
    );
}
