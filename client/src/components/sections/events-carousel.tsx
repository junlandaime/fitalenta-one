"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type EventSlide = {
    id: number;
    title: string;
    slug: string;
    category: string | null;
    dateLabel: string;
    location: string;
    image: string | null;
    registerLink: string | null;
};

const AUTOPLAY_MS = 6000;

function reducedMotion() {
    return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function EventsCarousel({ slides }: { slides: EventSlide[] }) {
    const trackRef = useRef<HTMLDivElement>(null);
    const [active, setActive] = useState(0);
    const [paused, setPaused] = useState(false);
    const count = slides.length;

    const goTo = useCallback(
        (index: number) => {
            const track = trackRef.current;
            if (!track) return;
            const target = (index + count) % count;
            track.scrollTo({
                left: target * track.clientWidth,
                behavior: reducedMotion() ? "auto" : "smooth",
            });
        },
        [count],
    );

    const handleScroll = () => {
        const track = trackRef.current;
        if (!track || track.clientWidth === 0) return;
        setActive(Math.round(track.scrollLeft / track.clientWidth));
    };

    useEffect(() => {
        if (count < 2 || paused || reducedMotion()) return;
        const timer = window.setInterval(() => goTo(active + 1), AUTOPLAY_MS);
        return () => window.clearInterval(timer);
    }, [active, count, paused, goTo]);

    return (
        <div
            role="region"
            aria-roledescription="carousel"
            aria-label="Event unggulan"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
        >
            <div
                ref={trackRef}
                onScroll={handleScroll}
                aria-live={paused || count < 2 ? "polite" : "off"}
                className="flex snap-x snap-mandatory overflow-x-auto rounded-3xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
                {slides.map((slide, index) => (
                    <article
                        key={slide.id}
                        role="group"
                        aria-roledescription="slide"
                        aria-label={`${index + 1} dari ${count}`}
                        className="relative aspect-4/5 w-full shrink-0 snap-center overflow-hidden sm:aspect-16/9 lg:aspect-21/9"
                    >
                        {slide.image ? (
                            <Image
                                src={slide.image}
                                alt=""
                                fill
                                sizes="(min-width: 1280px) 1216px, 100vw"
                                className="object-cover"
                            />
                        ) : (
                            <div aria-hidden className="absolute inset-0 bg-linear-to-br from-[#7FB0A2] to-[#2F6F62]" />
                        )}
                        <div aria-hidden className="absolute inset-0 bg-linear-to-t from-primary/90 via-primary/50 to-transparent" />

                        <div className="absolute inset-x-0 bottom-0 p-6 text-[#EEF3F1] sm:p-10 lg:max-w-3xl">
                            {slide.category && (
                                <span className="inline-block rounded-full bg-secondary px-3 py-1 text-xs font-semibold tracking-wide text-black">
                                    {slide.category}
                                </span>
                            )}
                            <h3 className="mt-3 text-balance text-2xl font-semibold leading-tight sm:text-3xl lg:text-4xl">
                                {slide.title}
                            </h3>
                            <p className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-[#EEF3F1]/85 sm:text-base">
                                {slide.dateLabel && (
                                    <span className="inline-flex items-center gap-2">
                                        <CalendarDays className="h-4 w-4" aria-hidden />
                                        {slide.dateLabel}
                                    </span>
                                )}
                                <span className="inline-flex items-center gap-2">
                                    <MapPin className="h-4 w-4" aria-hidden />
                                    {slide.location}
                                </span>
                            </p>
                            <div className="mt-5 flex flex-wrap gap-3">
                                <Button asChild size="lg" className="bg-white text-black hover:bg-white/85">
                                    <Link href={`/events/${slide.slug}`}>Lihat Detail</Link>
                                </Button>
                                {slide.registerLink && (
                                    <Button
                                        asChild
                                        size="lg"
                                        variant="outline"
                                        className="border-white/40 bg-transparent text-white hover:bg-white/85 hover:text-black"
                                    >
                                        <a href={slide.registerLink} target="_blank" rel="noopener noreferrer">
                                            Daftar Sekarang
                                        </a>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            {count > 1 && (
                <div className="mt-5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        {slides.map((slide, index) => (
                            <button
                                key={slide.id}
                                type="button"
                                aria-label={`Ke slide ${index + 1}`}
                                aria-current={index === active}
                                onClick={() => goTo(index)}
                                className={cn(
                                    "h-2.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-reduce:transition-none",
                                    index === active ? "w-8 bg-primary" : "w-2.5 bg-[#10302B]/25 hover:bg-[#10302B]/45",
                                )}
                            />
                        ))}
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            aria-label="Slide sebelumnya"
                            onClick={() => goTo(active - 1)}
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#10302B]/20 transition-colors hover:bg-[#10302B] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        >
                            <ChevronLeft className="h-5 w-5" aria-hidden />
                        </button>
                        <button
                            type="button"
                            aria-label="Slide berikutnya"
                            onClick={() => goTo(active + 1)}
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#10302B]/20 transition-colors hover:bg-[#10302B] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        >
                            <ChevronRight className="h-5 w-5" aria-hidden />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}