import Link from "next/link";

type Crumb = { label: string; href?: string };

export default function PageHero({
    badge, title, subtitle, crumbs, chips, hideHero,
}: { badge?: string; title?: string; subtitle?: string; crumbs: Crumb[]; chips?: string[]; hideHero?: boolean }) {
    return (
        <>
            {!hideHero && title && (
                <section className="bg-linear-to-br from-[#071d40] to-[#0e4a8f] px-6 py-20 text-center text-white">
                    {badge && (
                        <span className="mb-5 inline-block rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-sm">
                            {badge}
                        </span>
                    )}
                    <h1 className="mx-auto max-w-4xl text-4xl font-extrabold leading-tight md:text-5xl">{title}</h1>
                    {subtitle && <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">{subtitle}</p>}
                    {chips && chips.length > 0 && (
                        <div className="mt-6 flex flex-wrap justify-center gap-3">
                            {chips.map((chip) => (
                                <span key={chip} className="rounded-full bg-white/10 px-4 py-1.5 text-sm">
                                    {chip}
                                </span>
                            ))}
                        </div>
                    )}
                </section>
            )}
            <nav aria-label="Breadcrumb" className="border-b border-slate-200 bg-white text-sm text-slate-500">
                <ol className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-6 py-3">
                    {crumbs.map((c, i) => (
                        <li key={c.label} className="flex items-center gap-2">
                            {i > 0 && <span aria-hidden>/</span>}
                            {c.href ? <Link href={c.href} className="text-[#0e4a8f] hover:underline">{c.label}</Link> : <span>{c.label}</span>}
                        </li>
                    ))}
                </ol>
            </nav>
        </>
    );
}