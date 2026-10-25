import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { getGalleryById } from "@/services/gallery-service";
import { formatDate, formatPlainText, imageUrl, stripHtml } from "@/lib/utils";
import PageHero from "@/components/common/page-hero";

type Props = { params: Promise<{ slug?: string; id?: string }> };

function parseId(raw?: string) {
    if (!raw) return null;
    const id = Number(raw);
    return Number.isInteger(id) && id > 0 ? id : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const p = await params;
    const id = parseId(p.id ?? p.slug);
    const detail = id ? await getGalleryById(id) : undefined;
    if (!detail) return { title: "Gallery not found - FITALENTA" };

    const { image } = detail;
    const src = imageUrl(image.image);
    return {
        title: `${image.title} - FITALENTA`,
        description: image.description ? stripHtml(image.description).slice(0, 160) : undefined,
        openGraph: src ? { images: [src] } : undefined,
    };
}

export default async function GalleryDetailPage({ params }: Props) {
    const p = await params;
    const id = parseId(p.id ?? p.slug);
    if (!id) notFound();

    const detail = await getGalleryById(id);
    if (!detail) notFound();

    const { image: item } = detail;
    const src = imageUrl(item.image);
    const date = item.eventDate ?? item.createdAt;

    return (
        <>
            <PageHero
                badge="Gallery FITALENTA"
                title={item.title}
                crumbs={[{ label: "Home", href: "/" }, { label: "Gallery" }, { label: item.title }]}
            />

            <section className="bg-slate-50 py-14">
                <div className="mx-auto max-w-4xl px-4">
                    <article className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
                        {src && (
                            <div className="relative aspect-video bg-slate-100 sm:aspect-[1.9]">
                                <Image
                                    src={src}
                                    alt={item.title}
                                    fill
                                    priority
                                    sizes="(min-width: 896px) 896px, 100vw"
                                    className="object-cover"
                                />
                            </div>
                        )}
                        <div className="p-6 sm:p-10">
                            <div className="flex flex-wrap items-center gap-4 text-sm">
                                {item.category && (
                                    <span className="rounded-full bg-primary/10 px-4 py-1.5 font-semibold text-primary">
                                        {item.category.name}
                                    </span>
                                )}
                                {date && (
                                    <span className="flex items-center gap-2 text-slate-500">
                                        <CalendarDays className="size-4 text-primary" />
                                        <time dateTime={date}>{formatDate(date)}</time>
                                    </span>
                                )}
                            </div>
                            <h2 className="mt-5 text-2xl font-bold text-primary md:text-3xl">{item.title}</h2>
                            <div className="mt-3 h-1 w-12 rounded-full bg-primary" />
                            {item.description && (
                                <p className="mt-8 whitespace-pre-line text-lg leading-8 text-slate-600">
                                    {formatPlainText(item.description)}
                                </p>
                            )}
                        </div>
                    </article>

                    <Link
                        href="/gallery"
                        className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary/90"
                    >
                        <ArrowLeft className="size-4" />
                        Back to Gallery
                    </Link>
                </div>
            </section>
        </>
    );
}
