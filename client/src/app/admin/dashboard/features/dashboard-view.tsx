"use client";

import { useEffect, useState } from "react";
import { CircleAlert } from "lucide-react";
import { LayoutDashboard } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminDashboard } from "@/hooks/admin/use-admin-dashboard";
import type { AdminRegistrationQuery } from "@/types/admin/admin-dashboard";
import { RegistrationFilters } from "./registration-filters";
import { RegistrationsTable } from "./registrations-table";
import { StatCards } from "./stat-cards";

const PAGE_SIZE = 20;

const INITIAL_QUERY: AdminRegistrationQuery = {
    search: "",
    programId: "",
    paymentStatus: "",
    selectionStatus: "",
    placementStatus: "",
    page: 1,
    limit: PAGE_SIZE,
};

function ErrorAlert({ title, message }: { title: string; message: string }) {
    return (
        <Alert variant="destructive">
            <CircleAlert aria-hidden />
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
        </Alert>
    );
}

export function DashboardView() {
    const [query, setQuery] = useState(INITIAL_QUERY);
    const [searchInput, setSearchInput] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => {
            setQuery((q) => (q.search === searchInput ? q : { ...q, search: searchInput, page: 1 }));
        }, 400);
        return () => clearTimeout(timer);
    }, [searchInput]);

    const { summary, options, registrations, isFetching, refetch } = useAdminDashboard(query);

    const updateFilters = (patch: Partial<AdminRegistrationQuery>) =>
        setQuery((q) => ({ ...q, ...patch, page: 1 }));

    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <p className="flex items-center gap-1.5 text-[10px] font-semibold tracking-wider text-orange-600 uppercase">
                    <LayoutDashboard className="size-3" aria-hidden />
                    Admin Control Center
                </p>
                <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
                <p className="text-sm text-muted-foreground">
                    Pantau pendaftaran, pembayaran, seleksi, dan perkembangan peserta FITALENTA dalam satu halaman.
                </p>
            </div>

            {summary.isPending ? (
                <div aria-busy="true" aria-label="Memuat statistik" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {Array.from({ length: 4 }, (_, i) => (
                        <Skeleton key={i} className="h-36 rounded-xl" />
                    ))}
                </div>
            ) : summary.isError ? (
                <ErrorAlert title="Statistik gagal dimuat" message={summary.error.message} />
            ) : (
                <StatCards summary={summary.data} />
            )}

            <RegistrationFilters
                search={searchInput}
                query={query}
                options={options.data}
                onSearchChange={setSearchInput}
                onChange={updateFilters}
            />

            {registrations.isPending ? (
                <Skeleton aria-busy="true" aria-label="Memuat data pendaftar" className="h-96 rounded-xl" />
            ) : registrations.isError ? (
                <ErrorAlert title="Data pendaftar gagal dimuat" message={registrations.error.message} />
            ) : (
                <RegistrationsTable
                    rows={registrations.data.items}
                    meta={registrations.data.meta}
                    isFetching={isFetching}
                    onRefresh={() => refetch()}
                    onPageChange={(page) => setQuery((q) => ({ ...q, page }))}
                />
            )}
        </div>
    );
}