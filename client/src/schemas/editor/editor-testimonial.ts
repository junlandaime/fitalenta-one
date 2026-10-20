import { z } from "zod";
import { TESTIMONIAL_LIMITS } from "@/constants/editor/editor-testimonial-constant";
import { requiredInt, requiredText } from "@/schemas/editor/editor-common";

export type TestimonialFormValues = {
    clientName: string;
    company: string;
    content: string;
    rating: string;
};

export function buildTestimonialSchema() {
    return z.object({
        clientName: requiredText("Nama klien", TESTIMONIAL_LIMITS.clientName),
        company: requiredText("Perusahaan", TESTIMONIAL_LIMITS.company),
        content: requiredText("Isi testimoni", TESTIMONIAL_LIMITS.content),
        rating: requiredInt("Rating", 1, 5),
    });
}
