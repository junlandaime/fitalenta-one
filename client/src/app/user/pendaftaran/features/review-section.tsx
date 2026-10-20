import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

type ReviewSectionProps = {
    title: string;
    onEdit: () => void;
    children: ReactNode;
};

export function ReviewSection({ title, onEdit, children }: ReviewSectionProps) {
    return (
        <section className="space-y-3 border-t pt-6 first:border-t-0 first:pt-0">
            <div className="flex items-center justify-between gap-3">
                <h3 className="text-base leading-none font-semibold">{title}</h3>
                <Button type="button" variant="ghost" size="sm" onClick={onEdit}>
                    Ubah
                </Button>
            </div>
            <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">{children}</dl>
        </section>
    );
}

type ReviewItemProps = {
    label: string;
    value?: string | null;
    wide?: boolean;
};

export function ReviewItem({ label, value, wide }: ReviewItemProps) {
    return (
        <div className={wide ? "min-w-0 sm:col-span-2" : "min-w-0"}>
            <dt className="text-xs text-muted-foreground">{label}</dt>
            <dd className="text-sm font-medium wrap-break-word">{value || "-"}</dd>
        </div>
    );
}
