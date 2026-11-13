import Link from "next/link";
import { ArrowRight, Rocket } from "lucide-react";
import SlideIn from "@/components/common/slide-in";
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

    let bgImage = "";
    const fullText = `${program.category?.name || ""} ${program.name || ""} ${program.description || ""}`.toLowerCase();

    if (fullText.includes("gijinkoku") || fullText.includes("gijingoku") || fullText.includes("engineer")) {
        bgImage = "url(/cardgijingoku2.png)";
    } else if (fullText.includes("korea")) {
        bgImage = "url(/belajarbahasakorea.png)";
    } else if (
        fullText.includes("jepang") ||
        fullText.includes("tokutei") ||
        fullText.includes("jlpt") ||
        fullText.includes("ssw")
    ) {
        bgImage = "url(/belajarbahasa.png)";
    }

    return (
        <section>
            <div
                className={cn(
                    "relative flex min-h-[55vh] flex-col justify-center bg-cover bg-center text-white",
                    !bgImage && "bg-linear-to-br from-[#071d40] to-[#0e4a8f]",
                )}
                style={bgImage ? { backgroundImage: bgImage } : {}}
            >
                {bgImage && (
                    <div className="absolute inset-0 bg-gradient-to-b from-[#071d40]/90 via-[#071d40]/40 to-[#071d40]/90" />
                )}

                <SlideIn direction="up">
                    <div
                        className={cn(
                            "relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center gap-5 px-4 pb-20 text-center",
                            area === "user" ? "pt-16" : "pt-32",
                        )}
                    >
                        <div className="flex gap-2">
                            {program.category && (
                                <span className="rounded-md bg-white px-3 py-1 text-xs font-medium text-primary shadow-sm">
                                    {program.category.name}
                                </span>
                            )}
                            {program.programFormat && (
                                <span className="rounded-md bg-white/20 px-3 py-1 text-xs font-medium ring-1 ring-white/40 backdrop-blur-sm">
                                    {program.programFormat}
                                </span>
                            )}
                        </div>

                        <h1 className="text-balance text-4xl font-extrabold tracking-tight drop-shadow-md md:text-6xl">
                            {program.name}
                        </h1>

                        {program.description && (
                            <p className="max-w-3xl text-lg leading-relaxed text-white/90 drop-shadow-sm">
                                {program.description}
                            </p>
                        )}

                        <div className="mt-4 flex flex-wrap justify-center gap-4">
                            {!full && (
                                <ProgramRegisterButton
                                    programId={program.id}
                                    area={area}
                                    className="rounded-lg bg-white px-7 py-3 font-bold text-primary shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl"
                                >
                                    Daftar Sekarang
                                </ProgramRegisterButton>
                            )}
                            <Link
                                href={listHref}
                                className="rounded-lg px-7 py-3 font-bold text-white ring-1 ring-white/40 backdrop-blur-sm transition-all hover:bg-white/20 hover:ring-white"
                            >
                                Lihat Program Lain
                            </Link>
                        </div>
                    </div>
                </SlideIn>
            </div>

            <div className="overflow-hidden bg-white">
                <div className="mx-auto max-w-6xl space-y-14 px-4 py-14">
                    <SlideIn direction="up" delay={0.1}>
                        <OverviewSection program={program} />
                    </SlideIn>

                    <SlideIn direction="up" delay={0.2}>
                        <TimelineSection program={program} />
                    </SlideIn>

                    <SlideIn direction="up" delay={0.3}>
                        <CostSection program={program} />
                    </SlideIn>

                    <SlideIn direction="up" delay={0.4}>
                        <SummarySection program={program} />
                    </SlideIn>

                    <SlideIn direction="up" delay={0.5}>
                        <RequirementsSection program={program} />
                    </SlideIn>

                    <SlideIn direction="up" delay={0.6}>
                        <InfoSection program={program} />
                    </SlideIn>

                    <SlideIn direction="up" delay={0.3}>
                        <div className="rounded-2xl bg-primary px-6 py-14 text-center text-white shadow-lg transition-transform hover:-translate-y-1">
                            <Rocket className="mx-auto size-10" strokeWidth={1.5} aria-hidden />
                            <h2 className="mt-4 text-3xl font-extrabold">Tertarik dengan {program.name}?</h2>
                            <p className="mt-3 text-white/80">Lengkapi formulir pendaftaran dan mulai proses seleksi bersama FITALENTA.</p>
                            {full ? (
                                <p className="mt-6 inline-block rounded-lg bg-white/15 px-6 py-3 font-semibold">Kuota program sudah penuh</p>
                            ) : (
                                <ProgramRegisterButton
                                    programId={program.id}
                                    area={area}
                                    className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-bold text-primary shadow hover:opacity-90"
                                >
                                    Daftar Program <ArrowRight className="size-4" aria-hidden />
                                </ProgramRegisterButton>
                            )}
                        </div>
                    </SlideIn>
                </div>
            </div>
        </section>
    );
}
