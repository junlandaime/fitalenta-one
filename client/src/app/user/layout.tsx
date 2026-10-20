import type { Metadata } from "next";
import type { ReactNode } from "react";
import { UserShell } from "@/components/user/user-shell";
import { Footer } from "@/components/common/footer";

export const metadata: Metadata = {
    robots: { index: false, follow: false },
};

export default function UserLayout({ children }: { children: ReactNode }) {
    return <UserShell footer={<Footer />}>{children}</UserShell>;
}
