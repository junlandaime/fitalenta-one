import type { AdminPageMeta } from "@/types/pagination";

export type AdminProgramCategory = {
    id: number;
    name: string;
    description: string | null;
    programCount: number;
    createdAt: string;
};

export type AdminProgramCategoryList = {
    categories: AdminProgramCategory[];
    meta: AdminPageMeta;
};

export type AdminProgramCategoryParams = {
    page: number;
    search: string;
};

export type AdminProgramCategoryCreatePayload = {
    name: string;
    description?: string;
};

export type AdminProgramCategoryUpdatePayload = Partial<AdminProgramCategoryCreatePayload>;
