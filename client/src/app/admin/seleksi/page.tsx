import { Suspense } from "react";
import { AdminPageSkeleton } from "@/components/admin/admin-page-skeleton";
import type { Metadata } from "next";
import { SelectionManagementView } from "./features/selection-management-view";

export const metadata: Metadata = {
    title: "Manajemen Seleksi & Penyaluran - FITALENTA",
};

export default function AdminSelectionPage() {
    return (
        <Suspense fallback={<AdminPageSkeleton />}>
            <SelectionManagementView />
        </Suspense>
    );
}
