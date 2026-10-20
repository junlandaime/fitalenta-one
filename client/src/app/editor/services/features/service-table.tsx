import Link from "next/link";
import { ExternalLink, Pencil, Star, Trash2 } from "lucide-react";
import { ServiceIcon } from "@/app/(front)/services/features/service-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { excerptPreview } from "@/helpers/editor/editor-content-helper";
import { cn } from "@/lib/utils";
import type { EditorService } from "@/types/editor/editor-service";

const COLUMNS = ["Layanan", "Ringkasan", "Poin", "Status", "Dilihat", "Aksi"];
const EDGE = "first:pl-(--card-spacing) last:pr-(--card-spacing)";

type ServiceTableProps = {
    services?: EditorService[];
    stale?: boolean;
    onDelete: (service: EditorService) => void;
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

export function ServiceTable({ services, stale, onDelete }: ServiceTableProps) {
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
                {!services ? (
                    <LoadingRows />
                ) : services.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={COLUMNS.length} className="h-32 text-center text-muted-foreground">
                            Belum ada layanan. Klik &quot;Tambah layanan&quot; untuk membuat yang pertama.
                        </TableCell>
                    </TableRow>
                ) : (
                    services.map((service) => (
                        <TableRow key={service.id}>
                            <TableCell className={cn(EDGE, "min-w-60 py-3 whitespace-normal")}>
                                <div className="flex items-center gap-3">
                                    <span className="flex size-12 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                                        <ServiceIcon name={service.icon} size={20} />
                                    </span>
                                    <div className="min-w-0">
                                        <div className="line-clamp-2 font-medium">{service.title}</div>
                                        <div className="truncate text-xs text-muted-foreground">/{service.slug}</div>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className={cn(EDGE, "max-w-72 whitespace-normal text-muted-foreground")}>
                                <span className="line-clamp-2">{excerptPreview(service.summary, 140)}</span>
                            </TableCell>
                            <TableCell className={cn(EDGE, "tabular-nums")}>
                                {service.content.points?.length ?? 0}
                            </TableCell>
                            <TableCell className={EDGE}>
                                {service.isFeatured ? (
                                    <Badge className="gap-1">
                                        <Star aria-hidden />
                                        Unggulan
                                    </Badge>
                                ) : (
                                    <Badge variant="outline">Biasa</Badge>
                                )}
                            </TableCell>
                            <TableCell className={cn(EDGE, "tabular-nums")}>
                                {service.views.toLocaleString("id-ID")}
                            </TableCell>
                            <TableCell className={EDGE}>
                                <div className="flex justify-end gap-1.5">
                                    <Button asChild variant="outline" size="icon-sm">
                                        <Link
                                            href={`/services/${service.slug}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={`Lihat ${service.title} di website`}
                                        >
                                            <ExternalLink aria-hidden />
                                        </Link>
                                    </Button>
                                    <Button asChild variant="outline" size="icon-sm">
                                        <Link href={`/editor/services/${service.id}`} aria-label={`Edit ${service.title}`}>
                                            <Pencil aria-hidden />
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon-sm"
                                        aria-label={`Hapus ${service.title}`}
                                        onClick={() => onDelete(service)}
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
