import type { Metadata } from "next";
import { PaymentFlow } from "./features/payment-flow";
import { PaymentHero } from "./features/payment-hero";
import { PaymentView } from "./features/view";

export const metadata: Metadata = {
    title: "Pembayaran - FITALENTA",
    robots: { index: false },
};

export default function PaymentPage() {
    return (
        <main className="bg-linear-to-b from-slate-50 to-white">
            <div className="mx-auto max-w-6xl space-y-8 px-4 py-10">
                <PaymentHero />
                <PaymentFlow />
                <PaymentView />
            </div>
        </main>
    );
}
