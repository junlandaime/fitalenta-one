import PageHero from "@/components/common/page-hero";
import SlideIn from "@/components/common/slide-in";
import { getAbout } from "@/constants/about-constant";
import { getPublicTeamMembers } from "@/services/team-service";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { TeamMembersGrid } from "./feature/team-members-grid";

export const metadata: Metadata = {
    title: "About Us - FITALENTA",
    description: "Kenali FITALENTA: cerita, visi misi, nilai, dan tim kami.",
};

export const dynamic = "force-dynamic";

const wrap = "mx-auto w-full max-w-6xl px-6";
const section = "py-16 md:py-24";

function SectionTitle({ title, sub, light }: { title: string; sub?: string; light?: boolean }) {
    return (
        <div className="max-w-2xl">
            <h2 className={`text-3xl font-extrabold leading-tight tracking-tight md:text-4xl ${light ? "text-white" : "text-primary"}`}>
                {title}
            </h2>
            {sub && <p className={`mt-3 text-lg ${light ? "text-white/70" : "text-slate-500"}`}>{sub}</p>}
        </div>
    );
}

export default async function AboutPage() {
    const [data, members] = await Promise.all([getAbout(), getPublicTeamMembers()]);
    const [lead, ...rest] = data.story.paragraphs;

    return (
        <main className="text-slate-800">
            <PageHero
                badge="FITALENTA About Us"
                title="About FITALENTA"
                subtitle="Become a company partner to provide a reliable workforce, improve the capabilities of employees, and achieve financial growth through target-based business assistance"
                crumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
                bgImage="/bg-about.png" 
            />

            <section className={`${section} overflow-hidden`}>
                <div className={`${wrap} grid items-center gap-12 lg:grid-cols-[5fr_6fr] lg:gap-20`}>
                    <SlideIn direction="left">
                        <div className="relative aspect-square overflow-hidden rounded-3xl bg-linear-to-br from-primary to-primary/70 shadow-xl lg:aspect-4/5">
                            {data.story.image && (
                                <Image src={data.story.image} alt="Kantor FITALENTA" fill sizes="(min-width:1024px) 40vw, 100vw" className="object-cover" />
                            )}
                        </div>
                    </SlideIn>

                    <SlideIn direction="right" delay={0.15}>
                        <div>
                            <h2 className="text-3xl font-extrabold tracking-tight text-primary md:text-4xl">Our Story</h2>
                            
                            {lead && <p className="mt-6 text-base leading-7 text-slate-600 md:text-lg">{lead}</p>}
                            
                            <div className="mt-4 max-w-[62ch] space-y-4 text-base leading-7 text-slate-600 md:text-lg">
                                {rest.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
                            </div>
                            
                            <Link href="/contact" className="mt-8 inline-block rounded-xl bg-secondary px-6 py-3 text-sm font-bold text-white shadow transition hover:opacity-90">
                                Hubungi FITALENTA
                            </Link>
                        </div>
                    </SlideIn>
                </div>
            </section>

            <section className={`${section} bg-slate-50`}>
                <div className={`${wrap} grid gap-12 lg:grid-cols-2 lg:gap-20`}>
                    <div>
                        <h2 className="text-xl font-bold text-secondary">Our Vision</h2>
                        <p className="mt-4 text-2xl font-bold leading-snug text-primary md:text-3xl">{data.vision}</p>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-secondary">Our Mission</h2>
                        <ol className="mt-4 divide-y divide-slate-200 border-y border-slate-200">
                            {data.missions.map((mission, index) => (
                                <li key={index} className="flex gap-5 py-5">
                                    <span className="w-8 shrink-0 text-lg font-bold tabular-nums text-secondary">
                                        {String(index + 1).padStart(2, "0")}
                                    </span>
                                    <span className="leading-7 text-slate-600">{mission}</span>
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>
            </section>

            <section className={`${section} bg-primary text-white`}>
                <div className={wrap}>
                    <SectionTitle title="Our Journey" light />
                    <ol className="mt-14 border-l border-white/20">
                        {data.journey.map((item) => (
                            <li key={item.year} className="relative pb-12 pl-8 last:pb-0 md:pl-12">
                                <span aria-hidden className="absolute -left-1.5 top-5 size-3 rounded-full bg-secondary ring-4 ring-primary md:top-7" />
                                <SlideIn direction="up">
                                    <div className="md:grid md:grid-cols-[11rem_1fr] md:gap-10">
                                        <h3 className="text-5xl font-extrabold leading-none tracking-tight text-secondary md:text-6xl">{item.year}</h3>
                                        <p className="mt-3 max-w-[60ch] text-lg leading-relaxed text-white/75 md:mt-2">{item.text}</p>
                                    </div>
                                </SlideIn>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            <section className={section}>
                <div className={wrap}>
                    <SectionTitle title="Value FAST" />
                    <div className="mt-12 grid gap-px overflow-hidden rounded-3xl bg-slate-200 ring-1 ring-slate-200 sm:grid-cols-2 lg:grid-cols-4">
                        {data.values.map((value) => {
                            const Icon = value.icon;
                            return (
                                <div key={value.title} className="bg-white p-8">
                                    <span className="grid size-12 place-items-center rounded-xl bg-secondary/10 text-secondary">
                                        <Icon size={22} />
                                    </span>
                                    <h3 className="mt-6 text-xl font-bold text-primary">{value.title}</h3>
                                    <p className="mt-2 text-sm leading-6 text-slate-500">{value.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className={`${section} bg-slate-50`}>
                <div className={wrap}>
                    <SectionTitle title="Meet Our Team" sub="Kenali tim di balik FITALENTA" />
                    <div className="relative mt-12 aspect-video overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
                        <Image
                            src={data.director}
                            alt="Profil Direktur FITALENTA"
                            fill
                            sizes="(min-width: 1152px) 1152px, 100vw"
                            className="object-contain"
                        />
                    </div>
                    <div className="mt-14">
                        <TeamMembersGrid members={members} />
                    </div>
                </div>
            </section>

            <section className={section}>
                <div className={wrap}>
                    <div className="rounded-3xl bg-primary px-8 py-14 text-center text-white md:px-16 md:py-20">
                        <h2 className="mx-auto max-w-2xl text-3xl font-extrabold tracking-tight md:text-5xl">Join Our Team</h2>
                        <p className="mx-auto mt-4 max-w-xl text-lg text-white/70">
                            We&apos;re always looking for talented individuals to join our growing team.
                        </p>
                        <Link href="/contact" className="mt-8 inline-block rounded-xl bg-secondary px-8 py-4 text-sm font-bold text-white shadow-lg transition hover:opacity-90">
                            Call For Possibility
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}