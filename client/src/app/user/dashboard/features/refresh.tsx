"use client";

import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RefreshButton({ onRefresh, loading }: { onRefresh: () => void; loading: boolean }) {
    return (
        <Button
            variant="outline"
            disabled={loading}
            onClick={onRefresh}
            className="border-primary font-semibold text-primary"
        >
            <RefreshCw className={loading ? "animate-spin" : undefined} aria-hidden />
            {loading ? "Memuat..." : "Refresh"}
        </Button>
    );
}