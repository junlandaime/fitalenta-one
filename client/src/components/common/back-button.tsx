"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function BackButton({ label = "Halaman sebelumnya" }: { label?: string }) {
    const router = useRouter();

    function handleClick() {
        if (window.history.length > 1) router.back();
        else router.push("/");
    }

    return (
        <Button type="button" variant="outline" size="lg" onClick={handleClick}>
            <ArrowLeft data-icon="inline-start" aria-hidden />
            {label}
        </Button>
    );
}