import { Loader2, Pencil, Star, Trash2 } from "lucide-react";
import { ContentThumbnail } from "@/components/editor/content-thumbnail";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { excerptPreview } from "@/helpers/editor/editor-content-helper";
import { cn } from "@/lib/utils";
import type { EditorTestimonial } from "@/types/editor/editor-testimonial";
import { RatingStars } from "./rating-stars";

const COLUMNS = ["Klien", "Testimoni", "Rating", "Unggulan", "Aksi"];
const EDGE = "first:pl-(--card-spacing) last:pr-(--card-spacing)";

type TestimonialTableProps = {
    items?: EditorTestimonial[];
    emptyMessage: string;
    togglingId?: number;
    onToggle: (item: EditorTestimonial) => void;
    onEdit: (item: EditorTestimonial) => void;
    onDelete: (item: EditorTestimonial) => void;
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

export function TestimonialTable({ items, emptyMessage, togglingId, onToggle, onEdit, onDelete }: TestimonialTableProps) {
    return (
        <Table>
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
                    items.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell className={cn(EDGE, "min-w-56 py-3 whitespace-normal")}>
                                <div className="flex items-center gap-3">
                                    <ContentThumbnail image={item.image} alt={item.clientName} />
                                    <div className="min-w-0">
                                        <div className="line-clamp-1 font-medium">{item.clientName}</div>
                                        <div className="line-clamp-1 text-xs text-muted-foreground">{item.company}</div>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className={cn(EDGE, "max-w-md whitespace-normal text-muted-foreground")}>
                                <span className="line-clamp-2">{excerptPreview(item.content, 160)}</span>
                            </TableCell>
                            <TableCell className={EDGE}>
                                <RatingStars rating={item.rating} />
                            </TableCell>
                            <TableCell className={EDGE}>
                                <Button
                                    variant={item.isFeatured ? "default" : "outline"}
                                    size="sm"
                                    aria-pressed={item.isFeatured}
                                    aria-label={`${item.isFeatured ? "Batalkan unggulan" : "Jadikan unggulan"}: ${item.clientName}`}
                                    disabled={togglingId === item.id}
                                    onClick={() => onToggle(item)}
                                >
                                    {togglingId === item.id ? (
                                        <Loader2 className="animate-spin" data-icon="inline-start" aria-hidden />
                                    ) : (
                                        <Star data-icon="inline-start" aria-hidden />
                                    )}
                                    {item.isFeatured ? "Unggulan" : "Tandai"}
                                </Button>
                            </TableCell>
                            <TableCell className={EDGE}>
                                <div className="flex justify-end gap-1.5">
                                    <Button
                                        variant="outline"
                                        size="icon-sm"
                                        aria-label={`Edit testimoni ${item.clientName}`}
                                        onClick={() => onEdit(item)}
                                    >
                                        <Pencil aria-hidden />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon-sm"
                                        aria-label={`Hapus testimoni ${item.clientName}`}
                                        onClick={() => onDelete(item)}
                                        className="text-destructive hover:text-destructive"
                                    >
                                        <Trash2 aria-hidden />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    );
}
