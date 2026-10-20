import type { Metadata } from "next";
import { EventFormView } from "../features/event-form-view";

export const metadata: Metadata = {
    title: "Tambah Event - FITALENTA",
};

export default function EditorEventCreatePage() {
    return <EventFormView />;
}
