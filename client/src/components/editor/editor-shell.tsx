"use client";

import type { ReactNode } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { EDITOR_AREA } from "@/constants/editor/editor-nav";

export function EditorShell({ children }: { children: ReactNode }) {
    return <AdminShell area={EDITOR_AREA}>{children}</AdminShell>;
}
