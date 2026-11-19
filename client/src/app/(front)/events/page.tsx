import PageHero from "@/components/common/page-hero";
import type { Metadata } from "next";
import { EventSearch } from "./features/event-search";
import { EventCard } from "./features/event-card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { getEvents } from "@/services/event-service";
import { Pagination } from "@/components/common/pagination";
import SlideIn from "@/components/common/slide-in"; // 1. Import komponen animasi

export const metadata: Metadata = {
    title: "Events - FITALENTA",
    description: "Join us for exciting events and expand your network.",
};

type Props = {
    searchParams: Promise<{ search?: string; page?: string }>;
};

export default async function EventsPage({ searchParams }: Props) {
    const { search, page } = await searchParams;
    const currentPage = Math.max(1, Number(page) || 1);
    const { events, pagination } = await getEvents({ search, page: currentPage });

    return (
        <section>
            {/* 2. Tambahkan properti bgImage di PageHero */}
            <PageHero
                badge="FITALENTA Events"
                title="Upcoming Events"
                subtitle="Join us for exciting events and expand your network"
                crumbs={[{ label: "Home", href: "/" }, { label: "Events" }]}
                bgImage="/bg-events.webp" 
            />

            {/* Tambahkan overflow-hidden agar scrollbar tidak goyang */}
            <div className="bg-slate-50 py-14 overflow-hidden">
                <div className="mx-auto max-w-6xl px-4">
                    
                    {/* Animasi untuk kolom pencarian */}
                    <SlideIn direction="down">
                        <EventSearch defaultValue={search} />
                    </SlideIn>

                    {/* Animasi untuk Judul */}
                    <SlideIn direction="up" delay={0.1}>
                        <div className="mb-10 mt-14 text-center">
                            <p className="text-sm font-medium text-secondary">Explore with us</p>
                            <h2 className="mt-2 text-3xl font-bold text-primary md:text-4xl">
                                Discover Our Events
                            </h2>
                            <div className="mx-auto mt-3 h-1 w-14 rounded-full bg-secondary" />
                        </div>
                    </SlideIn>

                    {events.length === 0 ? (
                        <p className="py-16 text-center text-slate-500">
                            {search
                                ? `No events match "${search}". Try a different keyword.`
                                : "No events yet. Check back soon."}
                        </p>
                    ) : (
                        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {/* 3. Animasi berurutan (staggered) untuk setiap kartu */}
                            {events.map((event, index) => (
                                <li key={event.id} className="flex w-full h-full">
                                    <div className="w-full h-full">
                                        <SlideIn direction="up" delay={index * 0.15}>
                                            <EventCard event={event} />
                                        </SlideIn>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}

                    <SlideIn direction="up" delay={0.2}>
                        <Pagination basePath="/events" pagination={pagination} search={search}/>
                    </SlideIn>
                </div>
            </div>

            <div className="py-20 overflow-hidden">
                <SlideIn direction="up">
                    <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 text-center">
                        <p className="text-sm font-medium text-primary">Let&apos;s connect</p>
                        <h2 className="text-3xl font-bold md:text-4xl">Can&apos;t Find What You&apos;re Looking For?</h2>
                        <p className="text-slate-600">Contact us to suggest an event or inquire about custom training sessions.</p>
                        <Link
                            href="/contact"
                            className="mt-2 inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold bg-primary text-white transition hover:opacity-90 shadow-md hover:shadow-lg"
                        >
                            Get in Touch
                            <ArrowRight className="size-4" />
                        </Link>
                    </div>
                </SlideIn>
            </div>
        </section>
    );
}