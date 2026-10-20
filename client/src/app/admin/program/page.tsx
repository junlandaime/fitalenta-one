import { Suspense } from "react";
import { AdminPageSkeleton } from "@/components/admin/admin-page-skeleton";
import type { Metadata } from "next";
import { ProgramManagementView } from "./features/program-management-view";

export const metadata: Metadata = {
    title: "Manajemen Program - FITALENTA",
};

export default function AdminProgramPage() {
    return (
        <Suspense fallback={<AdminPageSkeleton />}>
            <ProgramManagementView />
        </Suspense>
    );
}
