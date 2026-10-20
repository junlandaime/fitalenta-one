import type { Metadata } from "next";
import { EventFormView } from "../features/event-form-view";

export const metadata: Metadata = {
    title: "Edit Event - FITALENTA",
};

type PageProps = {
    params: Promise<{ id: string }>;
};

export default async function EditorEventEditPage({ params }: PageProps) {
    const { id } = await params;
    return <EventFormView eventId={Number(id)} />;
}
