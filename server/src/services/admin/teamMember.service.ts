import prisma from "../../config/prisma";
import { Prisma, TeamMember, TeamMemberType } from "../../../generated/prisma/client";
import { TeamMemberErrors } from "../../errors/teamMember.errors";
import {
  CreateMemberInput,
  MemberItem,
  MemberListFilters,
  MemberListResult,
  MemberSummary,
  UpdateMemberInput,
} from "../../types/team-member.types";
import { removePublicUpload, toUploadedPath, withUploadCleanup } from "../../utils/file";
import { buildPaginationMeta, resolvePagination } from "../../utils/pagination";
import { TEAM_MEMBER_UPLOAD_FOLDER } from "../../config/team.config";

const ORDER_BY: Prisma.TeamMemberOrderByWithRelationInput[] = [{ order: "asc" }, { id: "asc" }];

function toMemberItem(member: TeamMember): MemberItem {
  return {
    id: member.id,
    type: member.type,
    name: member.name,
    position: member.position,
    bio: member.bio,
    image: member.image,
    order: member.order,
    isActive: member.isActive,
    createdAt: member.createdAt,
    updatedAt: member.updatedAt,
  };
}

function buildWhere(type: TeamMemberType, { search, isActive }: MemberListFilters): Prisma.TeamMemberWhereInput {
  return {
    type,
    ...(isActive !== undefined ? { isActive } : {}),
    ...(search ? { OR: [{ name: { contains: search } }, { position: { contains: search } }] } : {}),
  };
}

function emptyToNull(value?: string): string | null | undefined {
  return value === undefined ? undefined : value || null;
}

async function findOrFail(type: TeamMemberType, id: number): Promise<TeamMember> {
  const member = await prisma.teamMember.findFirst({ where: { id, type } });
  if (!member) throw TeamMemberErrors.notFound();
  return member;
}

async function nextOrder(type: TeamMemberType): Promise<number> {
  const { _max } = await prisma.teamMember.aggregate({ where: { type }, _max: { order: true } });
  return (_max.order ?? 0) + 1;
}

async function getSummary(type: TeamMemberType): Promise<MemberSummary> {
  const [total, active] = await Promise.all([
    prisma.teamMember.count({ where: { type } }),
    prisma.teamMember.count({ where: { type, isActive: true } }),
  ]);
  return { total, active, inactive: total - active };
}

export async function listMembers(type: TeamMemberType, filters: MemberListFilters): Promise<MemberListResult> {
  const { page, limit, skip, take } = resolvePagination(filters);
  const where = buildWhere(type, filters);

  const [members, total, summary] = await Promise.all([
    prisma.teamMember.findMany({ where, orderBy: ORDER_BY, skip, take }),
    prisma.teamMember.count({ where }),
    getSummary(type),
  ]);

  return { items: members.map(toMemberItem), meta: buildPaginationMeta(total, page, limit), summary };
}

export async function getMemberById(type: TeamMemberType, id: number): Promise<MemberItem> {
  return toMemberItem(await findOrFail(type, id));
}

export async function createMember(
  type: TeamMemberType,
  input: CreateMemberInput,
  file?: Express.Multer.File
): Promise<MemberItem> {
  const image = toUploadedPath(TEAM_MEMBER_UPLOAD_FOLDER, file);

  return withUploadCleanup(image, async () => {
    const member = await prisma.teamMember.create({
      data: {
        type,
        name: input.name,
        position: input.position,
        bio: emptyToNull(input.bio),
        image,
        order: input.order ?? (await nextOrder(type)),
        isActive: input.isActive,
      },
    });
    return toMemberItem(member);
  });
}

export async function updateMember(
  type: TeamMemberType,
  id: number,
  input: UpdateMemberInput,
  file?: Express.Multer.File
): Promise<MemberItem> {
  const newImage = toUploadedPath(TEAM_MEMBER_UPLOAD_FOLDER, file);
  const replacesImage = newImage !== undefined || input.removeImage === true;

  return withUploadCleanup(newImage, async () => {
    const existing = await findOrFail(type, id);

    const member = await prisma.teamMember.update({
      where: { id },
      data: {
        name: input.name,
        position: input.position,
        bio: emptyToNull(input.bio),
        order: input.order,
        isActive: input.isActive,
        image: replacesImage ? (newImage ?? null) : undefined,
      },
    });

    if (replacesImage) await removePublicUpload(existing.image);
    return toMemberItem(member);
  });
}

export async function deleteMember(type: TeamMemberType, id: number): Promise<void> {
  const existing = await findOrFail(type, id);
  await prisma.teamMember.delete({ where: { id } });
  await removePublicUpload(existing.image);
}

export async function reorderMembers(type: TeamMemberType, ids: number[]): Promise<MemberItem[]> {
  const found = await prisma.teamMember.count({ where: { id: { in: ids }, type } });
  if (found !== ids.length) throw TeamMemberErrors.someNotFound();

  await prisma.$transaction(
    ids.map((id, index) => prisma.teamMember.update({ where: { id }, data: { order: index + 1 } }))
  );

  const members = await prisma.teamMember.findMany({ where: { type }, orderBy: ORDER_BY });
  return members.map(toMemberItem);
}