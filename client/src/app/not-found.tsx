import Link from "next/link";
import type { Metadata } from "next";
import { House } from "lucide-react";
import { Footer } from "@/components/common/footer";
import { Navbar } from "@/components/common/navbar";
import { Button } from "@/components/ui/button";
import { navItems } from "@/constants/site-config";
import { BackButton } from "@/components/common/back-button";

export const metadata: Metadata = {
    title: "Halaman Tidak Ditemukan - FITALENTA",
};

export default function NotFound() {
    const shortcuts = navItems.filter((item) => item.href !== "/");

    return (
        <div className="flex min-h-full flex-col">
            <Navbar />

            <section className="relative flex flex-1 items-center justify-center overflow-hidden px-6 py-20 sm:py-28">
                <div className="relative mx-auto w-full max-w-xl text-center">
                    <p
                        aria-hidden
                        className="pointer-events-none text-[9rem] leading-none font-black tracking-tighter text-primary/10 select-none sm:text-[13rem]"
                    >
                        404
                    </p>

                    <div className="-mt-8 space-y-4 sm:-mt-12">
                        <p className="text-xs font-semibold tracking-widest text-orange-600 uppercase">
                            Error 404
                        </p>
                        <h1 className="text-3xl font-bold tracking-tight text-balance text-primary sm:text-4xl">
                            Halaman tidak ditemukan
                        </h1>
                        <p className="mx-auto max-w-md text-pretty text-muted-foreground">
                            Maaf, halaman yang Anda cari tidak ada, sudah dipindahkan, atau alamatnya salah ketik.
                            Silakan kembali ke beranda atau pilih halaman di bawah.
                        </p>
                    </div>

                    <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <Button asChild size="lg">
                            <Link href="/">
                                <House data-icon="inline-start" aria-hidden />
                                Kembali ke beranda
                            </Link>
                        </Button>
                        <BackButton />
                    </div>

                    {shortcuts.length > 0 && (
                        <nav aria-label="Halaman populer" className="mt-12 border-t pt-8">
                            <p className="mb-4 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                Mungkin Anda mencari
                            </p>
                            <ul className="flex flex-wrap items-center justify-center gap-2">
                                {shortcuts.map((item) => (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            className="inline-flex rounded-full border px-4 py-1.5 text-sm font-medium transition-colors outline-none hover:border-primary/30 hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
}