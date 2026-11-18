import type { Metadata } from "next";
import { CategoryFilter } from "@/app/(front)/programs/features/category-filter";
import { ProgramCard } from "@/app/(front)/programs/features/program-card";
import { getPrograms } from "@/services/program-service";
import type { ProgramCategory } from "@/types/program";

export const metadata: Metadata = {
    title: "Program - FITALENTA",
};

type Props = { searchParams: Promise<{ category?: string }> };

export default async function UserProgramsPage({ searchParams }: Props) {
    const { category } = await searchParams;
    const activeId = Number(category) || undefined;

    const all = await getPrograms();

    const categories = [
        ...new Map(all.flatMap((p) => (p.category ? [[p.category.id, p.category] as const] : []))).values(),
    ] satisfies ProgramCategory[];

    const programs = activeId ? all.filter((p) => p.categoryId === activeId) : all;

    return (
        <div className="bg-slate-50">
            <div className="mx-auto max-w-6xl px-4 py-10">
                <header className="space-y-2 text-center">
                    <h1 className="text-3xl font-extrabold tracking-tight text-primary md:text-4xl">Pilih Program</h1>
                    <p className="mx-auto max-w-2xl text-muted-foreground">
                        Jelajahi program FITALENTA dan daftar langsung dari akun Anda.
                    </p>
                </header>

                <div className="mt-8">
                    <CategoryFilter categories={categories} activeId={activeId} basePath="/user/program" />
                </div>

                {programs.length === 0 ? (
                    <p className="py-20 text-center text-slate-500">Belum ada program pada kategori ini.</p>
                ) : (
                    <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {programs.map((program) => (
                            <li key={program.id} className="flex">
                                <div className="w-full">
                                    <ProgramCard program={program} area="user" />
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}