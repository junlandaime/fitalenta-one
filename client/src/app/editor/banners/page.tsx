import type { Metadata } from "next";
import { BannerManagementView } from "./features/banner-management-view";

export const metadata: Metadata = {
    title: "Manajemen Banner Promo - FITALENTA",
};

export default function EditorBannersPage() {
    return <BannerManagementView />;
}