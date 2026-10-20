import type { Metadata } from "next";
import { TestimonialManagementView } from "./features/testimonial-management-view";

export const metadata: Metadata = {
    title: "Manajemen Testimoni - FITALENTA",
};

export default function EditorTestimonialsPage() {
    return <TestimonialManagementView />;
}
