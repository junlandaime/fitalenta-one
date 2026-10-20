import Link from "next/link";
import { ChevronDown, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
    return (
        <section id="home" className="relative isolate overflow-hidden text-[#EEF3F1]">
            <div
                className="absolute inset-0 -z-20 bg-cover bg-center"
                style={{ backgroundImage: "url('/images/hero.jpg')" }}
            />

            <div className="absolute inset-0 -z-10 bg-linear-to-r from-primary via-primary/85 to-primary/35" />

            <div className="mx-auto flex min-h-[calc(100svh-4rem)] max-w-7xl items-center px-6 py-16 md:px-8 lg:py-24">
                <div className="max-w-2xl">
                    <p className="flex items-center gap-3 text-xs font-semibold tracking-[0.18em] text-[#EEF3F1] sm:text-sm">
                        <span aria-hidden className="h-2.5 w-2.5 bg-secondary" />
                        TALENT MANAGEMENT &amp; BUSINESS CONSULTING
                    </p>

                    <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
                        Empowering Businesses and Individuals to Grow
                    </h1>

                    <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-[#EEF3F1]/75 sm:text-lg">
                        <span className="font-semibold">FITALENTA</span> provides talent
                        management and business consulting solutions through human
                        capital, education, business development, training, and
                        professional programs.
                    </p>

                    <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
                        <Button
                            asChild
                            size="lg"
                            className="h-12 bg-white px-7 text-base font-semibold text-black hover:bg-white/85"
                        >
                            <Link href="#services">
                                Explore Our Services
                                <ChevronDown className="ml-2 h-4 w-4" aria-hidden />
                            </Link>
                        </Button>

                        <Button
                            asChild
                            size="lg"
                            variant="outline"
                            className="h-12 border-white/30 bg-transparent px-7 text-base font-semibold text-white hover:bg-white/85 hover:text-black"
                        >
                            <Link href="/contact">
                                <MessageCircle className="mr-2 h-4 w-4" aria-hidden />
                                Free Consultation
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}