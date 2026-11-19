"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    ImageIcon,
    MapPin,
    X,
} from "lucide-react";
import type { GalleryItem } from "@/types/gallery";
import { imageUrl, timeAgo } from "@/lib/utils";
import SlideIn from "@/components/common/slide-in";
import { GalleryCard } from "./gallery-card";

type ExtendedGalleryItem = GalleryItem & {
    caption?: string | null;
    location?: string | null;
    category?: string | { id?: string | number; name?: string; slug?: string } | null;
};

function normalizeImageList(raw: unknown): string[] {
    if (Array.isArray(raw)) {
        return raw.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
    }
    if (typeof raw === "string" && raw.trim().startsWith("[")) {
        try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
                return parsed.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
            }
        } catch {
            return [];
        }
    }
    return [];
}

function formatDisplayDate(dateInput: string | Date) {
    const parsed = new Date(dateInput);
    if (Number.isNaN(parsed.getTime())) return null;
    return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(parsed);
}

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
    const [selectedItem, setSelectedItem] = useState<ExtendedGalleryItem | null>(null);
    const [photoIndex, setPhotoIndex] = useState(0);

    const albumPhotos = useMemo(() => {
        if (!selectedItem) return [];
        const extras = normalizeImageList(selectedItem.images);
        const combined = [selectedItem.image, ...extras].filter(
            (img): img is string => typeof img === "string" && img.trim().length > 0,
        );
        return Array.from(new Set(combined));
    }, [selectedItem]);

    const handleOpenGallery = useCallback((item: GalleryItem) => {
        setSelectedItem(item as ExtendedGalleryItem);
        setPhotoIndex(0);
    }, []);

    const handleClose = useCallback(() => {
        setSelectedItem(null);
        setPhotoIndex(0);
    }, []);

    const handlePrevPhoto = useCallback(() => {
        if (albumPhotos.length <= 1) return;
        setPhotoIndex((prev) => (prev - 1 + albumPhotos.length) % albumPhotos.length);
    }, [albumPhotos.length]);

    const handleNextPhoto = useCallback(() => {
        if (albumPhotos.length <= 1) return;
        setPhotoIndex((prev) => (prev + 1) % albumPhotos.length);
    }, [albumPhotos.length]);

    useEffect(() => {
        if (!selectedItem) return;

        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") handleClose();
            if (e.key === "ArrowLeft") handlePrevPhoto();
            if (e.key === "ArrowRight") handleNextPhoto();
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            document.body.style.overflow = originalOverflow;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [selectedItem, handleClose, handlePrevPhoto, handleNextPhoto]);

    const modalDate = selectedItem ? selectedItem.eventDate ?? selectedItem.createdAt : null;
    const formattedDate = modalDate ? formatDisplayDate(modalDate) : null;

    const categoryLabel =
        typeof selectedItem?.category === "string"
            ? selectedItem.category
            : selectedItem?.category?.name || "FITALENTA Moment";

    const locationLabel =
        typeof selectedItem?.location === "string" ? selectedItem.location : null;

    const rawDetail = selectedItem?.description ?? selectedItem?.caption ?? null;
    const detailText = typeof rawDetail === "string" ? rawDetail : null;

    return (
        <>
            <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item, index) => (
                    <li key={item.id} className="h-full w-full">
                        <SlideIn direction="up" delay={index * 0.1}>
                            <div className="block h-full w-full">
                                <GalleryCard
                                    item={item}
                                    onSelect={() => handleOpenGallery(item)}
                                />
                            </div>
                        </SlideIn>
                    </li>
                ))}
            </ul>

            {/* --- MODAL PREVIEW ALBUM GALERI --- */}
            {selectedItem && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="gallery-modal-title"
                    onClick={handleClose}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm animate-in fade-in duration-200"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-200/80 animate-in fade-in zoom-in-95 duration-200 md:flex-row"
                    >
                        {/* Tombol Tutup Pojok Kanan Atas */}
                        <button
                            type="button"
                            onClick={handleClose}
                            aria-label="Tutup pratinjau galeri"
                            className="absolute right-4 top-4 z-20 flex size-9 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md ring-1 ring-slate-200 transition-all hover:scale-105 hover:bg-primary hover:text-white active:scale-95"
                        >
                            <X className="size-4.5" />
                        </button>

                        {/* Sisi Kiri: Kanvas Foto dengan Latar Blur Adaptif & Animasi Slide */}
                        <div className="relative flex min-h-[280px] flex-1 items-center justify-center overflow-hidden bg-slate-900 sm:min-h-[380px] md:min-h-[460px] md:w-3/5">
                            {albumPhotos.length > 0 ? (
                                albumPhotos.map((photoPath, idx) => {
                                    const src = imageUrl(photoPath);
                                    if (!src) return null;

                                    const isActive = idx === photoIndex;
                                    const positionClass = isActive
                                        ? "z-10 translate-x-0 scale-100 opacity-100"
                                        : idx < photoIndex
                                          ? "pointer-events-none z-0 -translate-x-10 scale-95 opacity-0"
                                          : "pointer-events-none z-0 translate-x-10 scale-95 opacity-0";

                                    return (
                                        <div
                                            key={`${photoPath}-${idx}`}
                                            aria-hidden={!isActive}
                                            className={`absolute inset-0 transition-all duration-300 ease-out ${positionClass}`}
                                        >
                                            {/* Latar belakang blur mengikuti warna foto agar samping tidak hitam polos */}
                                            <Image
                                                src={src}
                                                alt=""
                                                aria-hidden="true"
                                                fill
                                                sizes="(min-width: 768px) 60vw, 100vw"
                                                className="scale-110 object-cover opacity-65 blur-2xl saturate-125"
                                            />
                                            <div className="absolute inset-0 bg-slate-950/20" />

                                            {/* Foto utama penuh dari atas ke bawah tanpa terpotong */}
                                            <Image
                                                src={src}
                                                alt={`${selectedItem.title} - Foto ${idx + 1}`}
                                                fill
                                                sizes="(min-width: 768px) 60vw, 100vw"
                                                className="relative z-10 object-contain"
                                                priority={idx === 0}
                                            />
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="flex flex-col items-center gap-2 text-slate-400">
                                    <ImageIcon className="size-10" />
                                    <span className="text-xs">Foto tidak tersedia</span>
                                </div>
                            )}

                            {/* Navigasi Geser Foto di Dalam Album Galeri Ini */}
                            {albumPhotos.length > 1 && (
                                <>
                                    <button
                                        type="button"
                                        onClick={handlePrevPhoto}
                                        aria-label="Foto sebelumnya"
                                        className="absolute left-3 top-1/2 z-20 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-primary shadow-md backdrop-blur-xs transition-all hover:scale-105 hover:bg-white active:scale-95"
                                    >
                                        <ChevronLeft className="size-5" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleNextPhoto}
                                        aria-label="Foto berikutnya"
                                        className="absolute right-3 top-1/2 z-20 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-primary shadow-md backdrop-blur-xs transition-all hover:scale-105 hover:bg-white active:scale-95"
                                    >
                                        <ChevronRight className="size-5" />
                                    </button>

                                    <span className="absolute bottom-3 left-1/2 z-20 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-xs transition-all duration-300">
                                        {photoIndex + 1} / {albumPhotos.length}
                                    </span>
                                </>
                            )}
                        </div>

                        {/* Sisi Kanan: Detail Informasi Galeri & Thumbnail Album */}
                        <div className="flex flex-col justify-between overflow-y-auto bg-white p-6 md:w-2/5 md:p-7">
                            <div className="space-y-4 pr-6 md:pr-0">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
                                    {categoryLabel}
                                </span>

                                <h3
                                    id="gallery-modal-title"
                                    className="text-xl font-bold leading-snug text-primary"
                                >
                                    {selectedItem.title}
                                </h3>

                                <div className="space-y-2 border-y border-slate-100 py-3 text-sm text-slate-600">
                                    {modalDate && (
                                        <div className="flex items-center gap-2.5">
                                            <CalendarDays className="size-4 shrink-0 text-primary" />
                                            <span>
                                                {formattedDate
                                                    ? `${formattedDate} (${timeAgo(modalDate)})`
                                                    : timeAgo(modalDate)}
                                            </span>
                                        </div>
                                    )}

                                    {locationLabel && (
                                        <div className="flex items-center gap-2.5">
                                            <MapPin className="size-4 shrink-0 text-primary" />
                                            <span>{locationLabel}</span>
                                        </div>
                                    )}
                                </div>

                                {detailText && (
                                    <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600">
                                        {detailText}
                                    </p>
                                )}

                                {/* Mini Thumbnail Strip jika foto lebih dari 1 */}
                                {albumPhotos.length > 1 && (
                                    <div className="space-y-2 pt-1">
                                        <p className="text-xs font-medium text-slate-500">
                                            Foto dalam album ini ({albumPhotos.length})
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {albumPhotos.map((photoPath, idx) => {
                                                const thumbSrc = imageUrl(photoPath);
                                                const isActive = idx === photoIndex;
                                                return (
                                                    <button
                                                        key={`${photoPath}-${idx}`}
                                                        type="button"
                                                        onClick={() => setPhotoIndex(idx)}
                                                        className={`relative size-12 overflow-hidden rounded-lg border-2 transition-all duration-200 active:scale-95 ${
                                                            isActive
                                                                ? "scale-105 border-primary ring-2 ring-primary/25"
                                                                : "border-transparent opacity-60 hover:scale-105 hover:opacity-100"
                                                        }`}
                                                    >
                                                        {thumbSrc && (
                                                            <Image
                                                                src={thumbSrc}
                                                                alt={`Thumbnail ${idx + 1}`}
                                                                fill
                                                                sizes="48px"
                                                                className="object-cover"
                                                            />
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {albumPhotos.length > 1 && (
                                <div className="mt-6 flex items-center justify-between gap-2 border-t border-slate-100 pt-4">
                                    <button
                                        type="button"
                                        onClick={handlePrevPhoto}
                                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-700 transition-all hover:border-primary hover:text-primary active:scale-95"
                                    >
                                        <ChevronLeft className="size-4" />
                                        Sebelumnya
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleNextPhoto}
                                        className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-white transition-all hover:bg-primary/90 active:scale-95"
                                    >
                                        Berikutnya
                                        <ChevronRight className="size-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}