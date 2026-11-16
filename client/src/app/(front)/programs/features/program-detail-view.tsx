import Link from "next/link";
import { ArrowRight, Rocket } from "lucide-react";
import { isFull } from "@/helpers/program-helper";
import { cn } from "@/lib/utils";
import type { Program } from "@/types/program";
import { ProgramRegisterButton, type ProgramArea } from "./program-register-button";
import { CostSection } from "./section/cost";
import { InfoSection } from "./section/info";
import { OverviewSection } from "./section/overview";
import { RequirementsSection } from "./section/requirement";
import { SummarySection } from "./section/summary";
import { TimelineSection } from "./section/timeline";

type ProgramDetailViewProps = {
    program: Program;
    area?: ProgramArea;
};

export function ProgramDetailView({ program, area = "public" }: ProgramDetailViewProps) {
    const full = isFull(program);
    const listHref = area === "user" ? "/user/program" : "/programs";

    return (
        <section>
            <div className="bg-linear-to-br from-[#071d40] to-[#0e4a8f] text-white">
                <div
                    className={cn(
                        "mx-auto flex max-w-4xl flex-col items-center gap-5 px-4 pb-20 text-center",
                        area === "user" ? "pt-16" : "pt-32",
                    )}
                >
                    <div className="flex gap-2">
                        {program.category && <span className="rounded-md bg-white px-3 py-1 text-xs font-medium text-primary">{program.category.name}</span>}
                        {program.programFormat && <span className="rounded-md bg-white/15 px-3 py-1 text-xs font-medium ring-1 ring-white/30">{program.programFormat}</span>}
                    </div>
                    <h1 className="text-balance text-4xl font-bold md:text-6xl">{program.name}</h1>
                    {program.description && <p className="max-w-3xl text-lg leading-relaxed text-white/80">{program.description}</p>}
                    <div className="mt-2 flex flex-wrap justify-center gap-4">
                        {!full && (
                            <ProgramRegisterButton
                                programId={program.id}
                                area={area}
                                className="rounded-lg bg-white px-7 py-3 font-bold text-primary hover:opacity-90"
                            >
                                Daftar Sekarang
                            </ProgramRegisterButton>
                        )}
                        <Link href={listHref} className="rounded-lg px-7 py-3 font-bold text-white hover:bg-white/10">
                            Lihat Program Lain
                        </Link>
                    </div>
                </div>
            </div>
            <div className="bg-white">
                <div className="mx-auto max-w-6xl space-y-14 px-4 py-14">
                    <OverviewSection program={program} />
                    <TimelineSection program={program} />
                    <CostSection program={program} />
                    <SummarySection program={program} />
                    <RequirementsSection program={program} />
                    <InfoSection program={program} />

                    <div className="rounded-2xl bg-primary px-6 py-14 text-center text-white">
                        <Rocket className="mx-auto size-10" strokeWidth={1.5} aria-hidden />
                        <h2 className="mt-4 text-3xl font-extrabold">Tertarik dengan {program.name}?</h2>
                        <p className="mt-3 text-white/80">Lengkapi formulir pendaftaran dan mulai proses seleksi bersama FITALENTA.</p>
                        {full ? (
                            <p className="mt-6 inline-block rounded-lg bg-white/15 px-6 py-3 font-semibold">Kuota program sudah penuh</p>
                        ) : (
                            <ProgramRegisterButton
                                programId={program.id}
                                area={area}
                                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-bold text-primary hover:opacity-90"
                            >
                                Daftar Program <ArrowRight className="size-4" aria-hidden />
                            </ProgramRegisterButton>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}