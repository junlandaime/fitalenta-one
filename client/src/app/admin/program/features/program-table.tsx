import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PROGRAM_STATUS_META } from "@/constants/admin/admin-program-constant";
import { cn, formatIDR } from "@/lib/utils";
import type { AdminProgram } from "@/types/admin/admin-program";
import { QuotaBar } from "./quota-bar";

const COLUMNS = ["Program", "Kategori", "Durasi", "Kuota", "Biaya", "Status", "Aksi"];

const EDGE = "first:pl-(--card-spacing) last:pr-(--card-spacing)";

type ProgramTableProps = {
    programs?: AdminProgram[];
    stale?: boolean;
    onDelete: (program: AdminProgram) => void;
};

function deleteHint(program: AdminProgram) {
    if (program.canDelete) return undefined;
    return `Tidak dapat dihapus: sudah memiliki ${program.registrationCount} pendaftar. Ubah statusnya menjadi nonaktif.`;
}

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

export function ProgramTable({ programs, stale, onDelete }: ProgramTableProps) {
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
                {!programs ? (
                    <LoadingRows />
                ) : programs.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={COLUMNS.length} className="h-32 text-center text-muted-foreground">
                            Tidak ada program yang cocok dengan filter.
                        </TableCell>
                    </TableRow>
                ) : (
                    programs.map((program) => {
                        const status = PROGRAM_STATUS_META[program.status];

                        return (
                            <TableRow key={program.id}>
                                <TableCell className={cn(EDGE, "min-w-48 py-3 whitespace-normal")}>
                                    <div className="font-medium">{program.name}</div>
                                    <div className="text-xs text-muted-foreground">
                                        {program.programFormat || "Format belum diisi"}
                                    </div>
                                </TableCell>
                                <TableCell className={EDGE}>
                                    {program.category ? (
                                        <Badge variant="outline">{program.category.name}</Badge>
                                    ) : (
                                        <span className="text-muted-foreground">-</span>
                                    )}
                                </TableCell>
                                <TableCell className={cn(EDGE, "whitespace-nowrap")}>{program.duration || "-"}</TableCell>
                                <TableCell className={EDGE}>
                                    <QuotaBar program={program} />
                                </TableCell>
                                <TableCell className={cn(EDGE, "font-medium whitespace-nowrap tabular-nums")}>
                                    {formatIDR(Number(program.trainingCost))}
                                </TableCell>
                                <TableCell className={EDGE}>
                                    <div className="flex flex-col items-start gap-1">
                                        <Badge className={status.className}>
                                            {status.label}
                                        </Badge>
                                        {program.isRunning && (
                                            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                <span className="size-1.5 rounded-full bg-green-400" aria-hidden />
                                                Sedang berjalan
                                            </span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className={EDGE}>
                                    <div className="flex justify-end gap-1.5">
                                        <Button asChild variant="outline" size="icon-sm">
                                            <Link
                                                href={`/admin/program/${program.id}`}
                                                aria-label={`Edit ${program.name}`}
                                            >
                                                <Pencil aria-hidden />
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon-sm"
                                            aria-label={`Hapus ${program.name}`}
                                            title={deleteHint(program)}
                                            disabled={!program.canDelete}
                                            onClick={() => onDelete(program)}
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
