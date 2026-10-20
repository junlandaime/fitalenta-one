import { Pencil, Tags, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatShortDate } from "@/helpers/admin/admin-helper";
import { categoryDeleteHint } from "@/helpers/admin/admin-program-category-helper";
import { cn } from "@/lib/utils";
import type { AdminProgramCategory } from "@/types/admin/admin-program-category";

const COLUMNS = ["Kategori", "Deskripsi", "Jumlah program", "Tanggal dibuat", "Aksi"];

const EDGE = "first:pl-(--card-spacing) last:pr-(--card-spacing)";

type CategoryTableProps = {
    categories?: AdminProgramCategory[];
    filtered?: boolean;
    stale?: boolean;
    onEdit: (category: AdminProgramCategory) => void;
    onDelete: (category: AdminProgramCategory) => void;
};

function LoadingRows() {
    return Array.from({ length: 5 }, (_, row) => (
        <TableRow key={row}>
            {COLUMNS.map((column) => (
                <TableCell key={column} className={EDGE}>
                    <Skeleton className="h-5 w-full max-w-32" />
                </TableCell>
            ))}
        </TableRow>
    ));
}

export function CategoryTable({ categories, filtered, stale, onEdit, onDelete }: CategoryTableProps) {
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
                {!categories ? (
                    <LoadingRows />
                ) : categories.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={COLUMNS.length} className="h-32 text-center text-muted-foreground">
                            {filtered
                                ? "Tidak ada kategori yang cocok dengan pencarian."
                                : "Belum ada kategori program. Tambahkan kategori pertama Anda."}
                        </TableCell>
                    </TableRow>
                ) : (
                    categories.map((category) => {
                        const hint = categoryDeleteHint(category);

                        return (
                            <TableRow key={category.id}>
                                <TableCell className={cn(EDGE, "py-3")}>
                                    <div className="flex items-center gap-3">
                                        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                                            <Tags className="size-4" aria-hidden />
                                        </span>
                                        <span className="min-w-0 truncate font-medium">{category.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell className={cn(EDGE, "max-w-sm")}>
                                    <span className="line-clamp-2 text-muted-foreground">
                                        {category.description || "Belum ada deskripsi"}
                                    </span>
                                </TableCell>
                                <TableCell className={EDGE}>
                                    <Badge
                                        className={cn(
                                            "border-transparent tabular-nums",
                                            category.programCount > 0
                                                ? "bg-sky-500/10 text-sky-700 dark:text-sky-400"
                                                : "bg-muted text-muted-foreground",
                                        )}
                                    >
                                        {category.programCount.toLocaleString("id-ID")} program
                                    </Badge>
                                </TableCell>
                                <TableCell className={cn(EDGE, "whitespace-nowrap")}>
                                    {formatShortDate(category.createdAt)}
                                </TableCell>
                                <TableCell className={EDGE}>
                                    <div className="flex justify-end gap-1.5">
                                        <Button
                                            variant="outline"
                                            size="icon-sm"
                                            aria-label={`Edit ${category.name}`}
                                            onClick={() => onEdit(category)}
                                        >
                                            <Pencil aria-hidden />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon-sm"
                                            aria-label={`Hapus ${category.name}`}
                                            title={hint}
                                            disabled={category.programCount > 0}
                                            onClick={() => onDelete(category)}
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
