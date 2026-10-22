import type { Metadata } from "next";
import { ParticipantManagementView } from "./features/participant-management-view";

export const metadata: Metadata = {
    title: "Data Peserta - Admin FITALENTA",
};

export default function PesertaPage() {
    return <ParticipantManagementView />;
}
