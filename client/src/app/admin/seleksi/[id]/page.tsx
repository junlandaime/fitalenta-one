import { Suspense } from "react";
import { AdminPageSkeleton } from "@/components/admin/admin-page-skeleton";
import type { Metadata } from "next";
import { SelectionDetailView } from "../features/selection-detail-view";

export const metadata: Metadata = {
    title: "Kelola Seleksi & Penyaluran - FITALENTA",
};

type PageProps = {
    params: Promise<{ id: string }>;
};

export default async function AdminSelectionDetailPage({ params }: PageProps) {
    const { id } = await params;

    return (
        <Suspense fallback={<AdminPageSkeleton />}>
            <SelectionDetailView registrationId={Number(id)} />
        </Suspense>
    );
}
