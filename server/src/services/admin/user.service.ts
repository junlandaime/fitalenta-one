import prisma from "../../config/prisma";
import { Prisma, Role } from "../../../generated/prisma/client";
import { hashPassword } from "../../utils/password";
import { UserErrors } from "../../errors/user.errors";
import { CreateUserInput, UpdateUserInput, UserItem, UserListFilters, UserSummary } from "../../types/admin.types";
import { isForeignKeyViolation, isUniqueViolation } from "../../utils/prisma-error";
import { PaginationMeta, buildPaginationMeta, resolvePagination } from "../../utils/pagination";

const userSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  role: true,
  createdAt: true,
  updatedAt: true,
  _count: { select: { registrations: true, articles: true } },
} satisfies Prisma.UserSelect;

type UserRecord = Prisma.UserGetPayload<{ select: typeof userSelect }>;

function toUserItem(user: UserRecord, currentUserId: number): UserItem {
  const relatedDataCount = user._count.registrations + user._count.articles;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    registrationsCount: user._count.registrations,
    relatedDataCount,
    canDelete: user.id !== currentUserId && relatedDataCount === 0,
  };
}

function buildUserWhere({ search, role }: UserListFilters): Prisma.UserWhereInput {
  return {
    ...(role ? { role } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search } },
            { email: { contains: search } },
            { phone: { contains: search } },
          ],
        }
      : {}),
  };
}


async function assertEmailAvailable(email: string, excludeUserId?: number): Promise<void> {
  const taken = await prisma.user.findFirst({
    where: { email, ...(excludeUserId ? { NOT: { id: excludeUserId } } : {}) },
    select: { id: true },
  });
  if (taken) throw UserErrors.emailTaken();
}

export async function getSummary(): Promise<UserSummary> {
  const [total, roleGroups, withPhone] = await Promise.all([
    prisma.user.count(),
    prisma.user.groupBy({ by: ["role"], _count: { _all: true } }),
    prisma.user.count({ where: { AND: [{ phone: { not: null } }, { phone: { not: "" } }] } }),
  ]);

  const countByRole = (role: Role) => roleGroups.find((group) => group.role === role)?._count._all ?? 0;

  return {
    total,
    participants: countByRole("user"),
    superAdmins: countByRole("superadmin"),
    administrators: countByRole("admin"),
    editors: countByRole("editor"),
    withPhone,
  };
}

export async function listUsers(
  filters: UserListFilters,
  currentUserId: number
): Promise<{ items: UserItem[]; meta: PaginationMeta }> {
  const { page, limit, skip, take } = resolvePagination(filters);
  const where = buildUserWhere(filters);

  const [total, users] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({ where, select: userSelect, orderBy: { id: "asc" }, skip, take }),
  ]);

  return {
    items: users.map((user) => toUserItem(user, currentUserId)),
    meta: buildPaginationMeta(total, page, limit),
  };
}

export async function getUserById(id: number, currentUserId: number): Promise<UserItem> {
  const user = await prisma.user.findUnique({ where: { id }, select: userSelect });
  if (!user) throw UserErrors.notFound();

  return toUserItem(user, currentUserId);
}

export async function createUser(input: CreateUserInput, currentUserId: number): Promise<UserItem> {
  await assertEmailAvailable(input.email);

  try {
    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        phone: input.phone,
        role: input.role ?? "user",
        emailVerifiedAt: new Date(),
        password: await hashPassword(input.password),
      },
      select: userSelect,
    });
    return toUserItem(user, currentUserId);
  } catch (error) {
    if (isUniqueViolation(error)) throw UserErrors.emailTaken();
    throw error;
  }
}

export async function updateUser(
  id: number,
  input: UpdateUserInput,
  currentUserId: number
): Promise<UserItem> {
  const existing = await prisma.user.findUnique({ where: { id }, select: { id: true, role: true } });
  if (!existing) throw UserErrors.notFound();

  if (input.role && input.role !== existing.role && id === currentUserId) {
    throw UserErrors.cannotChangeOwnRole();
  }
  if (input.email) await assertEmailAvailable(input.email, id);
  
    try {
    const user = await prisma.user.update({
      where: { id },
      data: input,
      select: userSelect,
    });
    return toUserItem(user, currentUserId);
  } catch (error) {
    if (isUniqueViolation(error)) throw UserErrors.emailTaken();
    throw error;
  }
}

export async function deleteUser(id: number, currentUserId: number): Promise<void> {
  if (id === currentUserId) throw UserErrors.cannotDeleteSelf();

  const user = await prisma.user.findUnique({ where: { id }, select: userSelect });
  if (!user) throw UserErrors.notFound();
  if (!toUserItem(user, currentUserId).canDelete) throw UserErrors.hasRelatedData();

  try {
    await prisma.user.delete({ where: { id } });
  } catch (error) {
    if (isForeignKeyViolation(error)) throw UserErrors.hasRelatedData();
    throw error;
  }
}