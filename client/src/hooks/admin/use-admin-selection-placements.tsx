"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    getParticipant,
    getParticipants,
    getSelectionPlacementOptions,
    getSelectionPlacementSummary,
    updateParticipant,
} from "@/services/admin/admin-selection-placement-service";
import type { ParticipantParams, ParticipantUpdatePayload } from "@/types/admin/selection-placement";

const SELECTION_PLACEMENTS_KEY = ["admin", "selection-placements"] as const;

export function useAdminParticipants(params: ParticipantParams) {
    return useQuery({
        queryKey: [...SELECTION_PLACEMENTS_KEY, "list", params],
        queryFn: () => getParticipants(params),
        placeholderData: keepPreviousData,
    });
}

export function useAdminSelectionSummary() {
    return useQuery({
        queryKey: [...SELECTION_PLACEMENTS_KEY, "summary"],
        queryFn: getSelectionPlacementSummary,
    });
}

export function useAdminSelectionOptions() {
    return useQuery({
        queryKey: [...SELECTION_PLACEMENTS_KEY, "options"],
        queryFn: getSelectionPlacementOptions,
        staleTime: 5 * 60_000,
    });
}

export function useAdminParticipant(id: number | undefined) {
    return useQuery({
        queryKey: [...SELECTION_PLACEMENTS_KEY, "detail", id],
        queryFn: () => getParticipant(id as number),
        enabled: id !== undefined,
    });
}

export function useUpdateAdminParticipant(id: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: ParticipantUpdatePayload) => updateParticipant(id, payload),
        onSuccess: (participant) => {
            queryClient.setQueryData([...SELECTION_PLACEMENTS_KEY, "detail", id], participant);
            queryClient.invalidateQueries({ queryKey: SELECTION_PLACEMENTS_KEY });
            queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
        },
    });
}
