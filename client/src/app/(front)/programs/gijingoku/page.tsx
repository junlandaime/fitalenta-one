import PageHero from "@/components/common/page-hero";
import SlideIn from "@/components/common/slide-in";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image"; 
import { ArrowRight, Rocket } from "lucide-react";

export const metadata: Metadata = {
    title: "Program Gijingoku - FITALENTA",
    description: "Raih peluang karier IT dan Engineering profesional di Jepang melalui program Gijingoku.",
};

export default function ProgramGijingokuPage() {
    return (
        <section>
            <PageHero
                badge="Program FITALENTA"
                title="Program Gijinkoku"
                subtitle="Raih peluang karier Engineer profesional bergaji tinggi di Jepang."
                crumbs={[
                    { label: "Home", href: "/" },
                    { label: "Programs", href: "/programs" },
                    { label: "Gijingoku" }
                ]}
                bgImage="/cardgijingoku2.png" 
            />

            <div className="bg-slate-50 py-16">
                <div className="mx-auto max-w-6xl px-4">
                    <div className="grid gap-8 lg:grid-cols-3">
                        
                        <div className="lg:col-span-2">
                            <SlideIn direction="left">
                                <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-100 md:p-10 h-full">
                                    <h2 className="mb-6 text-2xl font-bold text-primary md:text-3xl">
                                        Tentang Gijinkoku (Engineer Visa)
                                    </h2>
                                    <div className="space-y-5 text-slate-600 leading-relaxed">
                                        <p>
                                            **Gijinkoku** (*Gijutsu, Jinbun Chishiki, Kokusai Gyomu*) adalah status visa kerja bergengsi di Jepang yang diperuntukkan bagi tenaga kerja profesional dengan gelar setingkat Sarjana (S1/D4) atau D3, khususnya di bidang IT, Teknik (Engineering), dan Pengetahuan Budaya.
                                        </p>
                                        <p>
                                            Program ini akan mempersiapkan Anda tidak hanya dari sisi bahasa Jepang (target JLPT N4/N3), tetapi juga *business manner* Jepang, persiapan wawancara dengan *user* Jepang, hingga pengurusan dokumen keberangkatan dan CoE (*Certificate of Eligibility*).
                                        </p>
                                        
                                        <div className="my-8 flex justify-center">
                                            <div className="relative w-full overflow-hidden rounded-2xl bg-slate-50 p-2 ring-1 ring-slate-200/60 md:p-4">
                                                <Image
                                                    src="/program/illo-gijinkoku.png"
                                                    alt="Ilustrasi alur program Gijinkoku FITALENTA meliputi administrasi, pelatihan bahasa, job offer, dan bimbingan"
                                                    width={750}
                                                    height={560}
                                                    className="h-auto w-full object-contain"
                                                    priority
                                                />
                                            </div>
                                        </div>

                                        <h3 className="mt-8 text-xl font-bold text-primary">Keunggulan Program</h3>
                                        <ul className="list-inside list-disc space-y-2 mt-4 font-medium text-slate-700">
                                            <li>Peluang kerja sebagai tenaga ahli (*white-collar*) di perusahaan Jepang.</li>
                                            <li>Jenjang karier dan standar gaji yang setara dengan warga lokal Jepang.</li>
                                            <li>Pendampingan belajar Bahasa Jepang intensif (JLPT).</li>
                                            <li>Bantuan pengurusan dokumen visa dan CoE secara menyeluruh.</li>
                                            <li>Dapat membawa keluarga (pasangan/anak) ke Jepang di masa depan.</li>
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
                                        Karier Global Menanti
                                    </h3>
                                    <p className="mb-8 text-sm text-white/80 leading-relaxed">
                                        Wujudkan impian berkarir sebagai profesional di Jepang. Ambil langkah pertama Anda bersama FITALENTA.
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