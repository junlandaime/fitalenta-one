import { Suspense } from "react";
import { AdminPageSkeleton } from "@/components/admin/admin-page-skeleton";
import type { Metadata } from "next";
import { ServiceManagementView } from "./features/service-management-view";

export const metadata: Metadata = {
    title: "Manajemen Layanan - FITALENTA",
};

export default function EditorServicesPage() {
    return (
        <Suspense fallback={<AdminPageSkeleton />}>
            <ServiceManagementView />
        </Suspense>
    );
}