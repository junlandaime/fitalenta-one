import { z } from "zod";
import { SERVICE_LIMITS } from "@/constants/editor/editor-service-constant";
import { optionalText, requiredText } from "@/schemas/editor/editor-common";

export type ServiceFormValues = {
    title: string;
    slug: string;
    icon: string;
    summary: string;
    intro: string;
    listTitle: string;
    secondParagraph: string;
    closing: string;
    images: string;
    isFeatured: boolean;
};

export type ServicePointValue = { title: string; desc: string };

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const isHttpUrlOrPath = (value: string) => value === "" || /^https?:\/\/\S+$/.test(value) || value.startsWith("/");

export function buildServiceSchema() {
    return z.object({
        title: requiredText("Judul layanan", SERVICE_LIMITS.title),
        slug: requiredText("Slug", SERVICE_LIMITS.slug).refine(
            (value) => SLUG_PATTERN.test(value),
            "Slug hanya boleh huruf kecil, angka, dan tanda hubung (mis. event-organizer)",
        ),
        icon: optionalText("Ikon", SERVICE_LIMITS.icon),
        summary: requiredText("Ringkasan", SERVICE_LIMITS.summary),
        intro: requiredText("Paragraf pembuka", SERVICE_LIMITS.intro),
        listTitle: optionalText("Judul daftar", SERVICE_LIMITS.listTitle),
        secondParagraph: optionalText("Paragraf lanjutan", SERVICE_LIMITS.paragraph),
        closing: optionalText("Paragraf penutup", SERVICE_LIMITS.paragraph),
        images: optionalText("URL gambar", SERVICE_LIMITS.imageUrl).refine(
            isHttpUrlOrPath,
            "Isi dengan URL (https://...) atau path yang diawali /",
        ),
        isFeatured: z.boolean(),
        points: z
            .array(
                z.object({
                    title: requiredText("Judul poin", SERVICE_LIMITS.pointTitle),
                    desc: requiredText("Deskripsi poin", SERVICE_LIMITS.pointDesc),
                }),
            )
            .max(SERVICE_LIMITS.points, `Maksimal ${SERVICE_LIMITS.points} poin`),
    });
}
