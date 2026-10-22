import Image from "next/image";

import { Carousel } from "@/components/common/carousel";
import { getPublicExperts } from "@/services/team-service";
import { imageUrl } from "@/lib/utils";
import type { Team } from "@/types/team";
import { User } from "lucide-react";

const HEADING_ID = "experts-heading";

const PLACEHOLDER_TONES = [
    "from-[#7FB0A2] to-[#2F6F62]",
    "from-[#2F6F62] to-primary",
    "from-primary to-[#10302B]",
] as const;

function ExpertCard({ member, index }: { member: Team; index: number }) {
    const tone = PLACEHOLDER_TONES[index % PLACEHOLDER_TONES.length];
    const photo = imageUrl(member.image);

    return (
        <article>
            <div className="relative aspect-5/6 w-full overflow-hidden rounded-2xl bg-linear-to-br from-[#071d40] to-[#0e4a8f]">
                {photo ? (
                    <Image
                        src={photo}
                        alt={member.name}
                        fill
                        unoptimized
                        sizes="(min-width: 1024px) 384px, (min-width: 640px) 50vw, 100vw"
                        className="object-cover"
                    />
                ) : (
                    <div
                        aria-hidden
                        className={`flex h-full w-full items-end justify-center bg-linear-to-br ${tone}`}
                    >
                        <User
                            className="h-3/5 w-3/5 text-white/25"
                            strokeWidth={1}
                            fill="currentColor"
                        />
                    </div>
                )}
            </div>

            <h3 className="mt-5 text-xl font-semibold tracking-tight sm:text-2xl">
                {member.name}
            </h3>
            <p className="mt-1 text-base text-[#2F6F62] sm:text-lg">{member.position}</p>
        </article>
    );
}

export async function ExpertsSection() {
    const members = await getPublicExperts();

    if (members.length === 0) return null;

    return (
        <section
            id="experts"
            aria-labelledby={HEADING_ID}
            className="bg-white text-[#10302B]"
        >
            <div className="mx-auto max-w-7xl px-6 py-20 md:px-8 lg:py-28">
                <header className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-2xl">
                        <p className="flex items-center gap-3 text-xs font-semibold tracking-[0.18em] text-[#2F6F62] sm:text-sm">
                            <span aria-hidden className="h-2.5 w-2.5 bg-secondary" />
                            OUR EXPERTS
                        </p>

                        <h2
                            id={HEADING_ID}
                            className="mt-5 text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl"
                        >
                            People Behind Our Programs.
                        </h2>

                        <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-[#10302B]/75 sm:text-lg">
                            Our programs are supported by professionals and practitioners with
                            experience in their respective fields.
                        </p>
                    </div>
                </header>

                <Carousel
                    className="mt-12 lg:mt-16"
                    label="Our experts"
                    perView={{ base: 1, md: 2, lg: 3 }}
                    gap="lg"
                    prevLabel="Previous experts"
                    nextLabel="Next experts"
                >
                    {members.map((member, index) => (
                        <ExpertCard key={member.id} member={member} index={index} />
                    ))}
                </Carousel>
            </div>
        </section>
    );
}