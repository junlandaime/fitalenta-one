import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProgramDetailView } from "@/app/(front)/programs/features/program-detail-view";
import { getProgramById } from "@/services/program-service";

type Props = { params: Promise<{ id: string }> };

function parseId(raw: string) {
    const id = Number(raw);
    return Number.isInteger(id) && id > 0 ? id : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const id = parseId((await params).id);
    const program = id ? await getProgramById(id) : undefined;

    return { title: program ? `${program.name} - FITALENTA` : "Program tidak ditemukan - FITALENTA" };
}

export default async function UserProgramDetailPage({ params }: Props) {
    const id = parseId((await params).id);
    if (!id) notFound();

    const program = await getProgramById(id);
    if (!program) notFound();

    return <ProgramDetailView program={program} area="user" />;
}