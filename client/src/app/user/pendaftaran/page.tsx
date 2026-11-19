import type { Metadata } from "next";
import Link from "next/link";
import { isFull } from "@/helpers/program-helper";
import { safely } from "@/lib/utils";
import { getPrograms } from "@/services/program-service";
import { RegistrationIntroWizard } from "./features/registration-intro-wizard";

export const metadata: Metadata = {
    title: "Pendaftaran Program - FITALENTA",
    robots: { index: false },
};

type PageProps = {
    searchParams: Promise<{ program?: string }>;
};

export default async function RegistrationPage({ searchParams }: PageProps) {
    const { program } = await searchParams;

    const all = await safely(getPrograms, [], "pendaftaran-programs");
    const programs = all
        .filter((item) => item.status !== "inactive")
        .sort((a, b) => a.sortOrder - b.sortOrder);

    const requestedId = Number(program);
    const initialProgramId = programs.some((item) => item.id === requestedId && !isFull(item))
        ? requestedId
        : undefined;

    return (
        <main className="bg-linear-to-b from-slate-50 to-white">
            <div className="mx-auto max-w-4xl space-y-8 px-4 py-10">
                <RegistrationIntroWizard
                    programs={programs}
                    initialProgramId={initialProgramId}
                />

                <p className="text-center text-sm text-muted-foreground">
                    Mengalami kendala saat mengisi formulir?{" "}
                    <Link href="/contact" className="font-medium text-primary hover:underline">
                        Hubungi tim FITALENTA
                    </Link>
                </p>
            </div>
        </main>
    );
}