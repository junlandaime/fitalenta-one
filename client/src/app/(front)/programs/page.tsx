import type { Metadata } from "next";
import type { ProgramCategory } from "@/types/program";
import { getPrograms } from "@/services/program-service";
import { CategoryFilter } from "./features/category-filter";
import { ProgramCard } from "./features/program-card";
import PageHero from "@/components/common/page-hero";
import SlideIn from "@/components/common/slide-in"; // Import komponen animasi kita

export const metadata: Metadata = {
    title: "Program - FITALENTA",
    description: "Persiapkan kompetensi, karier, dan peluang kerja Anda melalui program FITALENTA.",
};

type Props = { searchParams: Promise<{ category?: string }> };

export default async function ProgramsPage({ searchParams }: Props) {
    const { category } = await searchParams;
    const activeId = Number(category) || undefined;

    const all = await getPrograms();

    const categories = [
        ...new Map(
            all.flatMap((p) => (p.category ? [[p.category.id, p.category] as const] : [])),
        ).values(),
    ] satisfies ProgramCategory[];

    const programs = activeId ? all.filter((p) => p.categoryId === activeId) : all;

    return (
        <>
            <PageHero
                badge="Program FITALENTA"
                title="Our Programs"
                subtitle="Persiapkan kompetensi, karier, dan peluang kerja Anda melalui program FITALENTA."
                crumbs={[{ label: "Home", href: "/" }, { label: "Programs" }]}
                bgImage="/bgourprogram.webp"
            />

            <section className="bg-slate-50 py-12 overflow-hidden">
                <div className="mx-auto max-w-6xl px-4">
                    
                    <SlideIn direction="down" delay={0.1}>
                        <CategoryFilter categories={categories} activeId={activeId} />
                    </SlideIn>

                    {programs.length === 0 ? (
                        <p className="py-20 text-center text-slate-500">Belum ada program pada kategori ini.</p>
                    ) : (
                        <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {programs.map((program, index) => (
                                <li key={program.id} className="flex h-full w-full">
                                    <div className="w-full h-full">
                                        <SlideIn direction="up" delay={index * 0.15}>
                                            <ProgramCard program={program} />
                                        </SlideIn>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </section>
        </>
    );
}