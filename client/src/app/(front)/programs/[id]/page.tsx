import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { toProgramSlug } from "@/helpers/program-helper";
import { getProgramBySlugOrId } from "@/services/program-service";
import { ProgramDetailView } from "../features/program-detail-view";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const program = await getProgramBySlugOrId((await params).id);
    if (!program) return { title: "Program tidak ditemukan - FITALENTA" };

    return {
        title: `${program.name} - FITALENTA`,
        description: program.description?.slice(0, 160),
    };
}

export default async function ProgramDetailPage({ params }: Props) {
    const { id: raw } = await params;
    const program = await getProgramBySlugOrId(raw);
    if (!program) notFound();

    const slug = toProgramSlug(program.name);
    if (/^\d+$/.test(raw) && slug) {
        redirect(`/programs/${slug}`);
    }

    return <ProgramDetailView program={program} area="public" />;
}
