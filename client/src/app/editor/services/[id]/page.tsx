import type { Metadata } from "next";
import { ServiceFormView } from "../features/service-form-view";

export const metadata: Metadata = {
    title: "Edit Layanan - FITALENTA",
};

type PageProps = {
    params: Promise<{ id: string }>;
};

export default async function EditorServiceEditPage({ params }: PageProps) {
    const { id } = await params;
    return <ServiceFormView serviceId={Number(id)} />;
}
