import { api } from "@/lib/axios";
import { PARTICIPANTS_PER_PAGE } from "@/constants/admin/selection-placement-constant";
import type { ApiResponse } from "@/types/api";
import type { AdminPageMeta } from "@/types/pagination";
import type {
    Participant,
    ParticipantList,
    ParticipantParams,
    ParticipantUpdatePayload,
    SelectionPlacementOptions,
    SelectionPlacementSummary,
} from "@/types/admin/selection-placement";

const BASE_URL = "/admin/selection-placements";

export async function getSelectionPlacementSummary(): Promise<SelectionPlacementSummary> {
    const { data } = await api.get<ApiResponse<SelectionPlacementSummary>>(`${BASE_URL}/summary`);
    return data.data;
}

export async function getSelectionPlacementOptions(): Promise<SelectionPlacementOptions> {
    const { data } = await api.get<ApiResponse<SelectionPlacementOptions>>(`${BASE_URL}/options`);
    return data.data;
}

export async function getParticipants(params: ParticipantParams): Promise<ParticipantList> {
    const { data } = await api.get<{ success: boolean; data: Participant[]; meta: AdminPageMeta }>(BASE_URL, {
        params: {
            page: params.page,
            limit: PARTICIPANTS_PER_PAGE,
            search: params.search || undefined,
            selectionStatus: params.selectionStatus === "all" ? undefined : params.selectionStatus,
            placementStatus: params.placementStatus === "all" ? undefined : params.placementStatus,
        },
    });
    return { items: data.data, meta: data.meta };
}

export async function getParticipant(id: number): Promise<Participant> {
    const { data } = await api.get<ApiResponse<Participant>>(`${BASE_URL}/${id}`);
    return data.data;
}

export async function updateParticipant(id: number, payload: ParticipantUpdatePayload): Promise<Participant> {
    const { data } = await api.put<ApiResponse<Participant>>(`${BASE_URL}/${id}`, payload);
    return data.data;
}
