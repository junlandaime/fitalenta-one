"use client";

import Link from "next/link";
import { ArrowLeft, CircleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminProgram, useAdminProgramOptions } from "@/hooks/admin/use-admin-programs";
import { ProgramForm } from "./program-form";

function FormSkeleton() {
    return (
        <div aria-busy="true" aria-label="Memuat form program" className="grid gap-6 xl:grid-cols-3">
            <div className="space-y-6 xl:col-span-2">
                <Skeleton className="h-96 rounded-xl" />
                <Skeleton className="h-72 rounded-xl" />
            </div>
            <div className="space-y-6">
                <Skeleton className="h-64 rounded-xl" />
                <Skeleton className="h-80 rounded-xl" />
            </div>
        </div>
    );
}

type ProgramFormViewProps = {
    programId?: number;
};

export function ProgramFormView({ programId }: ProgramFormViewProps) {
    const isEdit = programId !== undefined;
    const validId = isEdit && Number.isInteger(programId) && programId > 0;

    const options = useAdminProgramOptions();
    const program = useAdminProgram(validId ? programId : undefined);

    const error = isEdit && !validId ? new Error("Program tidak ditemukan") : options.error ?? program.error;
    const ready = options.data && (!isEdit || program.data);

    return (
        <div className="mx-auto w-full max-w-7xl space-y-6">
            <div className="space-y-3">
                <Button asChild variant="ghost" size="sm" className="-ml-2">
                    <Link href="/admin/program">
                        <ArrowLeft data-icon="inline-start" aria-hidden />
                        Kembali ke daftar program
                    </Link>
                </Button>
                <div className="space-y-1">
                    <h2 className="text-2xl font-semibold tracking-tight">
                        {isEdit ? "Edit Program" : "Tambah Program"}
                    </h2>
                    <p className="max-w-2xl text-sm text-muted-foreground">
                        {isEdit
                            ? "Perbarui informasi program, kuota, biaya, dan jadwal."
                            : "Isi informasi program baru yang akan tampil di website FITALENTA."}
                    </p>
                </div>
            </div>

            {error ? (
                <Alert variant="destructive">
                    <CircleAlert aria-hidden />
                    <AlertTitle>Data program gagal dimuat</AlertTitle>
                    <AlertDescription>{error.message}</AlertDescription>
                </Alert>
            ) : ready ? (
                <ProgramForm key={program.data?.id ?? "new"} program={program.data} options={options.data} />
            ) : (
                <FormSkeleton />
            )}
        </div>
    );
}
