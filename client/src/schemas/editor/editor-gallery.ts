import { z } from "zod";
import { CONTENT_LIMITS } from "@/constants/editor/editor-content-constant";
import { optionalDate, optionalText, requiredInt, requiredSelectId, requiredText } from "@/schemas/editor/editor-common";

export type GalleryFormValues = {
    title: string;
    categoryId: string;
    description: string;
    eventDate: string;
    order: string;
    isFeatured: boolean;
};

type GallerySchemaOptions = {
    hadEventDate?: boolean;
};

export function buildGallerySchema({ hadEventDate = false }: GallerySchemaOptions = {}) {
    return z
        .object({
            title: requiredText("Judul", CONTENT_LIMITS.short),
            categoryId: requiredSelectId("Kategori"),
            description: optionalText("Deskripsi", CONTENT_LIMITS.galleryDescription),
            eventDate: optionalDate("Tanggal kegiatan"),
            order: requiredInt("Urutan", 0, CONTENT_LIMITS.order),
            isFeatured: z.boolean(),
        })
        .refine((data) => !hadEventDate || data.eventDate !== null, {
            path: ["eventDate"],
            message: "Tanggal kegiatan yang sudah diisi tidak dapat dikosongkan. Ubah ke tanggal lain.",
        });
}
