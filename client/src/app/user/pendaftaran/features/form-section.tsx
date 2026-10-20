"use client";

import { useId, type ReactNode } from "react";

export const FIELD_GRID = "grid gap-4 sm:grid-cols-2";

type FormSectionProps = {
    title: string;
    description?: string;
    action?: ReactNode;
    children: ReactNode;
};

export function FormSection({ title, description, action, children }: FormSectionProps) {
    const headingId = useId();

    return (
        <section aria-labelledby={headingId} className="space-y-4 border-t pt-6 first:border-t-0 first:pt-0">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                    <h3 id={headingId} className="text-base leading-none font-semibold">
                        {title}
                    </h3>
                    {description && <p className="text-sm text-muted-foreground">{description}</p>}
                </div>
                {action}
            </div>
            {children}
        </section>
    );
}
