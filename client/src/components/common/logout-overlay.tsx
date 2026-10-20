"use client";

import { createPortal } from "react-dom";
import { Spinner } from "@/components/ui/spinner";

export function LogoutOverlay({ show }: { show: boolean }) {
    if (!show) return null;

    return createPortal(
        <div
            role="status"
            aria-live="assertive"
            className="fixed inset-0 z-200 flex flex-col items-center justify-center gap-3 bg-background/80 backdrop-blur-sm"
        >
            <Spinner className="size-8 text-primary" aria-hidden />
            <p className="text-sm font-medium text-muted-foreground">Keluar...</p>
        </div>,
        document.body,
    );
}
