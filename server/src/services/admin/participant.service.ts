import prisma from "../../config/prisma";
import { Prisma } from "../../../generated/prisma/client";
import { ParticipantExportRow } from "./participant.excel";
import { PaginationMeta, buildPaginationMeta, resolvePagination } from "../../utils/pagination";
import { PaginationQuery } from "../../utils/pagination";

export interface ParticipantExportFilters {
  search?: string;
  programId?: number;
  registrationStatus?: string;
}

function buildParticipantWhere(filters: ParticipantExportFilters): Prisma.RegistrationWhereInput {
  return {
    ...(filters.programId ? { programId: filters.programId } : {}),
    ...(filters.registrationStatus ? { registrationStatus: filters.registrationStatus as any } : {}),
    ...(filters.search
      ? {
          OR: [
            { registrationCode: { contains: filters.search } },
            { user: { name: { contains: filters.search } } },
            { user: { email: { contains: filters.search } } },
            { user: { phone: { contains: filters.search } } },
            { nik: { contains: filters.search } },
          ],
        }
      : {}),
  };
}

const participantExportInclude = {
  user: { select: { name: true, email: true, phone: true } },
  program: { select: { name: true, programFormat: true } },
  selectionStatuses: { orderBy: [{ createdAt: "desc" as const }, { id: "desc" as const }], take: 1 },
  placementStatuses: { orderBy: [{ createdAt: "desc" as const }, { id: "desc" as const }], take: 1 },
  payments: { orderBy: { createdAt: "desc" as const }, take: 1, select: { status: true, amountPaid: true } },
} satisfies Prisma.RegistrationInclude;

type RegistrationExportRecord = Prisma.RegistrationGetPayload<{ include: typeof participantExportInclude }>;

function toExportRow(reg: RegistrationExportRecord): ParticipantExportRow {
  const [selection] = reg.selectionStatuses;
  const [placement] = reg.placementStatuses;
  const [payment] = reg.payments;

  return {
    registrationCode: reg.registrationCode,
    registrationDate: reg.registrationDate,
    registrationStatus: reg.registrationStatus,
    fullName: reg.user?.name ?? "",
    email: reg.user?.email ?? "",
    phone: reg.user?.phone ?? null,
    nik: reg.nik,
    gender: reg.gender,
    birthPlace: reg.birthPlace,
    birthDate: reg.birthDate,
    lastEducation: reg.lastEducation,
    major: reg.major,
    educationInstitution: reg.educationInstitution,
    currentActivity: reg.currentActivity,
    maritalStatus: reg.maritalStatus,
    parentPhone: reg.parentPhone,
    parentRelationship: reg.parentRelationship,
    ktpProvinceName: reg.ktpProvinceName,
    ktpCityName: reg.ktpCityName,
    ktpAddress: reg.ktpAddress,
    domicileProvinceName: reg.domicileProvinceName,
    domicileCityName: reg.domicileCityName,
    domicileAddress: reg.domicileAddress,
    programName: reg.program?.name ?? "",
    programFormat: reg.program?.programFormat ?? null,
    selectionStatus: selection?.status ?? null,
    placementStatus: placement?.status ?? null,
    companyName: placement?.companyName ?? null,
    placementDate: placement?.placementDate ?? null,
    paymentStatus: payment?.status ?? null,
    amountPaid: payment?.amountPaid?.toString() ?? null,
  };
}

export async function exportParticipants(filters: ParticipantExportFilters): Promise<ParticipantExportRow[]> {
  const where = buildParticipantWhere(filters);
  const [registrations, unregisteredUsers] = await Promise.all([
    prisma.registration.findMany({
      where,
      include: participantExportInclude,
      orderBy: { registrationDate: "desc" },
    }),
    !filters.programId && !filters.registrationStatus
      ? prisma.user.findMany({
          where: {
            role: "user",
            registrations: { none: {} },
            ...(filters.search
              ? {
                  OR: [
                    { name: { contains: filters.search } },
                    { email: { contains: filters.search } },
                    { phone: { contains: filters.search } },
                  ],
                }
              : {}),
          },
          select: { name: true, email: true, phone: true, birthPlace: true, birthDate: true, address: true },
          orderBy: { createdAt: "desc" },
        })
      : Promise.resolve([]),
  ]);

  return [
    ...registrations.map(toExportRow),
    ...unregisteredUsers.map((user) => ({
      registrationCode: "",
      registrationDate: null,
      registrationStatus: "",
      fullName: user.name,
      email: user.email,
      phone: user.phone,
      nik: null,
      gender: null,
      birthPlace: user.birthPlace,
      birthDate: user.birthDate,
      lastEducation: null,
      major: null,
      educationInstitution: null,
      currentActivity: null,
      maritalStatus: null,
      parentPhone: null,
      parentRelationship: null,
      ktpProvinceName: null,
      ktpCityName: null,
      ktpAddress: null,
      domicileProvinceName: null,
      domicileCityName: null,
      domicileAddress: user.address,
      programName: "",
      programFormat: null,
      selectionStatus: null,
      placementStatus: null,
      companyName: null,
      placementDate: null,
      paymentStatus: null,
      amountPaid: null,
    })),
  ];
}

export interface ParticipantImportInput {
  fullName: string;
  email: string;
  phone?: string | null;
  nik?: string | null;
  gender?: string | null;
  birthPlace?: string | null;
  birthDate?: string | null;
  lastEducation?: string | null;
  major?: string | null;
  educationInstitution?: string | null;
  currentActivity?: string | null;
  maritalStatus?: string | null;
  parentPhone?: string | null;
  parentRelationship?: string | null;
  ktpProvinceName?: string | null;
  ktpCityName?: string | null;
  ktpAddress?: string | null;
  domicileProvinceName?: string | null;
  domicileCityName?: string | null;
  domicileAddress?: string | null;
  programName: string;
}

export interface ImportResult {
  success: number;
  errors: { row: number; email: string; programName: string; reason: string }[];
  committed: boolean;
}

export async function importParticipants(
  rows: ParticipantImportInput[],
  dryRun = false
): Promise<ImportResult> {
  const errors: ImportResult["errors"] = [];
  const validUpdates: { registrationId: number; data: Prisma.RegistrationUpdateInput; userUpdate?: Prisma.UserUpdateInput }[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowNum = i + 2; // 1-based, row 1 is header

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: row.email.toLowerCase() },
      select: { id: true },
    });

    if (!user) {
      errors.push({ row: rowNum, email: row.email, programName: row.programName, reason: "User dengan email ini tidak ditemukan." });
      continue;
    }

    // Find program by name
    const program = await prisma.program.findFirst({
      where: { name: row.programName },
      select: { id: true },
    });

    if (!program) {
      errors.push({ row: rowNum, email: row.email, programName: row.programName, reason: `Program "${row.programName}" tidak ditemukan.` });
      continue;
    }

    // Find registration
    const registration = await prisma.registration.findFirst({
      where: { userId: user.id, programId: program.id },
      select: { id: true },
    });

    if (!registration) {
      errors.push({ row: rowNum, email: row.email, programName: row.programName, reason: `Peserta belum mendaftar ke program "${row.programName}".` });
      continue;
    }

    const regData: Prisma.RegistrationUpdateInput = {};
    if (row.nik !== undefined) regData.nik = row.nik;
    if (row.gender !== undefined) regData.gender = (row.gender as any) ?? null;
    if (row.birthPlace !== undefined) regData.birthPlace = row.birthPlace;
    if (row.birthDate !== undefined) regData.birthDate = row.birthDate ? new Date(row.birthDate) : null;
    if (row.lastEducation !== undefined) regData.lastEducation = row.lastEducation;
    if (row.major !== undefined) regData.major = row.major;
    if (row.educationInstitution !== undefined) regData.educationInstitution = row.educationInstitution;
    if (row.currentActivity !== undefined) regData.currentActivity = row.currentActivity;
    if (row.maritalStatus !== undefined) regData.maritalStatus = row.maritalStatus;
    if (row.parentPhone !== undefined) regData.parentPhone = row.parentPhone;
    if (row.parentRelationship !== undefined) regData.parentRelationship = row.parentRelationship;
    if (row.ktpProvinceName !== undefined) regData.ktpProvinceName = row.ktpProvinceName;
    if (row.ktpCityName !== undefined) regData.ktpCityName = row.ktpCityName;
    if (row.ktpAddress !== undefined) regData.ktpAddress = row.ktpAddress;
    if (row.domicileProvinceName !== undefined) regData.domicileProvinceName = row.domicileProvinceName;
    if (row.domicileCityName !== undefined) regData.domicileCityName = row.domicileCityName;
    if (row.domicileAddress !== undefined) regData.domicileAddress = row.domicileAddress;

    const userUpdate: Prisma.UserUpdateInput = {};
    if (row.fullName) userUpdate.name = row.fullName;
    if (row.phone !== undefined) userUpdate.phone = row.phone;

    validUpdates.push({ registrationId: registration.id, data: regData, userUpdate: Object.keys(userUpdate).length > 0 ? userUpdate : undefined });
  }

  if (errors.length > 0) {
    return { success: 0, errors, committed: false };
  }

  if (dryRun) {
    return { success: validUpdates.length, errors: [], committed: false };
  }

  // Execute updates
  await prisma.$transaction(async (tx) => {
    for (const item of validUpdates) {
      if (Object.keys(item.data).length > 0) {
        await tx.registration.update({ where: { id: item.registrationId }, data: item.data });
      }
      if (item.userUpdate) {
        const reg = await tx.registration.findUnique({ where: { id: item.registrationId }, select: { userId: true } });
        if (reg?.userId) {
          await tx.user.update({ where: { id: reg.userId }, data: item.userUpdate });
        }
      }
    }
  });

  return { success: validUpdates.length, errors: [], committed: true };
}
