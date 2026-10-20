"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyProfile } from "@/hooks/user/use-user-profile";
import { isApiError } from "@/lib/api-error";
import { ProfileForm } from "./profile-form";
import { ProfileSummary } from "./profile-summary";

function ProfileSkeleton() {
    return (
        <div aria-busy="true" aria-label="Memuat profil" className="space-y-8">
            <div className="space-y-3">
                <Skeleton className="h-10 w-64 max-w-full" />
                <Skeleton className="h-4 w-80 max-w-full" />
            </div>
            <div className="grid gap-6 lg:grid-cols-[18rem_1fr]">
                <Skeleton className="h-80 rounded-3xl" />
                <Skeleton className="h-120 rounded-3xl" />
            </div>
        </div>
    );
}

export function ProfileView() {
    const router = useRouter();
    const { data: profile, error, isPending, isFetching, refetch } = useMyProfile();

    const unauthorized = isApiError(error) && error.status === 401;
    useEffect(() => {
        if (unauthorized) router.replace("/login?next=/user/profil");
    }, [unauthorized, router]);

    if (isPending || unauthorized) return <ProfileSkeleton />;

    if (error) {
        return (
            <Card className="mx-auto max-w-md text-center">
                <CardContent className="space-y-4 py-10">
                    <h1 className="text-xl font-bold text-primary">Profil tidak dapat dimuat</h1>
                    <p className="text-sm text-muted-foreground">{error.message}</p>
                    <Button onClick={() => refetch()} disabled={isFetching}>
                        Coba lagi
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-extrabold tracking-tight text-primary md:text-4xl">Profil Saya</h1>
                <p className="mt-3 text-muted-foreground">Kelola informasi akun dan data diri Anda.</p>
            </header>

            <div className="grid items-start gap-6 lg:grid-cols-[18rem_1fr]">
                <ProfileSummary profile={profile} />
                <ProfileForm profile={profile} />
            </div>
        </div>
    );
}
