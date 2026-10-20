import { PHOTO_RULES } from "@/constants/registration-constant";
import { formatIDR } from "@/lib/utils";
import type { Program } from "@/types/program";
import { installmentLabel } from "../program-helper";

export const digitsOnly = (value: string) => value.replace(/\D/g, "");

export function validatePhotoFile(file: File): string | null {
    if (!(PHOTO_RULES.types as readonly string[]).includes(file.type)) {
        return "Format foto harus JPG, PNG, atau WEBP";
    }
    if (file.size > PHOTO_RULES.maxSize) {
        return "Ukuran foto maksimal 5 MB";
    }
    return null;
}

export function focusFirstInvalidField() {
    requestAnimationFrame(() => {
        const element = document.querySelector<HTMLElement>("[aria-invalid='true']");
        element?.scrollIntoView({ behavior: "smooth", block: "center" });
        element?.focus({ preventScroll: true });
    });
}

export function getProgramFacts(program: Program) {
    const downPayment = Number(program.downPayment ?? 0);

    return [
        { label: "Durasi", value: program.duration || "-" },
        { label: "Biaya pelatihan", value: formatIDR(program.trainingCost) },
        { label: "Biaya keberangkatan", value: formatIDR(program.departureCost) },
        { label: "DP / uang muka", value: downPayment > 0 ? formatIDR(downPayment) : "Tidak ada" },
        { label: "Skema pembayaran", value: installmentLabel(program.installmentPlan) },
        { label: "Jadwal", value: program.schedule || "-" },
        { label: "Lokasi", value: program.location || "-" },
    ];
}
