import prisma from "../../config/prisma";
import { Prisma } from "../../../generated/prisma/client";
import { MAX_CODE_COLLISION_RETRIES, REGISTRATION_FEE } from "../../config/registration.config";
import { RegistrationErrors } from "../../errors/registration.errors";
import {
  CreateRegistrationInput,
  RegistrationResult,
} from "../../types/registration.types";
import {
  nextInvoiceNumber,
  nextRegistrationCode,
} from "../../utils/code-generator";
import { isUniqueViolation } from "../../utils/prisma-error";
import { assertProgramAcceptsRegistration } from "./registration-policy";
import {
  RegistrationFilePaths,
  assertRequiredFiles,
} from "./registration-files";
import {
  registrationResultInclude,
  toRegistrationResult,
} from "./registration.mapper";
import {
  buildInvoiceIssuedNotification,
  createPaymentNotification,
} from "../admin/payment.notifications";

const ISSUED_ONLY = {
  issuedAt: { not: null },
} satisfies Prisma.PaymentWhereInput;

export async function getMyRegistrations(userId: number) {
  return prisma.registration.findMany({
    where: { userId },
    include: {
      program: true,
      selectionStatuses: { orderBy: { createdAt: "desc" }, take: 1 },
      placementStatuses: { orderBy: { createdAt: "desc" }, take: 1 },
      payments: { where: ISSUED_ONLY },
    },
    orderBy: { registrationDate: "desc" },
  });
}

export async function getMyRegistrationById(userId: number, id: number) {
  const registration = await prisma.registration.findFirst({
    where: { id, userId },
    include: {
      program: true,
      statusHistory: { orderBy: { changedAt: "desc" } },
      selectionStatuses: { orderBy: { createdAt: "desc" } },
      placementStatuses: { orderBy: { createdAt: "desc" } },
      payments: {
        where: ISSUED_ONLY,
        include: { paymentHistory: { orderBy: { changedAt: "desc" } } },
      },
    },
  });
  if (!registration) throw new Error("REGISTRATION_NOT_FOUND");
  return registration;
}

async function reserveSlot(
  tx: Prisma.TransactionClient,
  program: { id: number; capacity: number | null },
): Promise<void> {
  const result = await tx.program.updateMany({
    where: {
      id: program.id,
      ...(program.capacity !== null
        ? { currentParticipants: { lt: program.capacity } }
        : {}),
    },
    data: { currentParticipants: { increment: 1 } },
  });
  if (result.count === 0) throw RegistrationErrors.programFull();
}

async function registerInTransaction(
  tx: Prisma.TransactionClient,
  userId: number,
  input: CreateRegistrationInput,
  filePaths: RegistrationFilePaths,
): Promise<RegistrationResult> {
  const { programId, birthDate, fullName, phone, ...profile } = input;

  const user = await tx.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });
  if (!user) throw RegistrationErrors.userNotFound();

  const program = await tx.program.findUnique({ where: { id: programId } });
  if (!program) throw RegistrationErrors.programNotFound();
  assertProgramAcceptsRegistration(program);

  const existing = await tx.registration.findUnique({
    where: { unique_user_program: { userId, programId } },
    select: { id: true },
  });
  if (existing) throw RegistrationErrors.alreadyRegistered();

  await reserveSlot(tx, program);

  const registrationCode = await nextRegistrationCode(tx);
  const invoiceNumber = await nextInvoiceNumber(tx);

  if (fullName || phone) {
    await tx.user.update({
      where: { id: userId },
      data: {
        ...(fullName ? { name: fullName } : {}),
        ...(phone ? { phone } : {}),
      },
    });
  }

  const dueDate = program.registrationDeadline ?? null;
  const registrationFeeNotes = REGISTRATION_FEE.defaultNotes(program.name);
  const now = new Date();

  const registration = await tx.registration.create({
    data: {
      userId,
      programId,
      registrationCode,
      birthDate: new Date(birthDate),
      ...profile,
      ...filePaths,
      payments: {
        create: {
          invoiceNumber,
          amount: REGISTRATION_FEE.amount,
          status: "pending",
          currentInstallmentNumber: 0,
          issuedAt: now,
          dueDate,
          nextDueDate: dueDate,
          notes: registrationFeeNotes,
        },
      },
      selectionStatuses: { create: {} },
      placementStatuses: { create: {} },
    },
    include: registrationResultInclude,
  });

  const createdPayment = registration.payments[0];
  if (createdPayment) {
    await createPaymentNotification(
      tx,
      userId,
      createdPayment.id,
      buildInvoiceIssuedNotification({
        invoiceNumber,
        amount: new Prisma.Decimal(REGISTRATION_FEE.amount),
        dueDate,
      })
    );
  }

  return toRegistrationResult(registration);
}

export async function createRegistration(
  userId: number,
  input: CreateRegistrationInput,
  filePaths: RegistrationFilePaths,
): Promise<RegistrationResult> {
  assertRequiredFiles(filePaths);

  for (let attempt = 1; ; attempt++) {
    try {
      return await prisma.$transaction((tx) =>
        registerInTransaction(tx, userId, input, filePaths),
      );
    } catch (error) {
      if (!isUniqueViolation(error)) throw error;

      const duplicate = await prisma.registration.findUnique({
        where: { unique_user_program: { userId, programId: input.programId } },
        select: { id: true },
      });
      if (duplicate) throw RegistrationErrors.alreadyRegistered();
      if (attempt >= MAX_CODE_COLLISION_RETRIES)
        throw RegistrationErrors.codeGenerationFailed();
    }
  }
}
