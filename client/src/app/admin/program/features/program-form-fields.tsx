"use client";

import type { ComponentProps, ReactNode } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { ProgramForm } from "@/hooks/use-program-form";
import { formatIDR } from "@/lib/utils";
import type { ProgramFormValues } from "@/schemas/admin/admin-program";

type FieldName = keyof ProgramFormValues;
type StringField = { [K in FieldName]: ProgramFormValues[K] extends string ? K : never }[FieldName];

const CONTROL_CLASS = "h-10";
const fieldId = (name: FieldName) => `program-${name}`;

type FieldShellProps = {
    name: FieldName;
    label: string;
    required?: boolean;
    hint?: string;
    error?: string;
    children: ReactNode;
};

function FieldShell({ name, label, required, hint, error, children }: FieldShellProps) {
    const id = fieldId(name);

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

const a11y = (name: FieldName, error?: string, hint?: string) => ({
    "aria-invalid": Boolean(error),
    "aria-describedby": error ? `${fieldId(name)}-error` : hint ? `${fieldId(name)}-hint` : undefined,
});

type BaseFieldProps = {
    form: ProgramForm;
    name: StringField;
    label: string;
    required?: boolean;
    hint?: string;
};

type TextFieldProps = BaseFieldProps &
    Omit<ComponentProps<typeof Input>, "id" | "name" | "value" | "onChange" | "form">;

export function TextField({ form, name, label, required, hint, ...inputProps }: TextFieldProps) {
    const error = form.errors[name];

    return (
        <FieldShell name={name} label={label} required={required} hint={hint} error={error}>
            <Input
                id={fieldId(name)}
                value={form.values[name]}
                onChange={(event) => form.setValue(name, event.target.value)}
                className={CONTROL_CLASS}
                {...a11y(name, error, hint)}
                {...inputProps}
            />
        </FieldShell>
    );
}

type NumberFieldProps = BaseFieldProps & {
    currency?: boolean;
    min?: number;
    step?: number;
};

export function NumberField({ form, name, label, required, hint, currency, min = 0, step = 1 }: NumberFieldProps) {
    const error = form.errors[name];
    const raw = form.values[name];
    const preview = currency && raw !== "" && !Number.isNaN(Number(raw)) ? formatIDR(Number(raw)) : undefined;
    const shownHint = preview ?? hint;

    return (
        <FieldShell name={name} label={label} required={required} hint={shownHint} error={error}>
            <Input
                id={fieldId(name)}
                type="number"
                inputMode="numeric"
                min={min}
                step={step}
                value={raw}
                onChange={(event) => form.setValue(name, event.target.value)}
                onWheel={(event) => event.currentTarget.blur()}
                className={CONTROL_CLASS}
                {...a11y(name, error, shownHint)}
            />
        </FieldShell>
    );
}

type TextareaFieldProps = BaseFieldProps & { rows?: number };

export function TextareaField({ form, name, label, required, hint, rows = 4 }: TextareaFieldProps) {
    const error = form.errors[name];

    return (
        <FieldShell name={name} label={label} required={required} hint={hint} error={error}>
            <Textarea
                id={fieldId(name)}
                rows={rows}
                value={form.values[name]}
                onChange={(event) => form.setValue(name, event.target.value)}
                {...a11y(name, error, hint)}
            />
        </FieldShell>
    );
}

const EMPTY_VALUE = "__empty__";

type SelectFieldProps = BaseFieldProps & {
    options: { value: string; label: string }[];
    emptyLabel?: string;
    placeholder?: string;
};

export function SelectField({ form, name, label, required, hint, options, emptyLabel, placeholder }: SelectFieldProps) {
    const error = form.errors[name];
    const value = form.values[name];

    return (
        <FieldShell name={name} label={label} required={required} hint={hint} error={error}>
            <Select
                value={emptyLabel && value === "" ? EMPTY_VALUE : value}
                onValueChange={(next) => form.setValue(name, next === EMPTY_VALUE ? "" : next)}
            >
                <SelectTrigger
                    id={fieldId(name)}
                    className={`${CONTROL_CLASS} w-full`}
                    {...a11y(name, error, hint)}
                >
                    <SelectValue placeholder={placeholder ?? `Pilih ${label.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                    {emptyLabel && <SelectItem value={EMPTY_VALUE}>{emptyLabel}</SelectItem>}
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

type CheckboxFieldProps = {
    form: ProgramForm;
    name: "isRunning";
    label: string;
    description: string;
};

export function CheckboxField({ form, name, label, description }: CheckboxFieldProps) {
    return (
        <div className="flex items-start gap-3 rounded-lg border p-3">
            <Checkbox
                id={fieldId(name)}
                checked={form.values[name]}
                onCheckedChange={(checked) => form.setValue(name, checked === true)}
                className="mt-0.5"
                aria-describedby={`${fieldId(name)}-hint`}
            />
            <div className="space-y-1">
                <Label htmlFor={fieldId(name)}>{label}</Label>
                <p id={`${fieldId(name)}-hint`} className="text-sm text-muted-foreground">
                    {description}
                </p>
            </div>
        </div>
    );
}
