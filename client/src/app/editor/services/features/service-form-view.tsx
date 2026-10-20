"use client";

import Link from "next/link";
import { ArrowLeft, CircleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useEditorService } from "@/hooks/editor/use-editor-services";
import { ServiceForm } from "./service-form";

function FormSkeleton() {
    return (
        <div aria-busy="true" aria-label="Memuat form layanan" className="grid gap-6 xl:grid-cols-3">
            <div className="space-y-6 xl:col-span-2">
                <Skeleton className="h-72 rounded-xl" />
                <Skeleton className="h-96 rounded-xl" />
            </div>
            <div className="space-y-6">
                <Skeleton className="h-64 rounded-xl" />
            </div>
        </div>
    );
}

type ServiceFormViewProps = {
    serviceId?: number;
};

export function ServiceFormView({ serviceId }: ServiceFormViewProps) {
    const isEdit = serviceId !== undefined;
    const validId = isEdit && Number.isInteger(serviceId) && serviceId > 0;

    const service = useEditorService(validId ? serviceId : undefined);

    const error = isEdit && !validId ? new Error("Layanan tidak ditemukan") : service.error;
    const ready = !isEdit || service.data;

    return (
        <div className="mx-auto w-full max-w-7xl space-y-6">
            <div className="space-y-3">
                <Button asChild variant="ghost" size="sm" className="-ml-2">
                    <Link href="/editor/services">
                        <ArrowLeft data-icon="inline-start" aria-hidden />
                        Kembali ke daftar layanan
                    </Link>
                </Button>
                <div className="space-y-1">
                    <h2 className="text-2xl font-semibold tracking-tight">{isEdit ? "Edit Layanan" : "Tambah Layanan"}</h2>
                    <p className="max-w-2xl text-sm text-muted-foreground">
                        {isEdit
                            ? "Perbarui informasi dan konten detail layanan."
                            : "Isi informasi layanan baru yang akan tampil di website FITALENTA."}
                    </p>
                </div>
            </div>

            {error ? (
                <Alert variant="destructive">
                    <CircleAlert aria-hidden />
                    <AlertTitle>Data layanan gagal dimuat</AlertTitle>
                    <AlertDescription>{error.message}</AlertDescription>
                </Alert>
            ) : ready ? (
                <ServiceForm key={service.data?.id ?? "new"} service={service.data} />
            ) : (
                <FormSkeleton />
            )}
        </div>
    );
}
