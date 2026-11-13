import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProgramById } from "@/services/program-service";
import { isFull } from "@/helpers/program-helper";
import Link from "next/link";
import { ArrowRight, Rocket } from "lucide-react";
import { OverviewSection } from "../features/section/overview";
import { TimelineSection } from "../features/section/timeline";
import { CostSection } from "../features/section/cost";
import { SummarySection } from "../features/section/summary";
import { RequirementsSection } from "../features/section/requirement";
import { InfoSection } from "../features/section/info";
import SlideIn from "@/components/common/slide-in"; // Import komponen SlideIn

type Props = { params: Promise<{ id: string }> };

function parseId(raw: string) {
    const id = Number(raw);
    return Number.isInteger(id) && id > 0 ? id : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const id = parseId((await params).id);
    const program = id ? await getProgramById(id) : undefined;
    if (!program) return { title: "Program tidak ditemukan - FITALENTA" };

    return {
        title: `${program.name} - FITALENTA`,
        description: program.description?.slice(0, 160),
    };
}

export default async function ProgramDetailPage({ params }: Props) {
    const id = parseId((await params).id);
    if (!id) notFound();

    const program = await getProgramById(id);
    if (!program) notFound();

    const full = isFull(program);

    // --- LOGIKA OTOMATIS BACKGROUND GAMBAR ---
    let bgImage = "";
    
    const fullText = `${program.category?.name || ""} ${program.name || ""} ${program.description || ""}`.toLowerCase();
    
    // 1. Cek Gijinkoku / Engineer
    if (fullText.includes("gijinkoku") || fullText.includes("gijingoku") || fullText.includes("engineer")) {
        bgImage = "url(/cardgijingoku2.png)";
    } 
    // 2. Cek Korea
    else if (fullText.includes("korea")) {
        bgImage = "url(/belajarbahasakorea.png)";
    } 
    // 3. Cek Jepang dan kawan-kawan
    else if (
        fullText.includes("jepang") || 
        fullText.includes("tokutei") || 
        fullText.includes("jlpt") ||
        fullText.includes("ssw")
    ) {
        bgImage = "url(/belajarbahasa.png)";
    }

    return (
        <section>
            {/* Background Diperbarui */}
            <div 
                className={`relative flex min-h-[55vh] flex-col justify-center bg-cover bg-center text-white ${
                    !bgImage ? "bg-linear-to-br from-[#071d40] to-[#0e4a8f]" : ""
                }`}
                style={bgImage ? { backgroundImage: bgImage } : {}}
            >
                {/* 2. Overlay Gradient */}
                {bgImage && (
                    <div className="absolute inset-0 bg-gradient-to-b from-[#071d40]/90 via-[#071d40]/40 to-[#071d40]/90" />
                )}

                {/* Konten Utama */}
                <SlideIn direction="up">
                    <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center gap-5 px-4 py-20 text-center">
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
                                <Link href={"/register"} className="rounded-lg bg-white px-7 py-3 font-bold text-primary shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl">
                                    Daftar Sekarang
                                </Link>
                            )}
                            <Link href="/programs" className="rounded-lg px-7 py-3 font-bold text-white ring-1 ring-white/40 backdrop-blur-sm transition-all hover:bg-white/20 hover:ring-white">
                                Lihat Program Lain
                            </Link>
                        </div>
                    </div>
                </SlideIn>
            </div>
            {/* Akhir Bagian Background */}

            {/* Bagian Rincian Program */}
            <div className="bg-white overflow-hidden">
                <div className="mx-auto max-w-6xl space-y-14 px-4 py-14">
                    
                    {/* Setiap section rincian diberi animasi dengan delay bertahap */}
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

                    {/* Animasi untuk kotak pendaftaran di paling bawah */}
                    <SlideIn direction="up" delay={0.3}>
                        <div className="rounded-2xl bg-primary px-6 py-14 text-center text-white shadow-lg transition-transform hover:-translate-y-1">
                            <Rocket className="mx-auto size-10" strokeWidth={1.5} aria-hidden />
                            <h2 className="mt-4 text-3xl font-extrabold">Tertarik dengan {program.name}?</h2>
                            <p className="mt-3 text-white/80">Lengkapi formulir pendaftaran dan mulai proses seleksi bersama FITALENTA.</p>
                            {full ? (
                                <p className="mt-6 inline-block rounded-lg bg-white/15 px-6 py-3 font-semibold">Kuota program sudah penuh</p>
                            ) : (
                                <Link href={"/register"} className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-bold text-primary shadow hover:opacity-90">
                                    Daftar Program <ArrowRight className="size-4" aria-hidden />
                                </Link>
                            )}
                        </div>
                    </SlideIn>

                </div>
            </div>
        </section>
    );
}