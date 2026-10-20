import type { Metadata } from "next";
import type { ReactNode } from "react";
import { EditorShell } from "@/components/editor/editor-shell";

export const metadata: Metadata = {
    title: "Editor - FITALENTA",
    robots: { index: false, follow: false },
};

export default function EditorLayout({ children }: { children: ReactNode }) {
    return <EditorShell>{children}</EditorShell>;
}
