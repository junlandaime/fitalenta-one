import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { cn, imageUrl } from "@/lib/utils";

type ContentThumbnailProps = {
    image?: string | null;
    alt: string;
    className?: string;
};

export function ContentThumbnail({ image, alt, className }: ContentThumbnailProps) {
    const src = imageUrl(image);

    return (
        <span
            className={cn(
                "relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted text-muted-foreground",
                className,
            )}
        >
            {src ? (
                <Image src={src} alt={alt} fill unoptimized sizes="48px" className="object-cover" />
            ) : (
                <ImageIcon className="size-5" aria-hidden />
            )}
        </span>
    );
}
