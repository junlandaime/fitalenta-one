import prisma from "../config/prisma";
import { Prisma } from "../../generated/prisma/client";
import { FeedbackErrors } from "../errors/feedback.errors";
import { buildPaginationMeta, resolvePagination } from "../utils/pagination";

export interface CreateFeedbackInput {
  category: string;
  subject: string;
  message: string;
  pageUrl?: string;
}

export interface FeedbackListFilters {
  status?: string;
  page?: number;
  limit?: number;
}

export interface UpdateFeedbackInput {
  status: string;
  adminNote?: string | null;
}

const feedbackInclude = {
  user: { select: { name: true, email: true } },
} satisfies Prisma.UserFeedbackInclude;

export async function createFeedback(userId: number, input: CreateFeedbackInput) {
  return prisma.userFeedback.create({
    data: {
      userId,
      category: input.category,
      subject: input.subject,
      message: input.message,
      pageUrl: input.pageUrl || null,
    },
  });
}

export async function listFeedbacks({ status, page = 1, limit = 10 }: FeedbackListFilters) {
  const pagination = resolvePagination({ page, limit });
  const where: Prisma.UserFeedbackWhereInput = status ? { status } : {};

  const [items, total] = await Promise.all([
    prisma.userFeedback.findMany({
      where,
      include: feedbackInclude,
      orderBy: { createdAt: "desc" },
      skip: pagination.skip,
      take: pagination.take,
    }),
    prisma.userFeedback.count({ where }),
  ]);

  return {
    items,
    meta: buildPaginationMeta(total, pagination.page, pagination.limit),
  };
}

export async function updateFeedback(id: number, input: UpdateFeedbackInput) {
  const existing = await prisma.userFeedback.findUnique({ where: { id }, select: { id: true } });
  if (!existing) throw FeedbackErrors.notFound();

  return prisma.userFeedback.update({
    where: { id },
    data: {
      status: input.status,
      ...(input.adminNote !== undefined ? { adminNote: input.adminNote || null } : {}),
    },
    include: feedbackInclude,
  });
}
