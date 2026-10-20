import Link from "next/link";
import { ExternalLink, MapPin, Pencil, Star, Trash2 } from "lucide-react";
import { ContentThumbnail } from "@/components/editor/content-thumbnail";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EVENT_STATUS_META } from "@/constants/editor/editor-event-constant";
import { formatShortDate, formatShortTime } from "@/helpers/admin/admin-helper";
import { getEventStatus } from "@/helpers/editor/editor-content-helper";
import { cn } from "@/lib/utils";
import type { EditorEvent } from "@/types/editor/editor-event";

const COLUMNS = ["Event", "Kategori", "Jadwal", "Status", "Kuota", "Dilihat", "Aksi"];
const EDGE = "first:pl-(--card-spacing) last:pr-(--card-spacing)";

type EventTableProps = {
    events?: EditorEvent[];
    stale?: boolean;
    onDelete: (event: EditorEvent) => void;
};

function LoadingRows() {
    return Array.from({ length: 5 }, (_, row) => (
        <TableRow key={row}>
            {COLUMNS.map((column) => (
                <TableCell key={column} className={EDGE}>
                    <Skeleton className="h-5 w-full max-w-28" />
                </TableCell>
            ))}
        </TableRow>
    ));
}

export function EventTable({ events, stale, onDelete }: EventTableProps) {
    return (
        <Table className={cn("transition-opacity", stale && "opacity-60")}>
            <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                    {COLUMNS.map((column) => (
                        <TableHead
                            key={column}
                            className={cn(EDGE, "h-10 text-xs tracking-wide uppercase", column === "Aksi" && "text-right")}
                        >
                            {column}
                        </TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {!events ? (
                    <LoadingRows />
                ) : events.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={COLUMNS.length} className="h-32 text-center text-muted-foreground">
                            Belum ada event. Klik &quot;Tambah event&quot; untuk membuat yang pertama.
                        </TableCell>
                    </TableRow>
                ) : (
                    events.map((event) => {
                        const meta = EVENT_STATUS_META[getEventStatus(event.eventDate)];

                        return (
                            <TableRow key={event.id}>
                                <TableCell className={cn(EDGE, "min-w-64 py-3 whitespace-normal")}>
                                    <div className="flex items-center gap-3">
                                        <ContentThumbnail image={event.image} alt={event.title} />
                                        <div className="min-w-0">
                                            <div className="line-clamp-2 font-medium">{event.title}</div>
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <MapPin className="size-3 shrink-0" aria-hidden />
                                                <span className="line-clamp-1">{event.location}</span>
                                            </div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className={EDGE}>
                                    {event.category ? (
                                        <Badge variant="outline">{event.category.name}</Badge>
                                    ) : (
                                        <span className="text-muted-foreground">-</span>
                                    )}
                                </TableCell>
                                <TableCell className={cn(EDGE, "whitespace-nowrap")}>
                                    <div className="font-medium">{formatShortDate(event.eventDate)}</div>
                                    <div className="text-xs text-muted-foreground">{formatShortTime(event.eventDate)} WIB</div>
                                </TableCell>
                                <TableCell className={EDGE}>
                                    <div className="flex flex-col items-start gap-1">
                                        <Badge variant={meta.variant}>{meta.label}</Badge>
                                        {event.isFeatured && (
                                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <Star className="size-3" aria-hidden />
                                                Event pilihan
                                            </span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className={cn(EDGE, "tabular-nums")}>
                                    {event.maxParticipants?.toLocaleString("id-ID") ?? (
                                        <span className="text-muted-foreground">-</span>
                                    )}
                                </TableCell>
                                <TableCell className={cn(EDGE, "tabular-nums")}>
                                    {event.views.toLocaleString("id-ID")}
                                </TableCell>
                                <TableCell className={EDGE}>
                                    <div className="flex justify-end gap-1.5">
                                        <Button asChild variant="outline" size="icon-sm">
                                            <Link
                                                href={`/events/${event.slug}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label={`Lihat ${event.title} di website`}
                                            >
                                                <ExternalLink aria-hidden />
                                            </Link>
                                        </Button>
                                        <Button asChild variant="outline" size="icon-sm">
                                            <Link href={`/editor/events/${event.id}`} aria-label={`Edit ${event.title}`}>
                                                <Pencil aria-hidden />
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon-sm"
                                            aria-label={`Hapus ${event.title}`}
                                            onClick={() => onDelete(event)}
                                            className="text-destructive hover:text-destructive"
                                        >
                                            <Trash2 aria-hidden />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        );
                    })
                )}
            </TableBody>
        </Table>
    );
}
