"use client";

import Link from "next/link";
import { ArrowLeft, CircleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useContentCategories } from "@/hooks/editor/use-editor-cms";
import { useEditorEvent } from "@/hooks/editor/use-editor-events";
import { EventForm } from "./event-form";

function FormSkeleton() {
    return (
        <div aria-busy="true" aria-label="Memuat form event" className="grid gap-6 xl:grid-cols-3">
            <div className="space-y-6 xl:col-span-2">
                <Skeleton className="h-96 rounded-xl" />
            </div>
            <div className="space-y-6">
                <Skeleton className="h-64 rounded-xl" />
                <Skeleton className="h-72 rounded-xl" />
            </div>
        </div>
    );
}

type EventFormViewProps = {
    eventId?: number;
};

export function EventFormView({ eventId }: EventFormViewProps) {
    const isEdit = eventId !== undefined;
    const validId = isEdit && Number.isInteger(eventId) && eventId > 0;

    const categories = useContentCategories();
    const event = useEditorEvent(validId ? eventId : undefined);

    const error = isEdit && !validId ? new Error("Event tidak ditemukan") : categories.error ?? event.error;
    const ready = categories.data && (!isEdit || event.data);

    return (
        <div className="mx-auto w-full max-w-7xl space-y-6">
            <div className="space-y-3">
                <Button asChild variant="ghost" size="sm" className="-ml-2">
                    <Link href="/editor/events">
                        <ArrowLeft data-icon="inline-start" aria-hidden />
                        Kembali ke daftar event
                    </Link>
                </Button>
                <div className="space-y-1">
                    <h2 className="text-2xl font-semibold tracking-tight">{isEdit ? "Edit Event" : "Tambah Event"}</h2>
                    <p className="max-w-2xl text-sm text-muted-foreground">
                        {isEdit
                            ? "Perbarui informasi, jadwal, dan gambar event."
                            : "Isi informasi event baru yang akan tampil di website FITALENTA."}
                    </p>
                </div>
            </div>

            {error ? (
                <Alert variant="destructive">
                    <CircleAlert aria-hidden />
                    <AlertTitle>Data event gagal dimuat</AlertTitle>
                    <AlertDescription>{error.message}</AlertDescription>
                </Alert>
            ) : ready ? (
                <EventForm key={event.data?.id ?? "new"} event={event.data} categories={categories.data} />
            ) : (
                <FormSkeleton />
            )}
        </div>
    );
}
