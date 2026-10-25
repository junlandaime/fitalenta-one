import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, CalendarPlus, Clock, MapPin, Tag, Users } from "lucide-react";
import { formatDate, formatTime, formatPlainText, imageUrl, isPastEvent, stripHtml } from "@/lib/utils";
import PageHero from "@/components/common/page-hero";
import { EventCard } from "../features/event-card";
import { getEventBySlug } from "@/services/event-service";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const detail = await getEventBySlug(slug);
    if (!detail) return { title: "Event not found - FITALENTA" };

    const { event } = detail;
    const image = imageUrl(event.image);
    return {
        title: `${event.title} - FITALENTA`,
        description: stripHtml(event.description).slice(0, 160),
        openGraph: image ? { images: [image] } : undefined,
    };
}

type InfoRow = { icon: typeof Clock; label: string; value: string; badge?: string };

export default async function EventDetailPage({ params }: Props) {
    const { slug } = await params;
    const detail = await getEventBySlug(slug);
    if (!detail) notFound();

    const { event, googleCalendarUrl, relatedEvents } = detail;
    const past = isPastEvent(event.eventDate);
    const date = formatDate(event.eventDate);
    const time = formatTime(event.eventDate);
    const image = imageUrl(event.image);

    const info: InfoRow[] = [
        { icon: CalendarDays, label: "Date", value: date, badge: past ? "Past" : undefined },
        ...(time ? [{ icon: Clock, label: "Time", value: time }] : []),
        { icon: MapPin, label: "Location", value: event.location },
        ...(event.category ? [{ icon: Tag, label: "Category", value: event.category.name }] : []),
        ...(event.maxParticipants
            ? [{ icon: Users, label: "Capacity", value: `${event.maxParticipants} participants` }]
            : []),
    ];

    const primary = "block rounded-lg px-4 py-3 text-center text-sm font-semibold";

    return (
        <section>
            <PageHero
                badge="FITALENTA Events"
                title="Upcoming Events"
                subtitle="Join us for exciting events and expand your network"
                crumbs={[{ label: "Home", href: "/" }, { label: "Events" }, { label: event.title }]}
                chips={[event.eventDate, event.location]}
            />
            <div className="bg-slate-50 py-12">
                <div className="mx-auto grid max-w-6xl gap-8 px-4 lg:grid-cols-[1fr_22rem] lg:items-start">
                    <article className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:p-6">
                        {image && (
                            <div className="relative aspect-video overflow-hidden rounded-xl bg-slate-100">
                                <Image src={image} alt={event.title} fill priority sizes="(min-width: 1024px) 720px, 100vw" className="object-cover" />
                            </div>
                        )}
                        <div className="mt-5 flex items-center gap-3 text-sm">
                            <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">
                                {past ? "Past" : "Upcoming"}
                            </span>
                            <span className="text-slate-500">{date}</span>
                        </div>
                        <h2 className="mt-4 text-2xl font-bold text-primary md:text-3xl">About the Event</h2>
                        <div className="mt-4 whitespace-pre-line leading-8 text-slate-700">
                            {formatPlainText(event.description)}
                        </div>
                    </article>

                    <aside className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 lg:sticky lg:top-24">
                        <p className="text-sm font-medium text-secondary">Event information</p>
                        <h2 className="mt-1 text-xl font-bold text-primary">Event Details</h2>
                        <dl className="mt-6 space-y-5">
                            {info.map(({ icon: Icon, label, value, badge }) => (
                                <div key={label} className="flex items-center gap-4">
                                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                        <Icon className="size-5" />
                                    </span>
                                    <div className="min-w-0">
                                        <dt className="text-xs text-slate-500">{label}</dt>
                                        <dd className="flex items-center gap-2 text-sm font-semibold text-primary">
                                            {value}
                                            {badge && <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-normal text-slate-600">{badge}</span>}
                                        </dd>
                                    </div>
                                </div>
                            ))}
                        </dl>

                        <div className="mt-8 space-y-3">
                            {past ? (
                                <Link href={`/gallery?event=${event.slug}`} className={`${primary} bg-secondary text-white hover:opacity-90`}>
                                    See Gallery
                                </Link>
                            ) : (
                                <>
                                    {event.link && (
                                        <a href={event.link} target="_blank" rel="noopener noreferrer" className={`${primary} bg-secondary text-white hover:opacity-90`}>
                                            Register Now
                                        </a>
                                    )}
                                    <a
                                        href={googleCalendarUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`${primary} flex items-center justify-center gap-2 border border-primary text-primary hover:bg-primary/5`}
                                    >
                                        <CalendarPlus className="size-4" />
                                        Add to Google Calendar
                                    </a>
                                </>
                            )}
                        </div>
                    </aside>
                </div>
            </div>

            {relatedEvents.length > 0 && (
                <div className="bg-white py-16">
                    <div className="mx-auto max-w-6xl px-4">
                        <div className="mb-10 text-center">
                            <p className="text-sm font-medium text-secondary">Discover more</p>
                            <h2 className="mt-2 text-3xl font-bold text-primary">Related Events</h2>
                            <p className="mt-2 text-slate-600">Explore more events and activities from FITALENTA.</p>
                            <div className="mx-auto mt-3 h-1 w-14 rounded-full bg-secondary" />
                        </div>
                        <ul className="grid gap-6 md:grid-cols-3">
                            {relatedEvents.slice(0, 3).map((e) => (
                                <li key={e.id} className="flex"><EventCard event={e} /></li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            <div className="py-20 bg-slate-50">
                <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 text-center">
                    <p className="text-sm font-medium text-primary">Need more information?</p>
                    <h2 className="text-3xl font-bold md:text-4xl">Have Questions About This Event?</h2>
                    <p className="text-slate-600">Our team is here to help. Don&apos;t hesitate to reach out for more information.</p>
                    <Link
                        href="/contact"
                        className="mt-2 inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold bg-primary text-white"
                    >
                        Contact Us
                    </Link>
                </div>
            </div>
        </section>
    );
}