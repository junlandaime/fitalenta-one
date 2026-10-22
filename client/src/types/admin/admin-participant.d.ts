export type ParticipantExportFilters = {
    search?: string;
    programId?: number;
    registrationStatus?: "menunggu" | "lolos" | "tidak_lolos" | "all";
};

export type ParticipantImportError = {
    row: number;
    email: string;
    programName: string;
    reason: string;
};

export type ParticipantImportResult = {
    success: number;
    errors: ParticipantImportError[];
    committed: boolean;
};

export type ParticipantImportParseError = {
    row: number;
    reason: string;
};

export type DownloadedFile = {
    blob: Blob;
    filename: string;
};
