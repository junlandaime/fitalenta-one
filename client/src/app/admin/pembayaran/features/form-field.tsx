import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";

type FieldProps = {
    id: string;
    label: string;
    required?: boolean;
    hint?: string;
    error?: string;
    children: ReactNode;
};

export function Field({ id, label, required, hint, error, children }: FieldProps) {
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

export const a11y = (id: string, error?: string, hint?: string) => ({
    "aria-invalid": Boolean(error),
    "aria-describedby": error ? `${id}-error` : hint ? `${id}-hint` : undefined,
});
