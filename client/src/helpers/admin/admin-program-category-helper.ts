import type {
    AdminProgramCategory,
    AdminProgramCategoryUpdatePayload,
} from "@/types/admin/admin-program-category";

type FormData = {
    name: string;
    description: string;
};

export function buildCategoryUpdatePayload(
    original: AdminProgramCategory,
    data: FormData,
): AdminProgramCategoryUpdatePayload {
    const payload: AdminProgramCategoryUpdatePayload = {};

    if (data.name !== original.name) payload.name = data.name;
    if (data.description !== (original.description ?? "")) payload.description = data.description;

    return payload;
}

export function categoryDeleteHint(category: AdminProgramCategory) {
    if (category.programCount > 0) {
        return `Tidak dapat dihapus: masih dipakai ${category.programCount} program`;
    }
    return undefined;
}
