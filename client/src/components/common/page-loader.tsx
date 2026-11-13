import Image from "next/image";
import { cn } from "@/lib/utils";

type PageLoaderProps = {
    label?: string;
    className?: string;
};

export function PageLoader({ label = "Empowering your journey...", className }: PageLoaderProps) {
    return (
        <div
            role="status"
            aria-live="polite"
            className={cn(
                "flex min-h-[60svh] w-full flex-col items-center justify-center bg-slate-50/50 backdrop-blur-sm",
                className
            )}
        >
            <div className="relative flex items-center justify-center">
                <div className="absolute size-32 animate-[spin_3s_linear_infinite] rounded-full border-y-4 border-transparent border-t-primary"></div>
                
                <div className="absolute size-36 animate-[spin_2s_linear_infinite_reverse] rounded-full border-x-4 border-transparent border-r-secondary"></div>
                
                <div className="absolute size-28 animate-ping rounded-full bg-primary/10"></div>

                <div className="relative flex size-24 items-center justify-center overflow-hidden rounded-full bg-white p-2 shadow-lg ring-1 ring-slate-100">
                    <Image
                        src="/fitlen.jpg"
                        alt="FITALENTA Loading"
                        fill
                        className="object-contain p-2"
                        priority
                    />
                </div>
            </div>

            <div className="mt-8 flex flex-col items-center gap-2">
                <h3 className="animate-pulse text-sm font-bold tracking-[0.2em] text-primary">
                    FITALENTA
                </h3>
                <p className="animate-pulse text-xs font-medium text-slate-500 delay-150">
                    {label}
                </p>
            </div>
        </div>
    );
}