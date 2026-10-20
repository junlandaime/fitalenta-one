"use client";

import { useState } from "react";
import { CircleAlert, CircleCheck, Plus, RefreshCw, Users, X } from "lucide-react";
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
import { useDebounced } from "@/hooks/use-debounced";
import { MEMBER_KINDS, type MemberKind } from "@/constants/editor/editor-team-member-constant";
import { useEditorMembers } from "@/hooks/editor/use-editor-team-members";
import type { EditorMember, EditorMemberParams } from "@/types/editor/editor-team-member";
import { DeleteMemberDialog } from "./delete-member-dialog";
import { MemberFormSheet } from "./member-form-sheet";
import { MemberStatCards } from "./member-stat-cards";
import { MemberTable } from "./member-table";
import { MemberToolbar } from "./member-toolbar";

export function MemberSection({ kind }: { kind: MemberKind }) {
    const { noun, shownIn } = MEMBER_KINDS[kind];
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [isActive, setIsActive] = useState<EditorMemberParams["isActive"]>("all");

    const [formTarget, setFormTarget] = useState<EditorMember | "new" | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<EditorMember | null>(null);
    const [notice, setNotice] = useState<string | null>(null);

    const debouncedSearch = useDebounced(search);
    const params: EditorMemberParams = { page, search: debouncedSearch.trim(), isActive };
    const list = useEditorMembers(kind, params);

    const isFiltered = params.search !== "" || isActive !== "all";

    function handleSearchChange(value: string) {
        setSearch(value);
        setPage(1);
    }

    function handleStatusChange(value: EditorMemberParams["isActive"]) {
        setIsActive(value);
        setPage(1);
    }

    function handleSaved(message: string) {
        setFormTarget(null);
        setNotice(message);
    }

    function handleDeleted(item: EditorMember) {
        setDeleteTarget(null);
        setNotice(`${item.name} berhasil dihapus.`);
        if (page > 1 && list.data?.items.length === 1) setPage(page - 1);
    }

    function description() {
        if (!list.data) return `Memuat data ${noun}...`;
        if (isFiltered) return `${list.data.meta.total} ${noun} cocok dengan filter.`;
        return `Menampilkan ${list.data.meta.total} ${noun} untuk ${shownIn}, diurutkan berdasarkan urutan tampil.`;
    }

    return (
        <div role="tabpanel" id={`team-panel-${kind}`} aria-labelledby={`team-tab-${kind}`} className="space-y-6">
            <MemberStatCards kind={kind} summary={list.data?.summary} />

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
                            <Users className="size-5" aria-hidden />
                        </span>
                        <div className="space-y-0.5">
                            <CardTitle className="text-base">{`Daftar ${noun}`}</CardTitle>
                            <CardDescription>{description()}</CardDescription>
                        </div>
                    </div>
                    <CardAction className="flex gap-2">
                        <Button variant="outline" onClick={() => list.refetch()} disabled={list.isFetching}>
                            <RefreshCw
                                className={list.isFetching ? "animate-spin" : undefined}
                                data-icon="inline-start"
                                aria-hidden
                            />
                            Refresh
                        </Button>
                        <Button onClick={() => setFormTarget("new")}>
                            <Plus data-icon="inline-start" aria-hidden />
                            {`Tambah ${noun}`}
                        </Button>
                    </CardAction>
                </CardHeader>

                <CardContent>
                    <MemberToolbar
                        kind={kind}
                        search={search}
                        isActive={isActive}
                        onSearchChange={handleSearchChange}
                        onStatusChange={handleStatusChange}
                    />
                </CardContent>

                <CardContent className="px-0">
                    {list.isError ? (
                        <div className="px-(--card-spacing)">
                            <Alert variant="destructive">
                                <CircleAlert aria-hidden />
                                <AlertTitle>{`Data ${noun} gagal dimuat`}</AlertTitle>
                                <AlertDescription>{list.error.message}</AlertDescription>
                            </Alert>
                        </div>
                    ) : (
                        <MemberTable
                            kind={kind}
                            items={list.isPending ? undefined : list.data.items}
                            stale={list.isPlaceholderData}
                            emptyMessage={
                                isFiltered
                                    ? `Tidak ada ${noun} yang cocok dengan filter.`
                                    : `Belum ada ${noun}. Klik "Tambah ${noun}" untuk membuat yang pertama.`
                            }
                            onEdit={setFormTarget}
                            onDelete={setDeleteTarget}
                        />
                    )}
                </CardContent>

                {list.data && (
                    <CardFooter>
                        <AdminTablePagination
                            meta={list.data.meta}
                            itemLabel={noun}
                            disabled={list.isPlaceholderData}
                            onPageChange={setPage}
                        />
                    </CardFooter>
                )}
            </Card>

            {formTarget && (
                <MemberFormSheet
                    key={formTarget === "new" ? "new" : formTarget.id}
                    kind={kind}
                    target={formTarget}
                    onClose={() => setFormTarget(null)}
                    onSaved={handleSaved}
                />
            )}

            {deleteTarget && (
                <DeleteMemberDialog
                    key={deleteTarget.id}
                    kind={kind}
                    item={deleteTarget}
                    onClose={() => setDeleteTarget(null)}
                    onDeleted={handleDeleted}
                />
            )}
        </div>
    );
}
