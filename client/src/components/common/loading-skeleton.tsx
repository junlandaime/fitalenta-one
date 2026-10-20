import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";

function LoadingNote() {
    return (
        <p className="mb-8 flex items-center justify-center gap-2 text-sm font-medium text-slate-500">
            <Spinner aria-hidden />
            Memuat data...
        </p>
    );
}

export function HeroSkeleton() {
    return (
        <>
            <section className="bg-linear-to-br from-[#071d40] to-[#0e4a8f] px-6 py-20">
                <div className="mx-auto flex max-w-4xl flex-col items-center gap-4">
                    <div className="h-8 w-44 animate-pulse rounded-full bg-white/15" />
                    <div className="h-12 w-80 max-w-full animate-pulse rounded-lg bg-white/15" />
                    <div className="h-5 w-96 max-w-full animate-pulse rounded bg-white/10" />
                </div>
            </section>
            <div className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex max-w-6xl items-center gap-2 px-6 py-3">
                    <Skeleton className="h-4 w-40" />
                </div>
            </div>
        </>
    );
}

function CardSkeleton() {
    return (
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
            <Skeleton className="aspect-video w-full rounded-none" />
            <div className="space-y-3 p-5">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
            </div>
        </div>
    );
}

export function ListPageSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div role="status" aria-busy="true" aria-label="Memuat halaman">
            <HeroSkeleton />
            <section className="bg-slate-50 py-14">
                <div className="mx-auto max-w-6xl px-4">
                    <LoadingNote />
                    <div className="mb-10 flex flex-col items-center gap-3">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-9 w-72 max-w-full" />
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: count }, (_, index) => (
                            <CardSkeleton key={index} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

export function DetailPageSkeleton() {
    return (
        <div role="status" aria-busy="true" aria-label="Memuat halaman">
            <HeroSkeleton />
            <section className="bg-slate-50 py-12">
                <div className="mx-auto max-w-6xl px-4">
                    <LoadingNote />
                    <div className="grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-start">
                        <div className="space-y-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:p-6">
                            <Skeleton className="aspect-video w-full rounded-xl" />
                            <Skeleton className="h-8 w-2/3" />
                            <div className="space-y-3">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6" />
                                <Skeleton className="h-4 w-3/4" />
                            </div>
                        </div>
                        <div className="space-y-5 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
                            <Skeleton className="h-6 w-40" />
                            {Array.from({ length: 4 }, (_, index) => (
                                <div key={index} className="flex items-center gap-4">
                                    <Skeleton className="size-11 shrink-0 rounded-xl" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-3 w-16" />
                                        <Skeleton className="h-4 w-32" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
