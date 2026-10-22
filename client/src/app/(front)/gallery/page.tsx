import PageHero from '@/components/common/page-hero';
import { getGallery } from '@/services/gallery-service';
import { GalleryCard } from './features/gallery-card';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Gallery - FITALENTA",
    description: "Empowering businesses and individuals with tailored solutions.",
};

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
    const items = await getGallery();

    return (
        <section>
            <PageHero
                badge="Gallery FITALENTA"
                title="Our Gallery"
                subtitle=" Empowering businesses and individuals with tailored solutions "
                crumbs={[{ label: "Home", href: "/" }, { label: "Gallery" }]}
            />

            <div className="bg-slate-50 py-16">
                <div className="mx-auto max-w-6xl px-4">
                    <div className="mb-10 text-center">
                        <p className="text-sm font-medium uppercase tracking-widest text-primary">
                            Our moments
                        </p>
                        <h2 className="mt-2 text-3xl font-bold text-primary md:text-4xl">
                            Explore Our Gallery
                        </h2>
                        <div className="mx-auto mt-3 h-1 w-14 rounded-full bg-primary" />
                    </div>

                    {items.length === 0 ? (
                        <p className="py-16 text-center text-slate-500">
                            No gallery items yet. Check back soon.
                        </p>
                    ) : (
                        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {items.map((item) => (
                                <li key={item.id} className="flex">
                                    <GalleryCard item={item} />
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </section>
    )
}