"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, CircleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminParticipant } from "@/hooks/admin/use-admin-selection-placements";
import { ParticipantCard } from "./participant-card";
import { SelectionForm } from "./selection-form";

function DetailSkeleton() {
    return (
        <div aria-busy="true" aria-label="Memuat data peserta" className="grid gap-6 xl:grid-cols-3">
            <div className="space-y-6 xl:col-span-2">
                <Skeleton className="h-64 rounded-xl" />
                <Skeleton className="h-96 rounded-xl" />
            </div>
            <Skeleton className="h-80 rounded-xl" />
        </div>
    );
}

type SelectionDetailViewProps = {
    registrationId: number;
};

export function SelectionDetailView({ registrationId }: SelectionDetailViewProps) {
    const searchParams = useSearchParams();
    const initialEditing = searchParams.get("mode") === "edit";

    const validId = Number.isInteger(registrationId) && registrationId > 0;
    const participant = useAdminParticipant(validId ? registrationId : undefined);

    const error = validId ? participant.error : new Error("Peserta tidak ditemukan");

    return (
        <div className="mx-auto w-full max-w-7xl space-y-6">
            <div className="space-y-3">
                <Button asChild variant="ghost" size="sm" className="-ml-2">
                    <Link href="/admin/seleksi">
                        <ArrowLeft data-icon="inline-start" aria-hidden />
                        Kembali ke daftar peserta
                    </Link>
                </Button>
                <div className="space-y-1">
                    <h2 className="text-2xl font-semibold tracking-tight">Kelola Seleksi &amp; Penyaluran</h2>
                    <p className="max-w-2xl text-sm text-muted-foreground">
                        Perbarui hasil seleksi diklat serta status penyaluran kerja peserta.
                    </p>
                </div>
            </div>

            {error ? (
                <Alert variant="destructive">
                    <CircleAlert aria-hidden />
                    <AlertTitle>Data peserta gagal dimuat</AlertTitle>
                    <AlertDescription>{error.message}</AlertDescription>
                </Alert>
            ) : participant.data ? (
                <div className="grid items-start gap-6 xl:grid-cols-3">
                    <div className="xl:col-span-2">
                        <SelectionForm participant={participant.data} initialEditing={initialEditing} />
                    </div>
                    <ParticipantCard data={participant.data} />
                </div>
            ) : (
                <DetailSkeleton />
            )}
        </div>
    );
}
