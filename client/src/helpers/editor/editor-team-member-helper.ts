import type { MemberFormValues } from "@/schemas/editor/editor-team-member";
import type { EditorMember } from "@/types/editor/editor-team-member";

export function createEmptyMemberForm(): MemberFormValues {
    return { name: "", position: "", bio: "", order: "0", isActive: true, removeImage: false };
}

export function toMemberFormValues(member: EditorMember): MemberFormValues {
    return {
        name: member.name,
        position: member.position,
        bio: member.bio ?? "",
        order: String(member.order),
        isActive: member.isActive,
        removeImage: false,
    };
}