"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    downloadParticipantTemplate,
    exportParticipants,
    importParticipants,
} from "@/services/admin/admin-participant-service";
import type { ParticipantExportFilters } from "@/types/admin/admin-participant";

export function useExportParticipants() {
    return useMutation({ mutationFn: (filters: ParticipantExportFilters) => exportParticipants(filters) });
}

export function useDownloadParticipantTemplate() {
    return useMutation({ mutationFn: downloadParticipantTemplate });
}

export function useImportParticipants() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: importParticipants,
        onSuccess: (result) => {
            if (!result.committed) return;
            queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
            queryClient.invalidateQueries({ queryKey: ["admin", "selection-placements"] });
            queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
        },
    });
}
