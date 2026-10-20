"use client";

import { useState } from "react";
import { CircleAlert, CircleCheck, Plus, RefreshCw, Users, X } from "lucide-react";
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
import { useAdminUsers, useAdminUserSummary } from "@/hooks/admin/use-admin-users";
import { useCurrentUser } from "@/hooks/auth/use-current-user";
import { useDebounced } from "@/hooks/use-debounced";
import type { AdminUser, AdminUserParams } from "@/types/admin/admin-user";
import { DeleteUserDialog } from "./delete-user-dialog";
import { TablePagination } from "./table-pagination";
import { UserFormSheet } from "./user-form-sheet";
import { UserStatCards } from "./user-stat-cards";
import { UserTable } from "./user-table";
import { UserToolbar } from "./user-toolbar";

export function UserManagementView() {
    const { data: me } = useCurrentUser();

    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState("");
    const [role, setRole] = useState<AdminUserParams["role"]>("all");
    const search = useDebounced(searchInput.trim());

    const [formTarget, setFormTarget] = useState<AdminUser | "new" | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);
    const [notice, setNotice] = useState<string | null>(null);

    const list = useAdminUsers({ page, search, role });
    const summary = useAdminUserSummary();

    const filtered = Boolean(search) || role !== "all";
    const refreshing = list.isFetching || summary.isFetching;

    function handleSearchChange(value: string) {
        setSearchInput(value);
        setPage(1);
    }

    function handleRoleChange(value: AdminUserParams["role"]) {
        setRole(value);
        setPage(1);
    }

    function handleSaved(message: string) {
        setFormTarget(null);
        setNotice(message);
    }

    function handleDeleted(user: AdminUser) {
        setDeleteTarget(null);
        setNotice(`Akun ${user.name} berhasil dihapus.`);
        if (page > 1 && list.data?.users.length === 1) setPage(page - 1);
    }

    function description() {
        if (!list.data) return "Memuat data pengguna...";
        if (filtered) return `${list.data.meta.total} user cocok dengan filter.`;
        return `Menampilkan ${list.data.meta.total} akun pengguna yang terdaftar pada sistem.`;
    }

    return (
        <div className="mx-auto w-full max-w-7xl space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-2xl font-semibold tracking-tight">Manajemen User</h2>
                    <p className="max-w-2xl text-sm text-muted-foreground">
                        Kelola akun peserta dan administrator, informasi kontak, serta hak akses pengguna FITALENTA.
                    </p>
                </div>
                <Button onClick={() => setFormTarget("new")}>
                    <Plus data-icon="inline-start" aria-hidden />
                    Tambah user
                </Button>
            </div>

            <UserStatCards summary={summary.data} />

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
                            <CardTitle className="text-base">Daftar user</CardTitle>
                            <CardDescription>{description()}</CardDescription>
                        </div>
                    </div>
                    <CardAction>
                        <Button
                            variant="outline"
                            onClick={() => {
                                list.refetch();
                                summary.refetch();
                            }}
                            disabled={refreshing}
                        >
                            <RefreshCw
                                className={refreshing ? "animate-spin" : undefined}
                                data-icon="inline-start"
                                aria-hidden
                            />
                            Refresh
                        </Button>
                    </CardAction>
                </CardHeader>

                <CardContent>
                    <UserToolbar
                        search={searchInput}
                        role={role}
                        onSearchChange={handleSearchChange}
                        onRoleChange={handleRoleChange}
                    />
                </CardContent>

                <CardContent className="px-0">
                    {list.isError ? (
                        <div className="px-(--card-spacing)">
                            <Alert variant="destructive">
                                <CircleAlert aria-hidden />
                                <AlertTitle>Data user gagal dimuat</AlertTitle>
                                <AlertDescription>{list.error.message}</AlertDescription>
                            </Alert>
                        </div>
                    ) : (
                        <UserTable
                            users={list.isPending ? undefined : list.data.users}
                            currentUserId={me ? String(me.userId) : undefined}
                            stale={list.isPlaceholderData}
                            onEdit={setFormTarget}
                            onDelete={setDeleteTarget}
                        />
                    )}
                </CardContent>

                {list.data && (
                    <CardFooter>
                        <TablePagination
                            meta={list.data.meta}
                            disabled={list.isPlaceholderData}
                            onPageChange={setPage}
                        />
                    </CardFooter>
                )}
            </Card>

            {formTarget && (
                <UserFormSheet
                    key={formTarget === "new" ? "new" : formTarget.id}
                    target={formTarget}
                    isSelf={formTarget !== "new" && String(formTarget.id) === String(me?.userId)}
                    onClose={() => setFormTarget(null)}
                    onSaved={handleSaved}
                />
            )}

            {deleteTarget && (
                <DeleteUserDialog
                    key={deleteTarget.id}
                    user={deleteTarget}
                    onClose={() => setDeleteTarget(null)}
                    onDeleted={handleDeleted}
                />
            )}
        </div>
    );
}
