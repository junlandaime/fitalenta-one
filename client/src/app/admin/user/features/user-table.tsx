import { Mail, Pencil, Phone, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ROLE_META } from "@/constants/admin/admin-user-constant";
import { formatShortDate, formatShortTime, getInitials } from "@/helpers/admin/admin-helper";
import { cn } from "@/lib/utils";
import type { AdminUser } from "@/types/admin/admin-user";

const COLUMNS = ["User", "Email", "Telepon", "Tipe user", "Tanggal daftar", "Aksi"];

const EDGE = "first:pl-(--card-spacing) last:pr-(--card-spacing)";

type UserTableProps = {
    users?: AdminUser[];
    currentUserId?: string;
    stale?: boolean;
    onEdit: (user: AdminUser) => void;
    onDelete: (user: AdminUser) => void;
};

function deleteHint(user: AdminUser, isSelf: boolean) {
    if (isSelf) return "Akun yang sedang digunakan tidak dapat dihapus";
    if (user.relatedDataCount > 0) {
        return `Tidak dapat dihapus: memiliki ${user.relatedDataCount} data terkait (pendaftaran/artikel)`;
    }
    return undefined;
}

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

export function UserTable({ users, currentUserId, stale, onEdit, onDelete }: UserTableProps) {
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
                {!users ? (
                    <LoadingRows />
                ) : users.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={COLUMNS.length} className="h-32 text-center text-muted-foreground">
                            Tidak ada user yang cocok dengan pencarian.
                        </TableCell>
                    </TableRow>
                ) : (
                    users.map((user) => {
                        const meta = ROLE_META[user.role];
                        const isSelf = String(user.id) === currentUserId;
                        const hint = deleteHint(user, isSelf);

                        return (
                            <TableRow key={user.id}>
                                <TableCell className={cn(EDGE, "py-3")}>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="size-9">
                                            <AvatarFallback className="bg-primary text-xs font-medium text-primary-foreground">
                                                {getInitials(user.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0">
                                            <div className="truncate font-medium">{user.name}</div>
                                            <div className="text-xs text-muted-foreground">{meta.subtitle}</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className={EDGE}>
                                    <span className="flex items-center gap-2 text-muted-foreground">
                                        <Mail className="size-3.5 shrink-0" aria-hidden />
                                        {user.email}
                                    </span>
                                </TableCell>
                                <TableCell className={EDGE}>
                                    <span className="flex items-center gap-2 whitespace-nowrap text-muted-foreground">
                                        <Phone className="size-3.5 shrink-0" aria-hidden />
                                        {user.phone || "Belum tersedia"}
                                    </span>
                                </TableCell>
                                <TableCell className={EDGE}>
                                    <Badge className={meta.className}>
                                        {meta.label}
                                    </Badge>
                                </TableCell>
                                <TableCell className={cn(EDGE, "whitespace-nowrap")}>
                                    <div className="font-medium">{formatShortDate(user.createdAt)}</div>
                                    <div className="text-xs text-muted-foreground">{formatShortTime(user.createdAt)}</div>
                                </TableCell>
                                <TableCell className={EDGE}>
                                    <div className="flex justify-end gap-1.5">
                                        <Button
                                            variant="outline"
                                            size="icon-sm"
                                            aria-label={`Edit ${user.name}`}
                                            onClick={() => onEdit(user)}
                                        >
                                            <Pencil aria-hidden />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon-sm"
                                            aria-label={`Hapus ${user.name}`}
                                            title={hint}
                                            disabled={!user.canDelete}
                                            onClick={() => onDelete(user)}
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
