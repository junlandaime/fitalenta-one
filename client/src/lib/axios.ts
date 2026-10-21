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
    baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
    timeout: 6000,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    // When executing on the Node.js server (SSR), bypass external domain / reverse proxy
    // and connect directly to the Express backend on localhost for maximum speed and reliability
    if (typeof window === "undefined") {
        const internalApi = process.env.INTERNAL_API_URL || "http://127.0.0.1:5000/api";
        config.baseURL = internalApi;
    } else {
        // In browser: if baseURL is missing or points to the broken api subdomain or old port,
        // route through Next.js rewrites via relative "/api"
        if (
            !config.baseURL ||
            config.baseURL.includes("api.fitalenta.co.id") ||
            config.baseURL.includes("5001")
        ) {
            config.baseURL = "/api";
        }
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error: unknown) => {
        if (axios.isAxiosError(error)) {
            const data = error.response?.data as
                | { message?: string; code?: string; details?: unknown; errors?: unknown }
                | undefined;
            const message = data?.message ?? "Something went wrong. Please try again.";
            return Promise.reject(
                new ApiError(message, {
                    status: error.response?.status,
                    code: data?.code,
                    details: toFieldErrors(data?.details ?? data?.errors),
                }),
            );
        }
        return Promise.reject(error);
    },
);
