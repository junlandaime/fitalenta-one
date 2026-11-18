import { imageUrl, safely } from "@/lib/utils";
import { getFeaturedEvents } from "@/services/event-service";
import { EventsCarousel, type EventSlide } from "./events-carousel";

const HEADING_ID = "featured-events-heading";

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
});

function formatDate(value: string) {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? "" : dateFormatter.format(parsed);
}

export async function FeaturedEventsSection() {
    const events = await safely(getFeaturedEvents, [], "featured-events");
    if (events.length === 0) return null;

    const slides: EventSlide[] = events.map((event) => ({
        id: event.id,
        title: event.title,
        slug: event.slug,
        category: event.category?.name ?? null,
        dateLabel: formatDate(event.eventDate),
        location: event.location,
        image: imageUrl(event.image) ?? null,
        registerLink: event.link && /^https?:\/\//i.test(event.link) ? event.link : null,
    }));

    return (
        <section id="events" aria-labelledby={HEADING_ID} className="bg-white text-[#10302B]">
            <div className="mx-auto max-w-7xl px-6 py-16 md:px-8 lg:py-20">
                <header className="max-w-3xl">
                    <p className="text-xs font-semibold tracking-[0.18em] text-[#2F6F62] sm:text-sm">EVENT &amp; PROMO</p>
                    <h2 id={HEADING_ID} className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                        Event Unggulan
                    </h2>
                </header>
                <div className="mt-10">
                    <EventsCarousel slides={slides} />
                </div>
            </div>
        </section>
    );
}