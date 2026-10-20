"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { Bell, Briefcase, ClipboardCheck, Inbox, NotebookText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrentUser } from "@/hooks/auth/use-current-user";
import { getUserDashboard } from "@/services/user/dashboard-service";
import { RefreshButton } from "./refresh";
import { StatCard } from "./stat-card";
import { RegistrationDetail } from "./registration-detail";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { statusLabel } from "@/constants/user/dashboard-constant";

export function DashboardSkeleton() {
    return (
        <div aria-busy="true" aria-label="Memuat dashboard" className="space-y-8">
            <div className="space-y-3">
                <Skeleton className="h-10 w-80 max-w-full" />
                <Skeleton className="h-4 w-56" />
                <Skeleton className="h-4 w-72 max-w-full" />
            </div>
            <div className="grid gap-5 md:grid-cols-3">
                {Array.from({ length: 3 }, (_, i) => (
                    <Skeleton key={i} className="h-36 rounded-2xl" />
                ))}
            </div>
            <Card className="gap-0 py-0">
                <CardHeader className="border-b px-6 py-5"><Skeleton className="h-6 w-48" /></CardHeader>
                <CardContent className="p-6"><Skeleton className="h-40 w-full" /></CardContent>
            </Card>
        </div>
    );
}

const isUnauthorized = (err: unknown) => isAxiosError(err) && err.response?.status === 401;

export function DashboardView() {
    const router = useRouter();
    const { data: user } = useCurrentUser();
    const { data, error, isPending, isFetching, refetch } = useQuery({
        queryKey: ["user-dashboard"],
        queryFn: getUserDashboard,
        staleTime: 30_000,
        retry: (count, err) => !isUnauthorized(err) && count < 2,
    });

    const unauthorized = isUnauthorized(error);
    useEffect(() => {
        if (unauthorized) router.replace("/login?next=/user/dashboard");
    }, [unauthorized, router]);

    if (isPending || unauthorized) return <DashboardSkeleton />;

    if (error) {
        return (
            <Card className="mx-auto max-w-md text-center">
                <CardContent className="space-y-4 py-10">
                    <h1 className="text-xl font-bold text-primary">Dashboard tidak dapat dimuat</h1>
                    <p className="text-sm text-muted-foreground">Periksa koneksi Anda lalu coba lagi.</p>
                    <Button onClick={() => refetch()} disabled={isFetching}>Coba lagi</Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-8">
            <header className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-primary md:text-4xl">
                        Dashboard Status Program
                    </h1>
                    <p className="mt-3 text-muted-foreground">
                        Selamat Datang{user?.name && <>, <strong className="text-primary">{user.name}</strong></>}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                        {data.hasRegistration
                            ? "Berikut perkembangan program yang Anda ikuti."
                            : "Anda belum memiliki program yang terdaftar."}
                    </p>
                </div>
                <RefreshButton onRefresh={() => refetch()} loading={isFetching} />
            </header>

            {data.unreadNotifications > 0 && (
                <Alert>
                    <Bell aria-hidden />
                    <AlertTitle>{data.unreadNotifications} notifikasi belum dibaca</AlertTitle>
                    <AlertDescription>
                        Periksa pembaruan terbaru terkait pendaftaran Anda.{" "}
                        <Link href="/user/notifikasi" className="font-semibold text-primary underline-offset-4 hover:underline">
                            Lihat notifikasi
                        </Link>
                    </AlertDescription>
                </Alert>
            )}

            <section aria-label="Ringkasan" className="grid gap-5 md:grid-cols-3">
                <StatCard
                    icon={ClipboardCheck}
                    title="Status Seleksi"
                    value={statusLabel(data.selectionStatus?.status, "registration")}
                />
                <StatCard
                    icon={Briefcase}
                    title="Penempatan Kerja"
                    value={statusLabel(data.placementStatus?.status, "placement")}
                />
                <StatCard
                    icon={NotebookText}
                    title="Program Saya"
                    value={data.program?.name}
                />
            </section>

            <Card className="gap-0 py-0">
                <CardHeader className="border-b px-6 py-5">
                    <CardTitle className="text-xl text-primary">Detail Program Anda</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {data.hasRegistration ? (
                        <RegistrationDetail data={data} />
                    ) : (
                        <div className="flex flex-col items-center px-6 py-14 text-center">
                            <span className="grid size-20 place-items-center rounded-2xl bg-slate-50 ring-1 ring-slate-100">
                                <Inbox className="size-9 text-slate-400" strokeWidth={1.5} aria-hidden />
                            </span>
                            <h2 className="mt-6 text-lg font-bold text-primary">Data tidak tersedia</h2>
                            <p className="mt-2 text-sm text-muted-foreground">Anda belum terdaftar dalam program magang.</p>
                            <Button asChild className="mt-6 bg-primary hover:bg-primary/90">
                                <Link href="/programs">Daftar Program Magang</Link>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}