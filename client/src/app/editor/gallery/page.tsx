import type { Metadata } from "next";
import { GalleryManagementView } from "./features/gallery-management-view";

export const metadata: Metadata = {
    title: "Manajemen Galeri - FITALENTA",
};

export default function EditorGalleryPage() {
    return <GalleryManagementView />;
}
