import { imageUrl, safely } from "@/lib/utils";
import { getActiveBanners } from "@/services/banner-service";
import { PromoCarousel, type PromoSlide } from "./promo-carousel";

const SAFE_LINK = /^(https?:\/\/\S+|\/(?!\/)\S*)$/i;
const EXTERNAL_LINK = /^https?:\/\//i;
const DEFAULT_CTA = "Selengkapnya";

export async function PromoBannerSection() {
    const banners = await safely(getActiveBanners, [], "promo-banners");
    if (banners.length === 0) return null;

    const slides: PromoSlide[] = banners.map((banner) => {
        const href = banner.linkUrl && SAFE_LINK.test(banner.linkUrl) ? banner.linkUrl : null;

        return {
            id: banner.id,
            title: banner.title,
            subtitle: banner.subtitle,
            ctaLabel: banner.ctaLabel || DEFAULT_CTA,
            href,
            external: href !== null && EXTERNAL_LINK.test(href),
            image: imageUrl(banner.image) ?? null,
        };
    });

    return (
        <section id="promo" aria-label="Promo" className="bg-white text-[#10302B]">
            <div className="mx-auto max-w-7xl px-6 py-10 md:px-8 lg:py-14">
                <PromoCarousel slides={slides} />
            </div>
        </section>
    );
}