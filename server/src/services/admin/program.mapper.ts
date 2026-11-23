import { Prisma } from "../../../generated/prisma/client";
import { ProgramDetail, ProgramListItem } from "../../types/program.types";
import { toDateOnly } from "../user/registration.mapper";

export const programListSelect = {
  id: true,
  name: true,
  programFormat: true,
  formTemplate: true,
  duration: true,
  capacity: true,
  currentParticipants: true,
  trainingCost: true,
  status: true,
  isRunning: true,
  sortOrder: true,
  category: { select: { id: true, name: true } },
  _count: { select: { registrations: true } },
} satisfies Prisma.ProgramSelect;

export const programDetailInclude = {
  category: { select: { id: true, name: true } },
  _count: { select: { registrations: true } },
} satisfies Prisma.ProgramInclude;

type ProgramListRecord = Prisma.ProgramGetPayload<{ select: typeof programListSelect }>;
type ProgramDetailRecord = Prisma.ProgramGetPayload<{ include: typeof programDetailInclude }>;

export function toProgramListItem(program: ProgramListRecord): ProgramListItem {
  const registrationCount = program._count.registrations;

  return {
    id: program.id,
    name: program.name,
    programFormat: program.programFormat,
    formTemplate: program.formTemplate,
    category: program.category,
    duration: program.duration,
    capacity: program.capacity,
    currentParticipants: program.currentParticipants,
    remainingSlots:
      program.capacity === null ? null : Math.max(0, program.capacity - program.currentParticipants),
    trainingCost: program.trainingCost.toString(),
    status: program.status,
    isRunning: program.isRunning,
    sortOrder: program.sortOrder,
    registrationCount,
    canDelete: registrationCount === 0,
  };
}

export function toProgramDetail(program: ProgramDetailRecord): ProgramDetail {
  return {
    ...toProgramListItem(program),
    categoryId: program.categoryId,
    description: program.description,
    requirements: program.requirements,
    schedule: program.schedule,
    contactInfo: program.contactInfo,
    registrationDeadline: toDateOnly(program.registrationDeadline),
    startDate: toDateOnly(program.startDate),
    endDate: toDateOnly(program.endDate),
    location: program.location,
    trainingFeeDetails: program.trainingFeeDetails,
    departureCost: program.departureCost.toString(),
    departureFeeDetails: program.departureFeeDetails,
    installmentPlan: program.installmentPlan,
    downPayment: program.downPayment.toString(),
    jobMatchingCost: program.jobMatchingCost.toString(),
    bridgeFund: program.bridgeFund,
    timelineText: program.timelineText,
    requirementsText: program.requirementsText,
    createdAt: program.createdAt,
    updatedAt: program.updatedAt,
  };
}