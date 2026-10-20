import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, CheckCircle2, ShieldCheck, UserRound } from "lucide-react";
import { resolveLoginNotice } from "@/constants/auth-constant";
import { LoginForm } from "../features/login-form";

export const metadata: Metadata = {
    title: "Login - FITALENTA",
};

const highlights = [
    {
        title: "Akses satu akun",
        description: "Gunakan satu akun untuk seluruh proses pendaftaran FITALENTA.",
    },
    {
        title: "Pantau proses Anda",
        description: "Lihat status program, seleksi, pembayaran, dan perkembangan pendaftaran.",
    },
    {
        title: "Akses lebih aman",
        description: "Informasi akun Anda digunakan untuk mengakses layanan peserta FITALENTA.",
    },
];

type Props = { searchParams: Promise<{ registered?: string; verified?: string; reset?: string }> };

export default async function LoginPage({ searchParams }: Props) {
    const notice = resolveLoginNotice(await searchParams);

    return (
        <main className="grid min-h-svh lg:grid-cols-2">
            <section className="relative isolate hidden overflow-hidden bg-primary px-10 py-12 text-primary-foreground lg:flex lg:flex-col lg:justify-between xl:px-16">
                <div
                    aria-hidden
                    className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-white/10"
                />
                <div
                    aria-hidden
                    className="pointer-events-none absolute -right-40 -top-40 h-112 w-md rounded-full border border-white/10"
                />

                <Link
                    href="/"
                    className="relative inline-flex w-fit items-center gap-2 text-sm font-medium text-white/80 transition-colors hover:text-white"
                >
                    <ArrowLeft className="h-4 w-4" aria-hidden />
                    Kembali ke FITALENTA
                </Link>

                <div className="relative max-w-md">
                    <p className="text-xs font-semibold tracking-[0.18em] text-secondary">
                        AKSES PESERTA
                    </p>

                    <h1 className="mt-4 text-balance text-4xl font-semibold leading-tight tracking-tight">
                        Selamat datang
                    </h1>

                    <p className="mt-4 text-pretty leading-relaxed text-white/75">
                        Masuk menggunakan akun peserta FITALENTA untuk melanjutkan proses
                        pendaftaran program, seleksi, pembayaran, dan penyaluran.
                    </p>

                    <ul className="mt-10 space-y-6">
                        {highlights.map((item) => (
                            <li key={item.title} className="flex gap-3">
                                <CheckCircle2
                                    className="mt-0.5 h-5 w-5 shrink-0 text-secondary"
                                    aria-hidden
                                />
                                <div>
                                    <p className="font-semibold">{item.title}</p>
                                    <p className="mt-1 text-sm text-white/70">{item.description}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <div aria-hidden />
            </section>

            <section className="flex flex-col justify-center bg-background px-6 py-12 md:px-10">
                <Link
                    href="/"
                    className="mb-8 inline-flex w-fit items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground lg:hidden"
                >
                    <ArrowLeft className="h-4 w-4" aria-hidden />
                    Kembali ke FITALENTA
                </Link>

                <div className="mx-auto w-full max-w-md">
                    <div className="rounded-2xl border bg-card px-6 py-8 shadow-sm sm:px-8 sm:py-10">
                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <UserRound className="h-5 w-5" aria-hidden />
                        </div>

                        <p className="mt-5 text-xs font-semibold tracking-[0.18em] text-secondary">
                            AKSES PESERTA
                        </p>
                        <h2 className="mt-2 text-2xl font-semibold tracking-tight">Login</h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Masukkan email dan password akun FITALENTA Anda.
                        </p>

                        <div className="mt-8">
                            <LoginForm notice={notice} />
                        </div>
                    </div>

                    <p className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-muted-foreground">
                        <ShieldCheck className="h-3.5 w-3.5 shrink-0" aria-hidden />
                        Informasi akun Anda digunakan untuk mengakses layanan FITALENTA.
                    </p>
                </div>
            </section>
        </main>
    );
}