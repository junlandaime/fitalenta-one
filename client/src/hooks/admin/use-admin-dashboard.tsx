import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
    getAdminDashboardSummary,
    getAdminFilterOptions,
    getAdminRegistrations,
} from "@/services/admin/admin-dashboard-service";
import type { AdminRegistrationQuery } from "@/types/admin/admin-dashboard";

export function useAdminDashboard(query: AdminRegistrationQuery) {
    const summary = useQuery({
        queryKey: ["admin", "dashboard", "summary"],
        queryFn: getAdminDashboardSummary,
    });
    const options = useQuery({
        queryKey: ["admin", "dashboard", "filters"],
        queryFn: getAdminFilterOptions,
        staleTime: 5 * 60_000,
    });
    const registrations = useQuery({
        queryKey: ["admin", "dashboard", "registrations", query],
        queryFn: () => getAdminRegistrations(query),
        placeholderData: keepPreviousData,
    });

    return {
        summary,
        options,
        registrations,
        isFetching: summary.isFetching || registrations.isFetching,
        refetch: () => Promise.all([summary.refetch(), registrations.refetch()]),
    };
}