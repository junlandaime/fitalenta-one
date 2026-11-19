import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import type { GalleryItem } from "@/types/gallery";
import { imageUrl, timeAgo } from "@/lib/utils";

interface GalleryCardProps {
    item: GalleryItem;
    onSelect?: (item: GalleryItem) => void;
}

export function GalleryCard({ item, onSelect }: GalleryCardProps) {
    const src = imageUrl(item.image);
    const date = item.eventDate ?? item.createdAt;
    const href = `/gallery/${item.id}`;

    return (
        <article className="group relative z-0 flex h-full w-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:ring-primary before:absolute before:inset-0 before:z-0 before:origin-top before:scale-y-0 before:bg-primary before:transition-transform before:duration-500 before:ease-in-out hover:before:scale-y-100">
            {onSelect ? (
                <div className="relative z-10 block aspect-4/3 overflow-hidden bg-slate-100">
                    {src && (
                        <Image
                            src={src}
                            alt={item.title}
                            fill
                            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                    )}
                </div>
            ) : (
                <Link
                    href={href}
                    className="relative z-10 block aspect-4/3 overflow-hidden bg-slate-100"
                >
                    {src && (
                        <Image
                            src={src}
                            alt={item.title}
                            fill
                            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                    )}
                </Link>
            )}

            <div className="relative z-10 flex flex-1 flex-col gap-3 p-5">
                <h3 className="line-clamp-2 min-h-12 text-base font-bold leading-snug text-primary transition-colors duration-300 group-hover:text-white">
                    {onSelect ? (
                        <button
                            type="button"
                            onClick={() => onSelect(item)}
                            className="cursor-pointer text-left before:absolute before:inset-0"
                        >
                            {item.title}
                        </button>
                    ) : (
                        <Link href={href} className="before:absolute before:inset-0">
                            {item.title}
                        </Link>
                    )}
                </h3>

                {date && (
                    <p className="flex items-center gap-2 text-sm text-slate-500 transition-colors duration-300 group-hover:text-slate-200">
                        <CalendarDays className="size-4 text-primary transition-colors duration-300 group-hover:text-secondary" />
                        {timeAgo(date)}
                    </p>
                )}

                <span className="mt-auto inline-flex w-fit items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm ring-1 ring-primary transition-all duration-300 group-hover:bg-white group-hover:text-primary group-hover:ring-white">
                    View Gallery
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
            </div>
        </article>
    );
}