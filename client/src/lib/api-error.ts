export type ApiFieldError = { field: string; message: string };

export class ApiError extends Error {
    readonly status?: number;
    readonly code?: string;
    readonly details?: ApiFieldError[];

    constructor(message: string, options: { status?: number; code?: string; details?: ApiFieldError[] } = {}) {
        super(message);
        this.name = "ApiError";
        this.status = options.status;
        this.code = options.code;
        this.details = options.details;
    }
}

export function isApiError(error: unknown): error is ApiError {
    return error instanceof ApiError;
}