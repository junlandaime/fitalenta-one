import { Eye, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatShortDate, formatShortTime } from "@/helpers/admin/admin-helper";
import { cn } from "@/lib/utils";
import type { FeedbackStatus, UserFeedback } from "@/types/feedback";

const STATUS_LABEL: Record<FeedbackStatus, string> = {
    OPEN: "Open",
    IN_PROGRESS: "Dalam proses",
    RESOLVED: "Selesai",
    CLOSED: "Ditutup",
};

const STATUS_CLASS: Record<FeedbackStatus, string> = {
    OPEN: "border-amber-200 bg-amber-50 text-amber-700",
    IN_PROGRESS: "border-blue-200 bg-blue-50 text-blue-700",
    RESOLVED: "border-emerald-200 bg-emerald-50 text-emerald-700",
    CLOSED: "border-slate-200 bg-slate-100 text-slate-700",
};

export function FeedbackTable({ items, stale, onOpen }: { items?: UserFeedback[]; stale?: boolean; onOpen: (item: UserFeedback) => void }) {
    return (
        <Table className={cn("transition-opacity", stale && "opacity-60")}>
            <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                    {["User", "Kategori", "Subjek", "Status", "Tanggal", "Aksi"].map((column) => (
                        <TableHead key={column} className={cn("h-10 text-xs tracking-wide uppercase", column === "Aksi" && "text-right")}>{column}</TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {!items ? (
                    Array.from({ length: 5 }, (_, row) => (
                        <TableRow key={row}>{Array.from({ length: 6 }, (_, column) => <TableCell key={column}><Skeleton className="h-5 w-full max-w-32" /></TableCell>)}</TableRow>
                    ))
                ) : items.length === 0 ? (
                    <TableRow><TableCell colSpan={6} className="h-32 text-center text-muted-foreground">Tidak ada feedback.</TableCell></TableRow>
                ) : items.map((item) => (
                    <TableRow key={item.id}>
                        <TableCell><div className="font-medium">{item.user.name}</div><div className="text-xs text-muted-foreground">{item.user.email}</div></TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell className="max-w-72"><div className="truncate font-medium">{item.subject}</div>{item.pageUrl && <a href={item.pageUrl} className="mt-1 inline-flex items-center gap-1 text-xs text-primary hover:underline"><ExternalLink className="size-3" aria-hidden />{item.pageUrl}</a>}</TableCell>
                        <TableCell><Badge variant="outline" className={STATUS_CLASS[item.status]}>{STATUS_LABEL[item.status]}</Badge></TableCell>
                        <TableCell className="whitespace-nowrap"><div className="font-medium">{formatShortDate(item.createdAt)}</div><div className="text-xs text-muted-foreground">{formatShortTime(item.createdAt)}</div></TableCell>
                        <TableCell><div className="flex justify-end"><Button variant="outline" size="icon-sm" aria-label={`Baca feedback ${item.subject}`} onClick={() => onOpen(item)}><Eye aria-hidden /></Button></div></TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
