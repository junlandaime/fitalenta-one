import type { Metadata } from "next";
import { EditorDashboardView } from "./features/editor-dashboard-view";

export const metadata: Metadata = {
    title: "Dashboard Editor - FITALENTA",
};

export default function EditorDashboardPage() {
    return <EditorDashboardView />;
}
