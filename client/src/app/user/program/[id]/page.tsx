import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ProgramDetailView } from "@/app/(front)/programs/features/program-detail-view";
import { toProgramSlug } from "@/helpers/program-helper";
import { getProgramBySlugOrId } from "@/services/program-service";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const program = await getProgramBySlugOrId((await params).id);

    return { title: program ? `${program.name} - FITALENTA` : "Program tidak ditemukan - FITALENTA" };
}

export default async function UserProgramDetailPage({ params }: Props) {
    const { id: raw } = await params;
    const program = await getProgramBySlugOrId(raw);
    if (!program) notFound();

    const slug = toProgramSlug(program.name);
    if (/^\d+$/.test(raw) && slug) {
        redirect(`/user/program/${slug}`);
    }

    return <ProgramDetailView program={program} area="user" />;
}
