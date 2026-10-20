import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

type PageLoaderProps = {
    label?: string;
    className?: string;
};

export function PageLoader({ label = "Memuat data...", className }: PageLoaderProps) {
    return (
        <div
            role="status"
            aria-live="polite"
            className={cn(
                "flex min-h-[60svh] flex-col items-center justify-center gap-3 text-muted-foreground",
                className,
            )}
        >
            <Spinner className="size-8 text-primary" aria-hidden />
            <p className="text-sm font-medium">{label}</p>
        </div>
    );
}
