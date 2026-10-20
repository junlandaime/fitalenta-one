import { Suspense } from "react";
import { AdminPageSkeleton } from "@/components/admin/admin-page-skeleton";
import type { Metadata } from "next";
import { ArticleManagementView } from "./features/article-management-view";

export const metadata: Metadata = {
    title: "Manajemen Artikel - FITALENTA",
};

export default function EditorArticlesPage() {
    return (
        <Suspense fallback={<AdminPageSkeleton />}>
            <ArticleManagementView />
        </Suspense>
    );
}