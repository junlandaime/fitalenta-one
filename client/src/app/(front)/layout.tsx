import { Footer } from "@/components/common/footer";
import { Navbar } from "@/components/common/navbar";
import type { ReactNode } from "react";

export const dynamic = "force-dynamic";

export default function UserLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-full flex-col">
            <Navbar />
            <div>
                {children}
            </div>
            <Footer />
        </div>
    );
}