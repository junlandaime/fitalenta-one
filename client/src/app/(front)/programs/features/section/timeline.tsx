import { toLines } from "@/lib/utils";
import { Program } from "@/types/program";

export function TimelineSection({ program }: { program: Program }) {
    const steps = toLines(program.timelineText);
    if (steps.length === 0) return null;
    return (
        <section>
            <h2 className="mb-8 text-center text-3xl font-extrabold uppercase tracking-wide text-primary">Timeline Program</h2>
            <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {steps.map((step, i) => (
                    // Efek sweep to bottom diterapkan ke list item ini
                    <li key={i} className="group relative z-0 flex flex-col items-center gap-4 overflow-hidden rounded-xl bg-white p-6 text-center shadow-sm ring-1 ring-slate-100 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:ring-primary before:absolute before:inset-0 before:z-0 before:origin-top before:scale-y-0 before:bg-primary before:transition-transform before:duration-500 before:ease-in-out hover:before:scale-y-100">
                        {/* Lingkaran angka jadi putih dengan teks biru saat dihover */}
                        <span className="relative z-10 grid size-12 place-items-center rounded-full bg-primary text-xl font-bold text-white transition-colors duration-300 group-hover:bg-white group-hover:text-primary">{i + 1}</span>
                        {/* Teks deskripsi berubah putih */}
                        <p className="relative z-10 text-sm leading-relaxed text-slate-500 transition-colors duration-300 group-hover:text-slate-100">{step}</p>
                    </li>
                ))}
            </ol>
        </section>
    );
}