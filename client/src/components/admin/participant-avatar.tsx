
import { imageUrl } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

function initials(name: string) {
    return name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase())
        .join("");
}

export function ParticipantAvatar({
    name,
    photoPath,
}: {
    name: string;
    photoPath?: string | null;
}) {
    const [imageError, setImageError] = useState(false);
    const photo = imageUrl(photoPath);

    return (
        <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-indigo-50 text-xs font-bold text-indigo-600 dark:bg-indigo-950">
            {photo && !imageError ? (
                <Image
                    src={photo}
                    alt={name}
                    width={40}
                    height={40}
                    className="size-full object-cover"
                    unoptimized
                    onError={() => setImageError(true)}
                />
            ) : (
                initials(name) || "?"
            )}
        </div>
    );
}
