"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CircleAlert, MessageSquare, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TableCard } from "@/app/admin/dashboard/features/table-card";
import { AdminTablePagination } from "@/components/admin/admin-table-pagination";
import { useAdminFeedbacks } from "@/hooks/use-feedback";
import { useCurrentUser } from "@/hooks/auth/use-current-user";
import type { FeedbackStatusFilter, UserFeedback } from "@/types/feedback";
import { FeedbackTable } from "./feedback-table";
import { FeedbackDetailSheet } from "./feedback-detail-sheet";

const FILTERS: { value: FeedbackStatusFilter; label: string }[] = [
    { value: "all", label: "Semua status" },
    { value: "OPEN", label: "Open" },
    { value: "IN_PROGRESS", label: "Dalam proses" },
    { value: "RESOLVED", label: "Selesai" },
];

export function FeedbackManagementView() {
    const router = useRouter();
    const { data: user } = useCurrentUser();
    const [page, setPage] = useState(1);
    const [status, setStatus] = useState<FeedbackStatusFilter>("all");
    const [selected, setSelected] = useState<UserFeedback | null>(null);

    useEffect(() => {
        if (user && user.role !== "superadmin") router.replace("/admin/dashboard");
    }, [router, user]);

    const list = useAdminFeedbacks({ page, status });

    function handleStatusChange(value: FeedbackStatusFilter) {
        setStatus(value);
        setPage(1);
    }

    if (user && user.role !== "superadmin") return null;

    return (
        <div className="mx-auto w-full max-w-7xl space-y-6">
            <div className="space-y-1">
                <h2 className="text-2xl font-semibold tracking-tight">Feedback User</h2>
                <p className="max-w-2xl text-sm text-muted-foreground">Tinjau laporan masalah dan masukan dari pengguna.</p>
            </div>

            <TableCard
                title="Daftar feedback"
                description={list.data ? `${list.data.meta.total} feedback ditemukan.` : "Memuat data feedback..."}
            >
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="w-full sm:w-52">
                        <Select value={status} onValueChange={(value) => handleStatusChange(value as FeedbackStatusFilter)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {FILTERS.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <Button variant="outline" onClick={() => list.refetch()} disabled={list.isFetching}>
                        <RefreshCw className={list.isFetching ? "animate-spin" : undefined} data-icon="inline-start" aria-hidden />
                        Refresh
                    </Button>
                </div>

                {list.isError ? (
                    <Alert variant="destructive">
                        <CircleAlert aria-hidden />
                        <AlertTitle>Data feedback gagal dimuat</AlertTitle>
                        <AlertDescription>{list.error.message}</AlertDescription>
                    </Alert>
                ) : (
                    <FeedbackTable
                        items={list.isPending ? undefined : list.data.items}
                        stale={list.isPlaceholderData}
                        onOpen={setSelected}
                    />
                )}

                {list.data && (
                    <div className="mt-4">
                        <AdminTablePagination
                            meta={list.data.meta}
                            itemLabel="feedback"
                            disabled={list.isPlaceholderData}
                            onPageChange={setPage}
                        />
                    </div>
                )}
            </TableCard>

            {selected && (
                <FeedbackDetailSheet
                    key={selected.id}
                    feedback={selected}
                    onClose={() => setSelected(null)}
                />
            )}
        </div>
    );
}
