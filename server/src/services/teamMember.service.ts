import prisma from "../config/prisma";
import type { TeamMemberType } from "../../generated/prisma/client";
import type { PublicMemberItem } from "../types/team-member.types";

function findPublicMembers(type: TeamMemberType): Promise<PublicMemberItem[]> {
  return prisma.teamMember.findMany({
    where: { isActive: true, type },
    select: { id: true, name: true, position: true, bio: true, image: true },
    orderBy: [{ order: "asc" }, { id: "asc" }],
  });
}

export function getPublicExperts() {
  return findPublicMembers("expert");
}

export function getPublicTeamMembers() {
  return findPublicMembers("team");
}