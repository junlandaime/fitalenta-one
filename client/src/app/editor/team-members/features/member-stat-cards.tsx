import { UserCheck, UserX, Users } from "lucide-react";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import { MEMBER_KINDS, type MemberKind } from "@/constants/editor/editor-team-member-constant";
import type { EditorMemberSummary } from "@/types/editor/editor-team-member";

type MemberStatCardsProps = {
    kind: MemberKind;
    summary?: EditorMemberSummary;
};

export function MemberStatCards({ kind, summary }: MemberStatCardsProps) {
    const { noun, shownIn } = MEMBER_KINDS[kind];

    return (
        <div className="grid gap-4 sm:grid-cols-3">
            <AdminStatCard title={`Total ${noun}`} value={summary?.total} note={`Seluruh ${noun} tersimpan`} icon={Users} />
            <AdminStatCard title="Aktif" value={summary?.active} note={`Tampil di ${shownIn}`} icon={UserCheck} />
            <AdminStatCard title="Nonaktif" value={summary?.inactive} note="Disembunyikan dari website" icon={UserX} />
        </div>
    );
}
