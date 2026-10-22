"use client";

import { useState } from "react";
import { CircleAlert, Mail, Phone, RefreshCw, Users } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AdminTablePagination } from "@/components/admin/admin-table-pagination";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAdminUsers } from "@/hooks/admin/use-admin-users";
import { useDebounced } from "@/hooks/use-debounced";

const participantDateFormat = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Jakarta",
});

export function ParticipantList() {
    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState("");
    const search = useDebounced(searchInput.trim());
    const participants = useAdminUsers({ page, search, role: "user" });

    return (
        <Card className="gap-0 p-0 shadow-xs">
            <CardHeader className="border-b">
                <div className="flex items-center gap-3">
                    <span className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                        <Users className="size-4" aria-hidden />
                    </span>
                    <div>
                        <CardTitle className="text-lg">Daftar Peserta</CardTitle>
                        <p className="text-xs text-muted-foreground">
                            {participants.data
                                ? `Menampilkan ${participants.data.meta.total} akun peserta dari database.`
                                : "Memuat data peserta..."}
                        </p>
                    </div>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => participants.refetch()}
                    disabled={participants.isFetching}
                >
                    <RefreshCw
                        className={participants.isFetching ? "animate-spin" : undefined}
                        data-icon="inline-start"
                        aria-hidden
                    />
                    Refresh
                </Button>
            </CardHeader>

            <CardContent className="border-b">
                <Input
                    aria-label="Cari peserta"
                    placeholder="Cari nama, email, atau nomor telepon..."
                    value={searchInput}
                    onChange={(event) => {
                        setSearchInput(event.target.value);
                        setPage(1);
                    }}
                />
            </CardContent>

            {participants.isError ? (
                <div className="p-(--card-spacing)">
                    <Alert variant="destructive">
                        <CircleAlert aria-hidden />
                        <AlertTitle>Data peserta gagal dimuat</AlertTitle>
                        <AlertDescription>{participants.error.message}</AlertDescription>
                    </Alert>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/30">
                                <TableHead className="pl-(--card-spacing)">Nama Peserta</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Telepon</TableHead>
                                <TableHead>Jumlah Pendaftaran</TableHead>
                                <TableHead className="pr-(--card-spacing)">Tanggal Akun</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {participants.isPending ? (
                                Array.from({ length: 5 }, (_, index) => (
                                    <TableRow key={index}>
                                        {Array.from({ length: 5 }, (_, cell) => (
                                            <TableCell key={cell}>
                                                <Skeleton className="h-5 w-full max-w-40" />
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : participants.data.users.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-28 text-center text-muted-foreground">
                                        Tidak ada peserta yang cocok dengan pencarian.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                participants.data.users.map((participant) => (
                                    <TableRow key={participant.id}>
                                        <TableCell className="pl-(--card-spacing) font-medium">
                                            {participant.name}
                                        </TableCell>
                                        <TableCell>
                                            <span className="flex items-center gap-2 text-muted-foreground">
                                                <Mail className="size-3.5 shrink-0" aria-hidden />
                                                {participant.email}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span className="flex items-center gap-2 text-muted-foreground">
                                                <Phone className="size-3.5 shrink-0" aria-hidden />
                                                {participant.phone || "Belum tersedia"}
                                            </span>
                                        </TableCell>
                                        <TableCell>{participant.registrationsCount}                                        </TableCell>
                                        <TableCell className="pr-(--card-spacing) whitespace-nowrap">
                                            {participantDateFormat.format(new Date(participant.createdAt))}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            )}

            {participants.data && (
                <div className="p-(--card-spacing)">
                    <AdminTablePagination
                        meta={participants.data.meta}
                        itemLabel="peserta"
                        disabled={participants.isPlaceholderData}
                        onPageChange={setPage}
                    />
                </div>
            )}
        </Card>
    );
}
