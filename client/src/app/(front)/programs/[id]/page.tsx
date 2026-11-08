import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProgramById } from "@/services/program-service";
import { ProgramDetailView } from "../features/program-detail-view";

type Props = { params: Promise<{ id: string }> };

function parseId(raw: string) {
    const id = Number(raw);
    return Number.isInteger(id) && id > 0 ? id : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const id = parseId((await params).id);
    const program = id ? await getProgramById(id) : undefined;
    if (!program) return { title: "Program tidak ditemukan - FITALENTA" };

    return {
        title: `${program.name} - FITALENTA`,
        description: program.description?.slice(0, 160),
    };
}

export default async function ProgramDetailPage({ params }: Props) {
    const id = parseId((await params).id);
    if (!id) notFound();

    const program = await getProgramById(id);
    if (!program) notFound();

    return <ProgramDetailView program={program} area="public" />;
}