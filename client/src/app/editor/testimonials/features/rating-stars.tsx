import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function RatingStars({ rating }: { rating: number }) {
    return (
        <span role="img" aria-label={`Rating ${rating} dari 5`} className="flex items-center gap-0.5">
            {Array.from({ length: 5 }, (_, index) => (
                <Star
                    key={index}
                    aria-hidden
                    className={cn("size-3.5", index < rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40")}
                />
            ))}
        </span>
    );
}
