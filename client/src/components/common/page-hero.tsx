import Link from "next/link";
import SlideIn from "./slide-in";

type Crumb = { label: string; href?: string };

export default function PageHero({
    badge,
    title,
    subtitle,
    crumbs,
    chips,
    bgImage,
    hideHero,
}: {
    badge?: string;
    title?: string;
    subtitle?: string;
    crumbs: Crumb[];
    chips?: string[];
    bgImage?: string;
    hideHero?: boolean;
}) {
    return (
        <>
            {!hideHero && title && (
                <section
                    // 2. Tambahkan overflow-hidden agar scrollbar aman saat animasi meluncur
                    className={`relative overflow-hidden bg-cover bg-center px-6 py-20 text-center text-white ${
                        !bgImage ? "bg-linear-to-br from-[#071d40] to-[#0e4a8f]" : ""
                    }`}
                    style={bgImage ? { backgroundImage: `url(${bgImage})` } : {}}
                >
                    {bgImage && <div className="absolute inset-0 bg-black/20" />}

                    <div className="relative z-10 flex flex-col items-center">
                        {/* Badge muncul duluan (delay 0.1) */}
                        {badge && (
                            <SlideIn direction="up" delay={0.1}>
                                <span className="mb-5 inline-block rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-sm backdrop-blur-sm">
                                    {badge}
                                </span>
                            </SlideIn>
                        )}

                        <SlideIn direction="up" delay={0.2}>
                            <h1 className="mx-auto max-w-4xl text-4xl font-extrabold leading-tight drop-shadow-md md:text-5xl">
                                {title}
                            </h1>
                        </SlideIn>

                        {subtitle && (
                            <SlideIn direction="up" delay={0.3}>
                                <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90 drop-shadow-sm">
                                    {subtitle}
                                </p>
                            </SlideIn>
                        )}

                        {chips && chips.length > 0 && (
                            <SlideIn direction="up" delay={0.4}>
                                <div className="mt-6 flex flex-wrap justify-center gap-3">
                                    {chips.map((chip) => (
                                        <span
                                            key={chip}
                                            className="rounded-full bg-white/10 px-4 py-1.5 text-sm backdrop-blur-sm"
                                        >
                                            {chip}
                                        </span>
                                    ))}
                                </div>
                            </SlideIn>
                        )}
                    </div>
                </section>
            )}

            <nav aria-label="Breadcrumb" className="border-b border-slate-200 bg-white text-sm text-slate-500">
                <ol className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-6 py-3">
                    {crumbs.map((c, i) => (
                        <li key={c.label} className="flex items-center gap-2">
                            {i > 0 && <span aria-hidden>/</span>}
                            {c.href ? (
                                <Link href={c.href} className="text-[#0e4a8f] hover:underline">
                                    {c.label}
                                </Link>
                            ) : (
                                <span>{c.label}</span>
                            )}
                        </li>
                    ))}
                </ol>
            </nav>
        </>
    );
}
