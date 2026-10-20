import type { Metadata } from "next";
import { NotificationView } from "./features/view";

export const metadata: Metadata = {
    title: "Notifikasi - FITALENTA",
    robots: { index: false },
};

export default function NotificationPage() {
    return (
        <main className="bg-linear-to-b from-slate-50 to-white">
            <div className="mx-auto max-w-4xl px-4 py-10">
                <NotificationView />
            </div>
        </main>
    );
}
