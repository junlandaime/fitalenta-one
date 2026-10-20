import type { Metadata } from "next";
import { DashboardView } from "./features/view";

export const metadata: Metadata = {
    title: "Dashboard - FITALENTA",
    robots: { index: false },
};

export default function DashboardPage() {
    return (
        <main className="bg-linear-to-b from-slate-50 to-white">
            <div className="mx-auto max-w-6xl px-4 py-10">
                <DashboardView />
            </div>
        </main>
    );
}