import { z } from "zod";
import { CONTENT_LIMITS } from "@/constants/editor/editor-content-constant";
import { optionalDateTime, requiredSelectId, requiredText } from "@/schemas/editor/editor-common";

export type ArticleFormValues = {
    title: string;
    excerpt: string;
    content: string;
    categoryId: string;
    publishedAt: string;
    isFeatured: boolean;
};

type ArticleSchemaOptions = {
    hadPublishDate?: boolean;
};

export function buildArticleSchema({ hadPublishDate = false }: ArticleSchemaOptions = {}) {
    return z
        .object({
            title: requiredText("Judul", CONTENT_LIMITS.short),
            excerpt: requiredText("Ringkasan", CONTENT_LIMITS.excerpt),
            content: requiredText("Konten", CONTENT_LIMITS.long),
            categoryId: requiredSelectId("Kategori"),
            publishedAt: optionalDateTime("Tanggal terbit"),
            isFeatured: z.boolean(),
        })
        .refine((data) => !hadPublishDate || data.publishedAt !== null, {
            path: ["publishedAt"],
            message: "Tanggal terbit yang sudah diisi tidak dapat dikosongkan. Ubah ke tanggal lain.",
        });
}
