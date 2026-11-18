import { z } from "zod";
import { BANNER_LIMITS } from "@/constants/editor/editor-banner-constant";
import { optionalDateTime, optionalText, requiredText } from "@/schemas/editor/editor-common";

const LINK_PATTERN = /^(https?:\/\/\S+|\/(?!\/)\S*)$/i;

export type BannerFormValues = {
    title: string;
    subtitle: string;
    ctaLabel: string;
    linkUrl: string;
    startsAt: string;
    endsAt: string;
    isActive: boolean;
};

export function buildBannerSchema() {
    return z
        .object({
            title: requiredText("Judul", BANNER_LIMITS.title),
            subtitle: optionalText("Subjudul", BANNER_LIMITS.subtitle),
            ctaLabel: optionalText("Teks tombol", BANNER_LIMITS.ctaLabel),
            linkUrl: optionalText("Tautan", BANNER_LIMITS.linkUrl).refine(
                (value) => value === "" || LINK_PATTERN.test(value),
                "Tautan harus diawali http://, https://, atau / (halaman internal)",
            ),
            startsAt: optionalDateTime("Waktu mulai"),
            endsAt: optionalDateTime("Waktu berakhir"),
            isActive: z.boolean(),
        })
        .refine((data) => !data.startsAt || !data.endsAt || Date.parse(data.endsAt) > Date.parse(data.startsAt), {
            message: "Waktu berakhir harus setelah waktu mulai",
            path: ["endsAt"],
        });
}