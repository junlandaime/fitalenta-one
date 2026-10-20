import Image from "next/image";
import { CalendarDays, ImageIcon, Pencil, Star, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatShortDate } from "@/helpers/admin/admin-helper";
import { imageUrl } from "@/lib/utils";
import type { EditorGalleryItem } from "@/types/editor/editor-gallery";

type GalleryGridProps = {
    items?: EditorGalleryItem[];
    emptyMessage: string;
    onEdit: (item: EditorGalleryItem) => void;
    onDelete: (item: EditorGalleryItem) => void;
};

const GRID = "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

function GalleryCard({ item, onEdit, onDelete }: Pick<GalleryGridProps, "onEdit" | "onDelete"> & { item: EditorGalleryItem }) {
    const src = imageUrl(item.image);

    return (
        <article className="flex flex-col overflow-hidden rounded-lg border bg-card">
            <div className="relative flex aspect-4/3 items-center justify-center bg-muted text-muted-foreground">
                {src ? (
                    <Image src={src} alt={item.title} fill unoptimized sizes="(min-width: 1280px) 25vw, 50vw" className="object-cover" />
                ) : (
                    <ImageIcon className="size-8" aria-hidden />
                )}
                {item.isFeatured && (
                    <Badge className="absolute top-2 left-2 gap-1">
                        <Star className="size-3" aria-hidden />
                        Unggulan
                    </Badge>
                )}
            </div>

            <div className="flex flex-1 flex-col gap-2 p-3">
                <h3 className="line-clamp-2 text-sm leading-snug font-medium">{item.title}</h3>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    {item.category && <Badge variant="outline">{item.category.name}</Badge>}
                    {item.eventDate && (
                        <span className="flex items-center gap-1">
                            <CalendarDays className="size-3" aria-hidden />
                            {formatShortDate(item.eventDate)}
                        </span>
                    )}
                </div>

                <div className="mt-auto flex items-center justify-between gap-2 pt-1">
                    <span className="text-xs text-muted-foreground tabular-nums">Urutan {item.order}</span>
                    <div className="flex gap-1.5">
                        <Button variant="outline" size="icon-sm" aria-label={`Edit ${item.title}`} onClick={() => onEdit(item)}>
                            <Pencil aria-hidden />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon-sm"
                            aria-label={`Hapus ${item.title}`}
                            onClick={() => onDelete(item)}
                            className="text-destructive hover:text-destructive"
                        >
                            <Trash2 aria-hidden />
                        </Button>
                    </div>
                </div>
            </div>
        </article>
    );
}

export function GalleryGrid({ items, emptyMessage, onEdit, onDelete }: GalleryGridProps) {
    if (!items) {
        return (
            <div className={GRID} aria-busy="true" aria-label="Memuat galeri">
                {Array.from({ length: 8 }, (_, index) => (
                    <Skeleton key={index} className="h-64 rounded-lg" />
                ))}
            </div>
        );
    }

    if (items.length === 0) {
        return <p className="py-16 text-center text-sm text-muted-foreground">{emptyMessage}</p>;
    }

    return (
        <div className={GRID}>
            {items.map((item) => (
                <GalleryCard key={item.id} item={item} onEdit={onEdit} onDelete={onDelete} />
            ))}
        </div>
    );
}
