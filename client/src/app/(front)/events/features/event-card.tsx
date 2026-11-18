import Image from "next/image";
import Link from "next/link";
import { CalendarDays, ChevronRight } from "lucide-react";
import { imageUrl, isPastEvent, stripHtml, timeAgo } from "@/lib/utils";
import type { EventItem } from "@/types/event";

export function EventCard({ event }: { event: EventItem }) {
    const past = isPastEvent(event.eventDate);
    const src = imageUrl(event.image);

    return (
        <article className="group relative flex w-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 transition-all duration-500 hover:scale-[1.03] hover:shadow-xl z-0 hover:z-10 before:absolute before:inset-0 before:-z-10 before:origin-top before:scale-y-0 before:bg-primary before:transition-transform before:duration-500 before:ease-out hover:before:scale-y-100 hover:ring-primary/50">
            
            <Link
                href={`/events/${event.slug}`}
                className="relative z-10 block aspect-video overflow-hidden bg-slate-100"
            >
                {src && (
                    <Image
                        src={src}
                        alt={event.title}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                )}
                {event.isFeatured && (
                    <span className="absolute left-3 top-3 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-white shadow-sm">
                        Featured
                    </span>
                )}
                <span className="absolute right-3 top-3 rounded-full bg-slate-800/80 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm shadow-sm">
                    {past ? "Past Event" : "Upcoming"}
                </span>
            </Link>

            <div className="relative z-10 flex flex-1 flex-col gap-3 p-5">
                <p className="flex items-center gap-2 text-sm text-slate-500 transition-colors duration-300 group-hover:text-slate-300">
                    <CalendarDays className="size-4 text-secondary transition-colors duration-300 group-hover:text-white" />
                    {timeAgo(event.eventDate)}
                    {event.category && (
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600 transition-colors duration-300 group-hover:bg-white/20 group-hover:text-white">
                            {event.category.name}
                        </span>
                    )}
                </p>
                
                <h3 className="line-clamp-2 text-lg font-bold leading-snug text-primary transition-colors duration-300 group-hover:text-white">
                    <Link href={`/events/${event.slug}`}>{event.title}</Link>
                </h3>
                
                <p className="line-clamp-3 text-sm leading-relaxed text-slate-600 transition-colors duration-300 group-hover:text-slate-200">
                    {stripHtml(event.description)}
                </p>
                
                <Link
                    href={`/events/${event.slug}`}
                    className="mt-auto flex items-center justify-center gap-1 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white transition-all duration-300 shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary group-hover:bg-white group-hover:text-primary group-hover:hover:bg-slate-100 group-hover:hover:shadow-lg"
                >
                    {past ? "View Recap" : "View Details"}
                    <ChevronRight className="size-4" />
                </Link>
            </div>
        </article>
    );
}