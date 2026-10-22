import { api } from "@/lib/axios";
import { fetchFile } from "@/lib/file-download";
import type { ApiResponse } from "@/types/api";
import type {
    DownloadedFile,
    ParticipantExportFilters,
    ParticipantImportResult,
} from "@/types/admin/admin-participant";

const BASE_URL = "/admin/participants";

const today = () => new Date().toISOString().slice(0, 10);

export function exportParticipants(filters: ParticipantExportFilters): Promise<DownloadedFile> {
    return fetchFile(`${BASE_URL}/export`, {
        params: {
            search: filters.search || undefined,
            programId: filters.programId || undefined,
            registrationStatus: filters.registrationStatus === "all" ? undefined : filters.registrationStatus,
        },
        fallbackName: `data-peserta-${today()}.xlsx`,
        errorMessage: "Data peserta gagal diekspor. Silakan coba lagi.",
    });
}

export function downloadParticipantTemplate(): Promise<DownloadedFile> {
    return fetchFile(`${BASE_URL}/template`, {
        fallbackName: "template-data-peserta-fitalenta.xlsx",
        errorMessage: "Template gagal diunduh. Silakan coba lagi.",
    });
}

type ImportVariables = { file: File; dryRun: boolean };

export async function importParticipants({ file, dryRun }: ImportVariables): Promise<ParticipantImportResult> {
    const body = new FormData();
    body.append("file", file);
    if (dryRun) body.append("dryRun", "true");

    const { data } = await api.post<ApiResponse<ParticipantImportResult>>(
        `${BASE_URL}/import`,
        body,
        { headers: { "Content-Type": "multipart/form-data" } },
    );
    return data.data;
}
