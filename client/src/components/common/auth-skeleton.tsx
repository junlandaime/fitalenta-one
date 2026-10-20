import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";

function CardBodySkeleton({ fields }: { fields: number }) {
    return (
        <div className="space-y-6">
            <div className="space-y-3">
                <Skeleton className="size-11 rounded-lg" />
                <Skeleton className="h-7 w-40" />
                <Skeleton className="h-4 w-full" />
            </div>
            <div className="space-y-5">
                {Array.from({ length: fields }, (_, index) => (
                    <div key={index} className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                ))}
            </div>
            <Skeleton className="h-12 w-full" />
            <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Spinner aria-hidden />
                Memuat halaman...
            </p>
        </div>
    );
}

export function AuthCardSkeleton({ fields = 1 }: { fields?: number }) {
    return (
        <main
            role="status"
            aria-busy="true"
            aria-label="Memuat halaman"
            className="flex min-h-svh flex-col justify-center bg-background px-6 py-12 md:px-10"
        >
            <div className="mx-auto w-full max-w-md">
                <Skeleton className="mb-8 h-5 w-44" />
                <div className="rounded-2xl border bg-card px-6 py-8 shadow-sm sm:px-8 sm:py-10">
                    <CardBodySkeleton fields={fields} />
                </div>
            </div>
        </main>
    );
}

export function AuthSplitSkeleton({ fields = 2 }: { fields?: number }) {
    return (
        <main
            role="status"
            aria-busy="true"
            aria-label="Memuat halaman"
            className="grid min-h-svh lg:grid-cols-2"
        >
            <section aria-hidden className="hidden bg-primary lg:block" />
            <section className="flex flex-col justify-center bg-background px-6 py-12 md:px-10">
                <div className="mx-auto w-full max-w-md">
                    <div className="rounded-2xl border bg-card px-6 py-8 shadow-sm sm:px-8 sm:py-10">
                        <CardBodySkeleton fields={fields} />
                    </div>
                </div>
            </section>
        </main>
    );
}
