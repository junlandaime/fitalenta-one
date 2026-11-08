import Image from "next/image";
import { ArrowDown, ArrowUp, ImageIcon, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BANNER_STATUS_BADGE } from "@/constants/editor/editor-banner-constant";
import { describeSchedule } from "@/helpers/editor/editor-banner-helper";
import { cn, imageUrl } from "@/lib/utils";
import type { EditorBanner } from "@/types/editor/editor-banner";

const EDGE = "first:pl-(--card-spacing) last:pr-(--card-spacing)";
const COLUMNS = ["Banner", "Tautan", "Jadwal tayang", "Urutan", "Status", "Aksi"];

type BannerTableProps = {
    items?: EditorBanner[];
    emptyMessage: string;
    stale?: boolean;
    canReorder: boolean;
    onMove: (index: number, direction: -1 | 1) => void;
    onEdit: (item: EditorBanner) => void;
    onDelete: (item: EditorBanner) => void;
};

function LoadingRows() {
    return Array.from({ length: 4 }, (_, row) => (
        <TableRow key={row}>
            {COLUMNS.map((column) => (
                <TableCell key={column} className={EDGE}>
                    <Skeleton className="h-5 w-full max-w-28" />
                </TableCell>
            ))}
        </TableRow>
    ));
}

function BannerThumbnail({ image, title }: { image: string; title: string }) {
    const src = imageUrl(image);

    return (
        <span className="relative flex h-12 w-20 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted text-muted-foreground">
            {src ? (
                <Image src={src} alt={`Banner ${title}`} fill unoptimized sizes="80px" className="object-cover" />
            ) : (
                <ImageIcon className="size-5" aria-hidden />
            )}
        </span>
    );
}

export function BannerTable({ items, emptyMessage, stale, canReorder, onMove, onEdit, onDelete }: BannerTableProps) {
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
                {!items ? (
                    <LoadingRows />
                ) : items.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={COLUMNS.length} className="h-32 text-center text-muted-foreground">
                            {emptyMessage}
                        </TableCell>
                    </TableRow>
                ) : (
                    items.map((item, index) => {
                        const badge = BANNER_STATUS_BADGE[item.status];

                        return (
                            <TableRow key={item.id}>
                                <TableCell className={cn(EDGE, "min-w-64 py-3 whitespace-normal")}>
                                    <div className="flex items-center gap-3">
                                        <BannerThumbnail image={item.image} title={item.title} />
                                        <div className="min-w-0">
                                            <div className="line-clamp-1 font-medium">{item.title}</div>
                                            {item.subtitle && (
                                                <div className="line-clamp-1 text-xs text-muted-foreground">{item.subtitle}</div>
                                            )}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className={cn(EDGE, "max-w-48 truncate text-muted-foreground")}>
                                    {item.linkUrl ?? "-"}
                                </TableCell>
                                <TableCell className={cn(EDGE, "text-muted-foreground")}>{describeSchedule(item)}</TableCell>
                                <TableCell className={EDGE}>
                                    <div className="flex items-center gap-1">
                                        <span className="w-6 tabular-nums">{item.order}</span>
                                        <Button
                                            variant="ghost"
                                            size="icon-sm"
                                            aria-label={`Naikkan urutan ${item.title}`}
                                            disabled={!canReorder || index === 0}
                                            onClick={() => onMove(index, -1)}
                                        >
                                            <ArrowUp aria-hidden />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon-sm"
                                            aria-label={`Turunkan urutan ${item.title}`}
                                            disabled={!canReorder || index === items.length - 1}
                                            onClick={() => onMove(index, 1)}
                                        >
                                            <ArrowDown aria-hidden />
                                        </Button>
                                    </div>
                                </TableCell>
                                <TableCell className={EDGE}>
                                    <Badge variant={badge.variant}>{badge.label}</Badge>
                                </TableCell>
                                <TableCell className={EDGE}>
                                    <div className="flex justify-end gap-1.5">
                                        <Button
                                            variant="outline"
                                            size="icon-sm"
                                            aria-label={`Edit ${item.title}`}
                                            onClick={() => onEdit(item)}
                                        >
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
                                </TableCell>
                            </TableRow>
                        );
                    })
                )}
            </TableBody>
        </Table>
    );
}