import { Suspense } from "react";
import { AdminPageSkeleton } from "@/components/admin/admin-page-skeleton";
import type { Metadata } from "next";
import { EventManagementView } from "./features/event-management-view";

export const metadata: Metadata = {
    title: "Manajemen Event - FITALENTA",
};

export default function EditorEventsPage() {
    return (
        <Suspense fallback={<AdminPageSkeleton />}>
            <EventManagementView />
        </Suspense>
    );
}