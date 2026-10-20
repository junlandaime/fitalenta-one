"use client";

import { Lightbulb } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RadioGroup } from "@/components/ui/radio-group";
import { useRegistrationStore } from "@/store/registration-store";
import type { Program } from "@/types/program";
import { ProgramOption } from "./program-option";

export function ProgramStep({ programs }: { programs: Program[] }) {
    const programId = useRegistrationStore((state) => state.draft.programId);
    const error = useRegistrationStore((state) => state.errors.programId);
    const setField = useRegistrationStore((state) => state.setField);

    if (programs.length === 0) {
        return (
            <Alert>
                <Lightbulb aria-hidden />
                <AlertTitle>Belum ada program yang dibuka</AlertTitle>
                <AlertDescription>Pendaftaran akan tersedia kembali saat program berikutnya dibuka.</AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="space-y-4">
            <Alert>
                <Lightbulb aria-hidden />
                <AlertTitle>Tidak perlu terburu-buru memilih</AlertTitle>
                <AlertDescription>
                    Perhatikan durasi, jadwal, biaya, dan skema pembayaran masing-masing program.
                </AlertDescription>
            </Alert>

            <RadioGroup
                value={programId ? String(programId) : ""}
                onValueChange={(value) => setField("programId", Number(value))}
                aria-label="Pilihan program"
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "programId-error" : undefined}
                className="items-start gap-4 md:grid-cols-2"
            >
                {programs.map((program) => (
                    <ProgramOption key={program.id} program={program} />
                ))}
            </RadioGroup>

            {error && (
                <p id="programId-error" role="alert" className="text-sm text-destructive">
                    {error}
                </p>
            )}
        </div>
    );
}
