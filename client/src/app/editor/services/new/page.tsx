import type { Metadata } from "next";
import { ServiceFormView } from "../features/service-form-view";

export const metadata: Metadata = {
    title: "Tambah Layanan - FITALENTA",
};

export default function EditorServiceCreatePage() {
    return <ServiceFormView />;
}
