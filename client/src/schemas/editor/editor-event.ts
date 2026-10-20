import { z } from "zod";
import { CONTENT_LIMITS } from "@/constants/editor/editor-content-constant";
import {
    optionalPositiveInt,
    optionalText,
    requiredDateTime,
    requiredSelectId,
    requiredText,
} from "@/schemas/editor/editor-common";

export type EventFormValues = {
    title: string;
    description: string;
    location: string;
    eventDate: string;
    link: string;
    maxParticipants: string;
    categoryId: string;
    isFeatured: boolean;
};

const isHttpUrl = (value: string) => {
    if (value === "") return true;
    try {
        const url = new URL(value);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch {
        return false;
    }
};

type EventSchemaOptions = {
    hadMaxParticipants?: boolean;
};

export function buildEventSchema({ hadMaxParticipants = false }: EventSchemaOptions = {}) {
    return z
        .object({
            title: requiredText("Judul event", CONTENT_LIMITS.short),
            description: requiredText("Deskripsi", CONTENT_LIMITS.long),
            location: requiredText("Lokasi", CONTENT_LIMITS.short),
            eventDate: requiredDateTime("Tanggal & waktu"),
            link: optionalText("Tautan pendaftaran", CONTENT_LIMITS.short).refine(
                isHttpUrl,
                "Tautan harus diawali http:// atau https://",
            ),
            maxParticipants: optionalPositiveInt("Kuota peserta", CONTENT_LIMITS.participants),
            categoryId: requiredSelectId("Kategori"),
            isFeatured: z.boolean(),
        })
        .refine((data) => !hadMaxParticipants || data.maxParticipants !== null, {
            path: ["maxParticipants"],
            message: "Kuota yang sudah diisi tidak dapat dikosongkan. Isi dengan angka baru.",
        });
}
