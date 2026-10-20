"use client";

import { CircleAlert, LayoutDashboard } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { EDITOR_SHORTCUTS } from "@/constants/editor/editor-nav";
import { useCurrentUser } from "@/hooks/auth/use-current-user";
import { useEditorCmsSummary } from "@/hooks/editor/use-editor-cms";
import { EditorStatCards } from "./editor-stat-cards";
import { ShortcutCard } from "./shortcut-card";

export function EditorDashboardView() {
    const { data: user } = useCurrentUser();
    const summary = useEditorCmsSummary();

    return (
        <div className="mx-auto w-full max-w-7xl space-y-6">
            <div className="space-y-1">
                <p className="flex items-center gap-1.5 text-[10px] font-semibold tracking-wider text-orange-600 uppercase">
                    <LayoutDashboard className="size-3" aria-hidden />
                    Editor CMS
                </p>
                <h2 className="text-3xl font-bold tracking-tight">
                    {user ? `Halo, ${user.name}` : "Dashboard Editor"}
                </h2>
                <p className="text-sm text-muted-foreground">
                    Kelola konten yang tampil di website FITALENTA: artikel, event, galeri, layanan, testimoni, dan tim.
                </p>
            </div>

            {summary.isError && (
                <Alert variant="destructive">
                    <CircleAlert aria-hidden />
                    <AlertTitle>Ringkasan konten gagal dimuat</AlertTitle>
                    <AlertDescription>{summary.error.message}</AlertDescription>
                </Alert>
            )}

            <EditorStatCards summary={summary.data} />

            <section aria-labelledby="shortcut-title" className="space-y-3">
                <h3 id="shortcut-title" className="text-base font-medium">
                    Kelola konten
                </h3>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {EDITOR_SHORTCUTS.map((shortcut) => (
                        <ShortcutCard key={shortcut.href} {...shortcut} />
                    ))}
                </div>
            </section>
        </div>
    );
}