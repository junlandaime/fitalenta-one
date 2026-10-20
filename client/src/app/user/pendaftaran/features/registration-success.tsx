import Link from "next/link";
import { CircleCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function RegistrationSuccess({ registrationCode }: { registrationCode: string }) {
    return (
        <Card className="[--card-spacing:--spacing(8)]">
            <CardContent className="flex flex-col items-center gap-5 text-center">
                <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <CircleCheck className="size-6" aria-hidden />
                </span>
                <div className="space-y-1">
                    <h2 className="text-xl font-semibold">Pendaftaran berhasil dikirim</h2>
                    <p className="max-w-md text-sm text-muted-foreground">
                        Tim FITALENTA akan memeriksa data Anda. Simpan kode pendaftaran berikut untuk
                        keperluan komunikasi.
                    </p>
                </div>
                <p className="rounded-lg border bg-muted px-4 py-2 font-mono text-sm font-medium">
                    {registrationCode}
                </p>
                <Button asChild size="lg">
                    <Link href="/user/dashboard">Lihat status pendaftaran</Link>
                </Button>
            </CardContent>
        </Card>
    );
}
