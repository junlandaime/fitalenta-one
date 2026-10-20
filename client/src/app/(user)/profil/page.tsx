import type { Metadata } from "next";
import { ProfileView } from "./features/view";

export const metadata: Metadata = {
    title: "Profil Saya - FITALENTA",
    robots: { index: false },
};

export default function ProfilePage() {
    return (
        <main className="bg-linear-to-b from-slate-50 to-white">
            <div className="mx-auto max-w-5xl px-4 py-10">
                <ProfileView />
            </div>
        </main>
    );
}
