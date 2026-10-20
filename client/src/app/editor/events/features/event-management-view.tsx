"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CalendarDays, CircleAlert, CircleCheck, Plus, RefreshCw, X } from "lucide-react";
import { AdminTablePagination } from "@/components/admin/admin-table-pagination";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useEditorEvents } from "@/hooks/editor/use-editor-events";
import type { EditorEvent } from "@/types/editor/editor-event";
import { DeleteEventDialog } from "./delete-event-dialog";
import { EventTable } from "./event-table";

const SAVED_NOTICES: Record<string, string> = {
    created: "Event baru berhasil ditambahkan.",
    updated: "Event berhasil diperbarui.",
};

export function EventManagementView() {
    const searchParams = useSearchParams();

    const [page, setPage] = useState(1);
    const [deleteTarget, setDeleteTarget] = useState<EditorEvent | null>(null);
    const [notice, setNotice] = useState<string | null>(() => SAVED_NOTICES[searchParams.get("saved") ?? ""] ?? null);

    useEffect(() => {
        if (searchParams.has("saved")) window.history.replaceState(null, "", "/editor/events");
    }, [searchParams]);

    const list = useEditorEvents(page);

    function handleDeleted(event: EditorEvent) {
        setDeleteTarget(null);
        setNotice(`Event ${event.title} berhasil dihapus.`);
        if (page > 1 && list.data?.events.length === 1) setPage(page - 1);
    }

    function description() {
        if (!list.data) return "Memuat data event...";
        return `Menampilkan ${list.data.meta.total} event, diurutkan dari yang terbaru dibuat.`;
    }

    return (
        <div className="mx-auto w-full max-w-7xl space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-2xl font-semibold tracking-tight">Manajemen Event</h2>
                    <p className="max-w-2xl text-sm text-muted-foreground">
                        Kelola jadwal event, lokasi, kuota peserta, dan tautan pendaftaran yang tampil di website.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/editor/events/new">
                        <Plus data-icon="inline-start" aria-hidden />
                        Tambah event
                    </Link>
                </Button>
            </div>

            {notice && (
                <Alert>
                    <CircleCheck aria-hidden />
                    <AlertTitle className="pr-8">{notice}</AlertTitle>
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        className="absolute top-2 right-2"
                        aria-label="Tutup pemberitahuan"
                        onClick={() => setNotice(null)}
                    >
                        <X aria-hidden />
                    </Button>
                </Alert>
            )}

            <Card>
                <CardHeader className="border-b">
                    <div className="flex items-center gap-3">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                            <CalendarDays className="size-5" aria-hidden />
                        </span>
                        <div className="space-y-0.5">
                            <CardTitle className="text-base">Daftar event</CardTitle>
                            <CardDescription>{description()}</CardDescription>
                        </div>
                    </div>
                    <CardAction>
                        <Button variant="outline" onClick={() => list.refetch()} disabled={list.isFetching}>
                            <RefreshCw
                                className={list.isFetching ? "animate-spin" : undefined}
                                data-icon="inline-start"
                                aria-hidden
                            />
                            Refresh
                        </Button>
                    </CardAction>
                </CardHeader>

                <CardContent className="px-0">
                    {list.isError ? (
                        <div className="px-(--card-spacing)">
                            <Alert variant="destructive">
                                <CircleAlert aria-hidden />
                                <AlertTitle>Data event gagal dimuat</AlertTitle>
                                <AlertDescription>{list.error.message}</AlertDescription>
                            </Alert>
                        </div>
                    ) : (
                        <EventTable
                            events={list.isPending ? undefined : list.data.events}
                            stale={list.isPlaceholderData}
                            onDelete={setDeleteTarget}
                        />
                    )}
                </CardContent>

                {list.data && (
                    <CardFooter>
                        <AdminTablePagination
                            meta={list.data.meta}
                            itemLabel="event"
                            disabled={list.isPlaceholderData}
                            onPageChange={setPage}
                        />
                    </CardFooter>
                )}
            </Card>

            {deleteTarget && (
                <DeleteEventDialog
                    key={deleteTarget.id}
                    event={deleteTarget}
                    onClose={() => setDeleteTarget(null)}
                    onDeleted={handleDeleted}
                />
            )}
        </div>
    );
}
