import axios from "axios";
import { ApiError, type ApiFieldError } from "@/lib/api-error";

function toFieldErrors(value: unknown): ApiFieldError[] | undefined {
    if (!Array.isArray(value)) return undefined;
    const list = value.filter(
        (item): item is ApiFieldError =>
            typeof item?.field === "string" && typeof item?.message === "string",
    );
    return list.length > 0 ? list : undefined;
}

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.response.use(
    (response) => response,
    (error: unknown) => {
        if (axios.isAxiosError(error)) {
            const data = error.response?.data as
                | { message?: string; code?: string; details?: unknown; errors?: unknown }
                | undefined;
            const message = data?.message ?? "Something went wrong. Please try again.";
            return Promise.reject(new ApiError(message, {
                status: error.response?.status,
                code: data?.code,
                details: toFieldErrors(data?.details ?? data?.errors),
            }),);
        }
        return Promise.reject(error);
    },
);