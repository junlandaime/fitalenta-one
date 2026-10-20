import { ExternalLink, ImageOff } from "lucide-react";
import { imageUrl } from "@/lib/utils";

export function ProofImage({ src, alt }: { src: string | null; alt: string }) {
    const url = imageUrl(src);

    if (!url) {
        return (
            <div className="flex items-center justify-center gap-2 rounded-lg border border-dashed p-4 text-xs text-muted-foreground">
                <ImageOff className="size-4" aria-hidden />
                Belum ada bukti pembayaran.
            </div>
        );
    }

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Buka bukti pembayaran ukuran penuh"
            className="group relative block overflow-hidden rounded-lg border bg-muted/30"
        >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt={alt} loading="lazy" className="max-h-72 w-full object-contain" />
            <span className="absolute top-2 right-2 flex items-center gap-1 rounded-md bg-background/90 px-1.5 py-1 text-[11px] font-medium opacity-0 shadow-xs transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                <ExternalLink className="size-3" aria-hidden />
                Ukuran penuh
            </span>
        </a>
    );
}
