import type { Metadata } from "next";
import { CategoryManagementView } from "./features/category-management-view";

export const metadata: Metadata = {
    title: "Kategori Program - FITALENTA",
};

export default function AdminProgramCategoryPage() {
    return <CategoryManagementView />;
}
