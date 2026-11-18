import Image from "next/image";
import { User } from "lucide-react";

import { imageUrl } from "@/lib/utils";
import type { Team } from "@/types/team";

function TeamMemberCard({ member }: { member: Team }) {
    const photo = imageUrl(member.image);

    return (
        <article className="group">
            <div className="relative aspect-4/5 w-full overflow-hidden rounded-2xl bg-linear-to-br from-[#071d40] to-[#0e4a8f]">
                {photo ? (
                    <Image
                        src={photo}
                        alt={member.name}
                        fill
                        unoptimized
                        sizes="(min-width: 1024px) 272px, 50vw"
                        className="object-cover object-top transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
                    />
                ) : (
                    <div aria-hidden className="flex h-full w-full items-end justify-center">
                        <User className="h-3/5 w-3/5 text-white/25" strokeWidth={1} fill="currentColor" />
                    </div>
                )}
            </div>
            <h3 className="mt-4 font-bold text-primary">{member.name}</h3>
            <p className="mt-0.5 text-sm font-medium text-secondary">{member.position}</p>
            {member.bio && <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">{member.bio}</p>}
        </article>
    );
}

export function TeamMembersGrid({ members }: { members: Team[] }) {
    return (
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
            {members.map((member) => (
                <TeamMemberCard key={member.id} member={member} />
            ))}
        </div>
    );
}
