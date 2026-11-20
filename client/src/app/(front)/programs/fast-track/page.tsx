import PageHero from "@/components/common/page-hero";
import SlideIn from "@/components/common/slide-in";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image"; 
import { ArrowRight, Rocket } from "lucide-react";

export const metadata: Metadata = {
    title: "Program Fast Track - FITALENTA",
    description: "Akselerasi karier Anda dengan kurikulum intensif dan penempatan kerja yang lebih cepat.",
};

export default function ProgramFastTrackPage() {
    return (
        <section>
            <PageHero
                badge="Program FITALENTA"
                title="Program Fast Track"
                subtitle="Akselerasi karier Anda dengan kurikulum intensif dan penempatan kerja cepat."
                crumbs={[
                    { label: "Home", href: "/" },
                    { label: "Programs", href: "/programs" },
                    { label: "Fast Track" }
                ]}
                bgImage="/bgourprogram.webp"
            />

            <div className="bg-slate-50 py-16">
                <div className="mx-auto max-w-6xl px-4">
                    <div className="grid gap-8 lg:grid-cols-3">
                        
                        <div className="lg:col-span-2">
                            <SlideIn direction="left">
                                <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-100 md:p-10 h-full">
                                    <h2 className="mb-6 text-2xl font-bold text-primary md:text-3xl">
                                        Tentang Program Fast Track
                                    </h2>
                                    <div className="space-y-5 text-slate-600 leading-relaxed">
                                        <p>
                                            Program Fast Track didesain khusus bagi Anda yang sudah memiliki dasar (*basic*) atau pengalaman di bidang terkait, dan ingin segera terjun ke dunia kerja dalam waktu yang lebih singkat.
                                        </p>
                                        <p>
                                            Materi yang diberikan langsung difokuskan pada persiapan wawancara, penyempurnaan portofolio, dan penyelarasan standar kualifikasi sesuai dengan permintaan perusahaan mitra FITALENTA.
                                        </p>
                                        
                                        <div className="my-8 flex justify-center">
                                            <div className="relative w-full overflow-hidden rounded-2xl bg-slate-50 p-2 ring-1 ring-slate-200/60 md:p-4">
                                                <Image
                                                    src="/program/illo-fasttrack.webp"
                                                    alt="Ilustrasi pendampingan job matching dan akselerasi karier Program Fast Track FITALENTA"
                                                    width={750}
                                                    height={560}
                                                    className="h-auto w-full object-contain"
                                                    priority
                                                />
                                            </div>
                                        </div>

                                        <h3 className="mt-8 text-xl font-bold text-primary">Keunggulan Program</h3>
                                        <ul className="list-inside list-disc space-y-2 mt-4 font-medium text-slate-700">
                                            <li>Durasi pelatihan yang jauh lebih singkat dan padat.</li>
                                            <li>Fokus pada simulasi tes dan wawancara kerja.</li>
                                            <li>Penyaluran dan *matching* langsung dengan perusahaan mitra.</li>
                                            <li>Optimalisasi CV, Portofolio, dan *Personal Branding*.</li>
                                        </ul>
                                    </div>
                                </div>
                            </SlideIn>
                        </div>

                        <div className="lg:col-span-1">
                            <SlideIn direction="right" delay={0.2}>
                                <div className="sticky top-28 rounded-3xl bg-primary p-8 text-center text-white shadow-lg ring-1 ring-primary/50 flex flex-col items-center justify-center h-full min-h-[350px]">
                                    <Rocket className="mb-6 size-14 text-secondary animate-bounce" strokeWidth={1.5} />
                                    <h3 className="mb-3 text-2xl font-extrabold leading-tight">
                                        Akselerasi Kariermu
                                    </h3>
                                    <p className="mb-8 text-sm text-white/80 leading-relaxed">
                                        Siap untuk melesat lebih cepat? Lihat ketersediaan kelas Fast Track kami dan amankan posisimu.
                                    </p>
                                    
                                    <Link 
                                        href="/programs" 
                                        className="group flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 font-bold text-primary shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-slate-50 hover:shadow-xl"
                                    >
                                        Daftar Program 
                                        <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                                    </Link>
                                </div>
                            </SlideIn>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}