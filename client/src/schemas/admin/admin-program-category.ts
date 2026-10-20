import { z } from "zod";
import { PROGRAM_CATEGORY_LIMITS } from "@/constants/admin/admin-program-category-constant";

const { nameMin, nameMax, descriptionMax } = PROGRAM_CATEGORY_LIMITS;

export const programCategorySchema = z.object({
    name: z
        .string()
        .trim()
        .min(nameMin, `Nama kategori minimal ${nameMin} karakter`)
        .max(nameMax, `Nama kategori maksimal ${nameMax} karakter`),
    description: z.string().trim().max(descriptionMax, `Deskripsi maksimal ${descriptionMax} karakter`),
});

export type ProgramCategoryFormValues = z.input<typeof programCategorySchema>;
