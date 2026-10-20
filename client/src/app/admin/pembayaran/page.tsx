import { Suspense } from "react";
import { AdminPageSkeleton } from "@/components/admin/admin-page-skeleton";
import type { Metadata } from "next";
import { PaymentManagementView } from "./features/payment-management-view";

export const metadata: Metadata = {
    title: "Manajemen Pembayaran - FITALENTA",
};

export default function AdminPaymentPage() {
    return (
        <Suspense fallback={<AdminPageSkeleton />}>
            <PaymentManagementView />
        </Suspense>
    );
}
