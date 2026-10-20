import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";

type AdminPageSkeletonProps = {
    stats?: number;
    rows?: number;
};

export function AdminPageSkeleton({ stats = 4, rows = 6 }: AdminPageSkeletonProps) {
    return (
        <div role="status" aria-busy="true" aria-label="Memuat halaman" className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-7 w-56" />
                    <Skeleton className="h-4 w-72 max-w-full" />
                </div>
                <Skeleton className="h-9 w-36" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: stats }, (_, index) => (
                    <Card key={index} className="border border-border shadow-none">
                        <CardContent className="flex items-center gap-4">
                            <Skeleton className="size-11 shrink-0 rounded-lg" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-3 w-20" />
                                <Skeleton className="h-6 w-12" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="gap-0 py-0">
                <CardHeader className="flex flex-row items-center justify-between gap-3 border-b px-6 py-4">
                    <Skeleton className="h-9 w-64 max-w-full" />
                    <p className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Spinner aria-hidden />
                        Memuat data...
                    </p>
                </CardHeader>
                <CardContent className="space-y-3 p-6">
                    {Array.from({ length: rows }, (_, index) => (
                        <Skeleton key={index} className="h-10 w-full" />
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
