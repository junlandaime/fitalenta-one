import Image from "next/image";
import { partners, type Partner } from "@/lib/data/partners";

const MIN_ITEMS_PER_SET = 8;
const SPLIT_THRESHOLD = 10;

function PartnerCard({ partner }: { partner: Partner }) {

    return (
        <div className="flex h-24 w-44 items-center justify-center border border-[#10302B]/15 rounded-md bg-white p-3 sm:h-28 sm:w-56 sm:p-4">
            <div className="relative h-full w-full">
                <Image
                    src={partner.logo}
                    alt={partner.name}
                    fill
                    unoptimized
                    sizes="(min-width: 640px) 192px, 152px"
                    className="object-contain"
                />
            </div>
        </div>
    );
}

function MarqueeRow({
    items,
    direction,
    duration,
}: {
    items: Partner[];
    direction: "left" | "right";
    duration: number;
}) {
    const reps = Math.max(1, Math.ceil(MIN_ITEMS_PER_SET / items.length));
    const set = Array.from({ length: reps }, () => items).flat();

    return (
        <div className="fit-marquee-row mask-[linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
            <div
                className={`fit-marquee-track ${direction === "left" ? "fit-marquee-left" : "fit-marquee-right"}`}
                style={{ animationDuration: `${duration}s` }}
            >
                {set.map((partner, index) => (
                    <div key={`${partner.name}-${index}`} className="shrink-0 pr-4">
                        <PartnerCard partner={partner} />
                    </div>
                ))}
                {set.map((partner, index) => (
                    <div key={`dup-${partner}-${index}`} aria-hidden className="fit-marquee-dup shrink-0 pr-4">
                        <PartnerCard partner={partner} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export function PartnersSection() {
    if (partners.length === 0) return null;

    const splitAt = Math.ceil(partners.length / 2);
    const rows =
        partners.length < SPLIT_THRESHOLD
            ? [partners]
            : [partners.slice(0, splitAt), partners.slice(splitAt)];

    return (
        <section id="partners" className="text-[#10302B]">
            <style>{`
        .fit-marquee-row { overflow: hidden; }
        .fit-marquee-track { display: flex; width: max-content; animation: fit-marquee-left linear infinite; }
        .fit-marquee-right { animation-name: fit-marquee-right; }
        .fit-marquee-row:hover .fit-marquee-track { animation-play-state: paused; }
        @keyframes fit-marquee-left { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes fit-marquee-right { from { transform: translateX(-50%); } to { transform: translateX(0); } }
        @media (prefers-reduced-motion: reduce) {
          .fit-marquee-row { overflow-x: auto; }
          .fit-marquee-track { animation: none; }
          .fit-marquee-dup { display: none; }
        }
      `}</style>

            <div className="py-20 lg:py-28">
                <div className="mx-auto flex max-w-3xl flex-col items-center px-6 text-center md:px-8">
                    <p className="flex items-center gap-3 text-xs font-semibold tracking-[0.18em] text-[#2F6F62] sm:text-sm">
                        <span aria-hidden className="h-2.5 w-2.5 bg-secondary" />
                        OUR PARTNERS
                    </p>

                    <h2 className="mt-5 text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                        Working Together With Our Partner and Clients.
                    </h2>

                    <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-[#10302B]/75 sm:text-lg">
                        We collaborate with companies, educational institutions,
                        organizations, and communities across different sectors.
                    </p>
                </div>

                <div className="mt-12 space-y-4 lg:mt-16">
                    {rows.map((items, i) => (
                        <MarqueeRow
                            key={i}
                            items={items}
                            direction={i % 2 === 0 ? "left" : "right"}
                            duration={i % 2 === 0 ? 70 : 60}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}