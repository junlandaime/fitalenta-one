import type { Metadata } from "next";
import { TeamMemberManagementView } from "./features/team-member-management-view";

export const metadata: Metadata = {
    title: "Manajemen Tim - FITALENTA",
};

export default function EditorTeamMembersPage() {
    return <TeamMemberManagementView />;
}
