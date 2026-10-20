import { api } from "@/lib/axios";
import type { DownloadedFile } from "@/types/admin/financial-report";

async function readBlobMessage(blob: Blob, fallback: string): Promise<string> {
    try {
        const body = JSON.parse(await blob.text()) as { message?: string };
        return body.message ?? fallback;
    } catch {
        return fallback;
    }
}

function filenameFromHeader(header: unknown): string | null {
    if (typeof header !== "string") return null;
    const match = /filename\*?=(?:UTF-8'')?"?([^";]+)"?/i.exec(header);
    return match ? decodeURIComponent(match[1]) : null;
}

type FetchFileOptions = {
    params?: Record<string, unknown>;
    fallbackName: string;
    errorMessage: string;
};

export async function fetchFile(path: string, { params, fallbackName, errorMessage }: FetchFileOptions): Promise<DownloadedFile> {
    const response = await api.get<Blob>(path, {
        params,
        responseType: "blob",
        validateStatus: () => true,
    });

    if (response.status >= 400) throw new Error(await readBlobMessage(response.data, errorMessage));

    return {
        blob: response.data,
        filename: filenameFromHeader(response.headers["content-disposition"]) ?? fallbackName,
    };
}

export function saveFile({ blob, filename }: DownloadedFile) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
}
