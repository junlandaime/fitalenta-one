import PageHero from "@/components/common/page-hero";
import type { Metadata } from "next";
import { ServiceCard } from "./features/service-card";
import { getServices } from "@/services/service-service";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Our Services | FITALENTA",
    description: "Empowering businesses and individuals with tailored solutions.",
};

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
    const services = await getServices();

    return (
        <>
            <PageHero
                badge="FITALENTA Services"
                title="Our Services"
                subtitle="Empowering businesses and individuals with tailored solutions"
                crumbs={[{ label: "Home", href: "/" }, { label: "Services" }]}
            />

            <section className="bg-slate-50 py-20">
                <div className="mx-auto max-w-6xl px-4">
                    <div className="mx-auto mb-12 max-w-xl text-center">
                        <p className="mb-2 text-sm font-bold uppercase tracking-wide text-secondary">
                            What we offer
                        </p>
                        <h2 className="text-3xl font-extrabold text-primary">Our Services</h2>
                        <div className="mx-auto mt-5 h-1 w-12 rounded bg-secondary" />
                    </div>

                    {services.length === 0 ? (
                        <p className="py-16 text-center text-slate-500">No services yet. Check back soon.</p>
                    ) : (
                        <ul className="flex flex-wrap justify-center gap-6">
                            {services.map((service) => (
                                <li
                                    key={service.slug}
                                    className="basis-full md:basis-[calc(50%-12px)] lg:basis-[calc(33.333%-16px)]"
                                >
                                    <ServiceCard service={service} />
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </section>

            <div className="py-20 bg-slate-50">
                <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 text-center">
                    <p className="text-sm font-medium text-primary">Let&apos;s connect</p>
                    <h2 className="text-3xl font-bold md:text-4xl">Not Sure Which Service You Need?</h2>
                    <p className="text-slate-600">Our team of experts is here to help you find the perfect solution for your business.</p>
                    <Link
                        href="/contact"
                        className="mt-2 inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold bg-primary text-white"
                    >
                        Contact Us
                    </Link>
                </div>
            </div>
        </>
    );
}