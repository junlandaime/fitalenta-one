import Image from "next/image";
import { User } from "lucide-react";

import { imageUrl } from "@/lib/utils";
import type { Team } from "@/types/team";

function TeamMemberCard({ member }: { member: Team }) {
    const photo = imageUrl(member.image);

    return (
        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="relative aspect-4/5 w-full bg-linear-to-br from-[#071d40] to-[#0e4a8f]">
                {photo ? (
                    <Image
                        src={photo}
                        alt={member.name}
                        fill
                        sizes="(min-width: 1024px) 272px, (min-width: 640px) 50vw, 100vw"
                        className="object-cover"
                    />
                ) : (
                    <div aria-hidden className="flex h-full w-full items-end justify-center">
                        <User className="h-3/5 w-3/5 text-white/25" strokeWidth={1} fill="currentColor" />
                    </div>
                )}
            </div>
            <div className="p-5">
                <h3 className="font-bold text-primary">{member.name}</h3>
                <p className="mt-1 text-sm font-medium text-secondary">{member.position}</p>
                {member.bio && <p className="mt-3 line-clamp-3 text-sm text-slate-500">{member.bio}</p>}
            </div>
        </article>
    );
}

export function TeamMembersGrid({ members }: { members: Team[] }) {
    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {members.map((member) => (
                <TeamMemberCard key={member.id} member={member} />
            ))}
        </div>
    );
}
