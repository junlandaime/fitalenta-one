import { Prisma, Registration } from "../../../generated/prisma/client";
import { RegistrationResult } from "../../types/registration.types";

export const registrationResultInclude = {
  user: { select: { name: true, email: true, phone: true } },
  program: { select: { id: true, name: true, programFormat: true, installmentPlan: true } },
  payments: { select: { id: true, invoiceNumber: true, amount: true, status: true, notes: true } },
} satisfies Prisma.RegistrationInclude;

type RegistrationRecord = Prisma.RegistrationGetPayload<{
  include: typeof registrationResultInclude;
}>;

type ApplicantSource = Registration & {
  user: { name: string; email: string; phone: string | null } | null;
};

export function toDateOnly(date: Date | null): string | null {
  return date ? date.toISOString().slice(0, 10) : null;
}

export function toApplicant(registration: ApplicantSource): RegistrationResult["applicant"] {
  const { user } = registration;

  return {
    fullName: user?.name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? null,
    nik: registration.nik,
    gender: registration.gender,
    birthPlace: registration.birthPlace,
    birthDate: toDateOnly(registration.birthDate),
    lastEducation: registration.lastEducation,
    major: registration.major,
    educationInstitution: registration.educationInstitution,
    currentActivity: registration.currentActivity,
    maritalStatus: registration.maritalStatus,
    parentRelationship: registration.parentRelationship,
    parentPhone: registration.parentPhone,
    ktp: {
      provinceCode: registration.ktpProvinceCode,
      provinceName: registration.ktpProvinceName,
      cityCode: registration.ktpCityCode,
      cityName: registration.ktpCityName,
      address: registration.ktpAddress,
    },
    domicile: {
      provinceCode: registration.domicileProvinceCode,
      provinceName: registration.domicileProvinceName,
      cityCode: registration.domicileCityCode,
      cityName: registration.domicileCityName,
      address: registration.domicileAddress,
    },
  };
}

export function toDocuments(
  registration: Pick<Registration, "photoPath" | "n4CertificatePath" | "sswCertificatePath">
): RegistrationResult["documents"] {
  return {
    photoPath: registration.photoPath,
    n4CertificatePath: registration.n4CertificatePath,
    sswCertificatePath: registration.sswCertificatePath,
  };
}

export function toRegistrationResult(registration: RegistrationRecord): RegistrationResult {
  const { program, payments } = registration;
  const [payment] = payments;

  return {
    registrationId: registration.id,
    registrationCode: registration.registrationCode,
    registrationStatus: registration.registrationStatus,
    registrationDate: registration.registrationDate,
    program: {
      id: program?.id ?? null,
      name: program?.name ?? "",
      programFormat: program?.programFormat ?? null,
    },
    payment: {
      id: payment.id,
      invoiceNumber: payment.invoiceNumber,
      amount: payment.amount.toString(),
      status: payment.status,
      notes: payment.notes,
      installmentPlan: program?.installmentPlan ?? null,
    },
    applicant: toApplicant(registration),
    documents: toDocuments(registration),
  };
}
