import PageHero from "@/components/common/page-hero";
import { getServiceBySlug } from "@/services/service-service";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ServiceIcon } from "../features/service-icon";
import { getClientInfo } from "@/actions/action";
import { formatPlainText, imageUrl } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

async function loadService(params: Props["params"]) {
    const { slug } = await params;
    const { ip, userAgent } = await getClientInfo();
    return getServiceBySlug(slug, ip, userAgent);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const service = await loadService(params);
    if (!service) return { title: "Service not found - FITALENTA" };

    return {
        title: `${service.title} - FITALENTA`,
        description: (service.summary || service.content?.intro || "").slice(0, 155),
    };
}

export default async function ServiceDetailPage({ params }: Props) {
    const service = await loadService(params);
    if (!service) notFound();

    const { content } = service;
    const images = (content.images ?? [])
        .map((img) => imageUrl(img))
        .filter((src): src is string => Boolean(src));

    return (
        <section>
            <PageHero
                badge="Our Services"
                title={service.title}
                crumbs={[
                    { label: "Home", href: "/" },
                    { label: "Services", href: "/services" },
                    { label: service.title },
                ]}
            />

            <div className="bg-slate-50 py-16">
                <div className="mx-auto grid max-w-6xl items-start gap-8 px-4 lg:grid-cols-[1fr_340px]">
                    <article className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">
                        <h2 className="mb-5 text-2xl font-extrabold text-primary">{service.title}</h2>

                        {service.summary && (
                            <p className="mb-5 text-lg font-medium leading-relaxed text-slate-900">
                                {formatPlainText(service.summary)}
                            </p>
                        )}

                        <p className="whitespace-pre-line leading-relaxed text-slate-700">{formatPlainText(content.intro)}</p>

                        {content.sections?.map((section, sIdx) => {
                            const ListTag = section.ordered ? "ol" : "ul";

                            return (
                                <div key={section.title ?? sIdx} className="mt-8">
                                    {section.title && (
                                        <h3 className="mb-4 text-lg font-bold text-slate-900">{section.title}</h3>
                                    )}

                                    {section.points?.length > 0 && (
                                        <ListTag
                                            className={`space-y-5 ${section.ordered ? "list-decimal pl-5 marker:font-bold marker:text-primary" : "list-none"
                                                }`}
                                        >
                                            {section.points.map((p, pIdx) => (
                                                <li
                                                    key={`${p.title}-${pIdx}`}
                                                    className={section.ordered ? "pl-2" : "border-l-4 border-secondary pl-4"}
                                                >
                                                    <h4 className="font-bold text-slate-900">{p.title}</h4>
                                                    <p className="mt-1 leading-relaxed text-slate-600">{formatPlainText(p.desc)}</p>
                                                </li>
                                            ))}
                                        </ListTag>
                                    )}
                                </div>
                            );
                        })}

                        {images.length > 0 && (
                            <div
                                className={`mt-8 grid gap-4 ${images.length > 1 ? "sm:grid-cols-2" : "grid-cols-1"
                                    }`}
                            >
                                {images.map((src, i) => (
                                    <div
                                        key={`${src}-${i}`}
                                        className="relative aspect-video overflow-hidden rounded-xl bg-slate-100"
                                    >
                                        <Image
                                            src={src}
                                            alt={`${service.title} ${i + 1}`}
                                            fill
                                            sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw"
                                            className="object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        {content.closing && (
                            <p className="mt-8 whitespace-pre-line leading-relaxed text-slate-700">
                                {formatPlainText(content.closing)}
                            </p>
                        )}
                    </article>

                    <aside className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:sticky lg:top-24">
                        <div className="bg-linear-to-br from-primary to-[#0e4a8f] p-7 text-white">
                            <div className="mb-4 grid size-12 place-items-center rounded-xl bg-white/15">
                                <ServiceIcon name={service.icon} />
                            </div>
                            <h2 className="text-xl font-bold leading-snug">{service.title}</h2>
                            {content.tagline && (
                                <p className="mt-2 text-sm leading-relaxed text-white/80">{content.tagline}</p>
                            )}
                        </div>
                        <div className="p-6">
                            <Link
                                href="/contact"
                                className="block rounded-xl bg-secondary px-5 py-3.5 text-center font-bold text-white hover:opacity-90"
                            >
                                Request This Service
                            </Link>
                        </div>
                    </aside>
                </div>
            </div>

            <div className="bg-slate-50 py-20">
                <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 text-center">
                    <p className="text-sm font-medium text-primary">Ready when you are</p>
                    <h2 className="text-3xl font-bold md:text-4xl">Ready to Get Started?</h2>
                    <p className="text-slate-600">
                        Let&apos;s work together to elevate your business with our {service.title} service.
                    </p>
                    <Link
                        href="/contact"
                        className="mt-2 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white"
                    >
                        Contact Us
                    </Link>
                </div>
            </div>
        </section>
    );
}