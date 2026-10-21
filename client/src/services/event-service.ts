import { cache } from "react";
import { api } from "@/lib/axios";
import type {
    EventDetailData,
    EventItem,
    EventsListData,
} from "@/types/event";
import type { ApiResponse } from "@/types/api";

export async function getEvents(
    params: { search?: string; page?: number } = {},
): Promise<EventsListData> {
    try {
        const { data } = await api.get<ApiResponse<EventsListData>>("/events", {
            params: {
                search: params.search || undefined,
                page: params.page && params.page > 1 ? params.page : undefined,
            },
        });
        return data.data ?? { events: [], pagination: { page: 1, perPage: 6, total: 0, totalPages: 0 } };
    } catch {
        return { events: [], pagination: { page: 1, perPage: 6, total: 0, totalPages: 0 } };
    }
}

export async function getFeaturedEvents(): Promise<EventItem[]> {
    try {
        const { data } = await api.get<ApiResponse<EventItem[]>>("/events/featured");
        return data.data ?? [];
    } catch {
        return [];
    }
}

export const getEventBySlug = cache(
    async (slug: string): Promise<EventDetailData | undefined> => {
        const res = await api.get<ApiResponse<EventDetailData>>(`/events/${slug}`, {
            validateStatus: (s) => s < 500,
        });
        if (res.status === 404) return undefined;
        if (!res.data.success) {
            throw new Error(res.data.message ?? "Gagal memuat event");
        }
        return res.data.data;
    },
);
