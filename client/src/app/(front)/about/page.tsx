import PageHero from "@/components/common/page-hero";
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

const wrap = "mx-auto w-full max-w-6xl px-6";

function Heading({ eyebrow, title, sub }: { eyebrow?: string; title: string; sub?: string }) {
    return (
        <div className="mx-auto mb-12 max-w-xl text-center">
            {eyebrow && <p className="mb-2 text-sm font-bold text-secondary">{eyebrow}</p>}
            <h2 className="text-3xl font-extrabold leading-tight text-primary">{title}</h2>
            {sub && <p className="mt-2 text-slate-500">{sub}</p>}
            <div className="mx-auto mt-5 h-1 w-12 rounded bg-secondary" />
        </div>
    );
}

export default async function AboutPage() {
    const [data, members] = await Promise.all([getAbout(), getPublicTeamMembers()]);

    return (
        <main className="text-slate-800">
            <PageHero
                badge="FITALENTA About Us"
                title="About FITALENTA"
                subtitle="Become a company partner to provide a reliable workforce, improve the capabilities of employees, and achieve financial growth through target-based business assistance "
                crumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
            />

            {/* Story */}
            <section className="py-20">
                <div className={`${wrap} grid gap-14 md:grid-cols-[5fr_6fr]`}>
                    <div className="relative aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                        {data.story.image && <Image src={data.story.image} alt="Kantor FITALENTA" fill sizes="(min-width:768px) 40vw, 100vw" className="object-cover" />}
                    </div>
                    <div>
                        <p className="mb-2 text-sm font-bold text-secondary">About Us</p>
                        <h2 className="mb-4 text-3xl font-extrabold text-primary">Our Story</h2>
                        <div className="max-w-[62ch] space-y-4 text-slate-600">
                            {data.story.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
                        </div>
                        <Link href="/contact" className="mt-6 inline-block rounded-xl bg-secondary px-5 py-2.5 text-sm font-bold text-white hover:opacity-90">
                            Hubungi FITALENTA
                        </Link>
                    </div>
                </div>
            </section>

            {/* Vision & Mission */}
            <section className="bg-slate-50 py-20">
                <div className={wrap}>
                    <Heading eyebrow="Our Directions" title="Our Vision and Mission" />
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="rounded-2xl border border-slate-200 bg-white p-8">
                            <h3 className="mb-3 text-xl font-bold text-primary">Vision</h3>
                            <p className="text-slate-600">{data.vision}</p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white p-8">
                            <h3 className="mb-3 text-xl font-bold text-primary">Mission</h3>
                            <ol className="list-decimal space-y-3 pl-5 text-slate-600">
                                {data.missions.map((Mission, index) => <li key={index}>{Mission}</li>)}
                            </ol>
                        </div>
                    </div>
                </div>
            </section>

            {/* Journey */}
            <section className="py-20">
                <div className={wrap}>
                    <Heading eyebrow="Our Journey" title="Our Journey" />
                    <ol className="mx-auto max-w-3xl space-y-6 border-l-[3px] border-slate-200 pl-8">
                        {data.journey.map((journey) => (
                            <li key={journey.year} className="relative rounded-2xl border border-slate-200 bg-white p-6">
                                <span className="absolute -left-10.5 top-7 h-4 w-4 rounded-full border-[3px] border-white bg-secondary" />
                                <h3 className="mb-2 text-2xl font-bold text-secondary">{journey.year}</h3>
                                <p className="text-slate-600">{journey.text}</p>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            {/* Values */}
            <section className="bg-slate-50 py-20">
                <div className={wrap}>
                    <Heading eyebrow="Our Values" title="Value FAST" />
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {data.values.map((value) => {
                            const Icon = value.icon;
                            return (
                                <div key={value.title} className="rounded-2xl border border-slate-200 bg-white p-6">
                                    <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-primary font-extrabold text-white"><Icon size={16} /></div>
                                    <h3 className="font-bold text-primary">{value.title}</h3>
                                    <p className="text-sm text-slate-500">{value.desc}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="py-20">
                <div className={wrap}>
                    <Heading title="Meet Our Team" sub="Kenali tim di balik FITALENTA" />
                    <div className="relative mb-16 aspect-video overflow-hidden rounded-2xl border border-slate-200 bg-white">
                        <Image
                            src={data.director}
                            alt="Profil Direktur FITALENTA"
                            fill
                            sizes="(min-width: 1152px) 1152px, 100vw"
                            className="object-contain"
                        />
                    </div>
                    <TeamMembersGrid members={members} />
                </div>
            </section>

            {/* CTA */}
            <section className="bg-slate-50 py-20 text-center">
                <div className={wrap}>
                    <h2 className="text-3xl font-extrabold text-primary">Join Our Team</h2>
                    <p className="mb-6 mt-2 text-slate-500">We&apos;re always looking for talented individuals to join our growing team.</p>
                    <Link href="/contact" className="inline-block rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white hover:opacity-90">
                        Call For Possibility
                    </Link>
                </div>
            </section>
        </main>
    );
}