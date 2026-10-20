import { z } from "zod";
import { CONTENT_LIMITS } from "@/constants/editor/editor-content-constant";
import { MEMBER_LIMITS } from "@/constants/editor/editor-team-member-constant";
import { optionalText, requiredInt, requiredText } from "@/schemas/editor/editor-common";

export type MemberFormValues = {
    name: string;
    position: string;
    bio: string;
    order: string;
    isActive: boolean;
    removeImage: boolean;
};

export function buildMemberSchema() {
    return z.object({
        name: requiredText("Nama", MEMBER_LIMITS.name),
        position: requiredText("Jabatan", MEMBER_LIMITS.position),
        bio: optionalText("Bio", MEMBER_LIMITS.bio),
        order: requiredInt("Urutan", 0, CONTENT_LIMITS.order),
        isActive: z.boolean(),
        removeImage: z.boolean(),
    });
}