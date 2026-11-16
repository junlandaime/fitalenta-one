import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ProgramCategory } from "@/types/program";

type Props = {
    categories: ProgramCategory[];
    activeId?: number;
    basePath?: string;
};

const base = "rounded-full px-6 py-2.5 text-sm font-semibold transition";
const active = "bg-secondary text-white shadow-sm";
const idle = "bg-white text-primary ring-1 ring-slate-200 hover:bg-slate-50";

export function CategoryFilter({ categories, activeId, basePath = "/programs" }: Props) {
    if (categories.length === 0) return null;

    return (
        <nav aria-label="Filter kategori program" className="flex flex-wrap justify-center gap-3">
            <Link href={basePath} aria-current={!activeId ? "page" : undefined} className={cn(base, !activeId ? active : idle)}>
                Semua Program
            </Link>
            {categories.map((category) => (
                <Link
                    key={category.id}
                    href={`${basePath}?category=${category.id}`}
                    aria-current={activeId === category.id ? "page" : undefined}
                    className={cn(base, activeId === category.id ? active : idle)}
                >
                    {category.name}
                </Link>
            ))}
        </nav>
    );
}