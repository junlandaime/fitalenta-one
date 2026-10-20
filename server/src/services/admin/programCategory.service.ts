import prisma from "../../config/prisma";
import { Prisma } from "../../../generated/prisma/client";
import { ProgramCategoryErrors } from "../../errors/programCategory.errors";
import {
  CreateProgramCategoryInput,
  ProgramCategoryItem,
  ProgramCategoryListFilters,
  UpdateProgramCategoryInput,
} from "../../types/program-category.types";
import { PaginationMeta, buildPaginationMeta, resolvePagination } from "../../utils/pagination";

const ORDER_BY: Prisma.ProgramCategoryOrderByWithRelationInput[] = [{ name: "asc" }];

const SELECT = {
  id: true,
  name: true,
  description: true,
  createdAt: true,
  _count: { select: { programs: true } },
} satisfies Prisma.ProgramCategorySelect;

type RawCategory = Prisma.ProgramCategoryGetPayload<{ select: typeof SELECT }>;

function toItem(raw: RawCategory): ProgramCategoryItem {
  return {
    id: raw.id,
    name: raw.name,
    description: raw.description,
    programCount: raw._count.programs,
    createdAt: raw.createdAt,
  };
}

function buildWhere({ search }: ProgramCategoryListFilters): Prisma.ProgramCategoryWhereInput {
  return search ? { name: { contains: search } } : {};
}

async function findOrFail(id: number) {
  const category = await prisma.programCategory.findUnique({
    where: { id },
    select: { ...SELECT },
  });
  if (!category) throw ProgramCategoryErrors.notFound();
  return category;
}

async function assertNameUnique(name: string, excludeId?: number): Promise<void> {
  const existing = await prisma.programCategory.findFirst({
    where: {
      name: { equals: name },
      ...(excludeId ? { id: { not: excludeId } } : {}),
    },
    select: { id: true },
  });
  if (existing) throw ProgramCategoryErrors.nameAlreadyExists();
}

export async function listProgramCategories(
  filters: ProgramCategoryListFilters
): Promise<{ items: ProgramCategoryItem[]; meta: PaginationMeta }> {
  const { page, limit, skip, take } = resolvePagination(filters);
  const where = buildWhere(filters);

  const [total, categories] = await Promise.all([
    prisma.programCategory.count({ where }),
    prisma.programCategory.findMany({ where, select: SELECT, orderBy: ORDER_BY, skip, take }),
  ]);

  return { items: categories.map(toItem), meta: buildPaginationMeta(total, page, limit) };
}

export async function getProgramCategoryById(id: number): Promise<ProgramCategoryItem> {
  return toItem(await findOrFail(id));
}

export async function createProgramCategory(input: CreateProgramCategoryInput): Promise<ProgramCategoryItem> {
  await assertNameUnique(input.name);

  const category = await prisma.programCategory.create({
    data: {
      name: input.name,
      description: input.description ?? null,
    },
    select: SELECT,
  });

  return toItem(category);
}

export async function updateProgramCategory(
  id: number,
  input: UpdateProgramCategoryInput
): Promise<ProgramCategoryItem> {
  await findOrFail(id);

  if (input.name) {
    await assertNameUnique(input.name, id);
  }

  const data: Prisma.ProgramCategoryUpdateInput = {};
  if (input.name !== undefined) data.name = input.name;
  if (input.description !== undefined) data.description = input.description || null;

  const category = await prisma.programCategory.update({
    where: { id },
    data,
    select: SELECT,
  });

  return toItem(category);
}

export async function deleteProgramCategory(id: number): Promise<void> {
  const category = await findOrFail(id);
  if (category._count.programs > 0) throw ProgramCategoryErrors.hasPrograms();

  await prisma.programCategory.delete({ where: { id } });
}
