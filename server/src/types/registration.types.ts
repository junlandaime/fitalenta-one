import { Prisma } from "../../generated/prisma/client";

export type RegistrationProfileInput = Pick<
  Prisma.RegistrationUncheckedCreateInput,
  | "nik"
  | "gender"
  | "birthPlace"
  | "lastEducation"
  | "major"
  | "educationInstitution"
  | "currentActivity"
  | "maritalStatus"
  | "parentPhone"
  | "parentRelationship"
  | "ktpProvinceCode"
  | "ktpProvinceName"
  | "ktpCityCode"
  | "ktpCityName"
  | "ktpAddress"
  | "domicileProvinceCode"
  | "domicileProvinceName"
  | "domicileCityCode"
  | "domicileCityName"
  | "domicileAddress"
>;

export interface CreateRegistrationInput extends RegistrationProfileInput {
  programId: number;
  birthDate: string;
  fullName?: string;
  phone?: string;
}

export interface RegionResult {
  provinceCode: string | null;
  provinceName: string | null;
  cityCode: string | null;
  cityName: string | null;
  address: string | null;
}

export interface RegistrationResult {
  registrationId: number;
  registrationCode: string;
  registrationStatus: string;
  registrationDate: Date;
  program: {
    id: number | null;
    name: string;
    programFormat: string | null;
  };
  payment: {
    id?: number;
    invoiceNumber: string;
    amount: string;
    status: string;
    notes?: string | null;
    installmentPlan: string | null;
  };
  applicant: {
    fullName: string;
    email: string;
    phone: string | null;
    nik: string | null;
    gender: string | null;
    birthPlace: string | null;
    birthDate: string | null;
    lastEducation: string | null;
    major: string | null;
    educationInstitution: string | null;
    currentActivity: string | null;
    maritalStatus: string | null;
    parentRelationship: string | null;
    parentPhone: string | null;
    ktp: RegionResult;
    domicile: RegionResult;
  };
  documents: {
    photoPath: string | null;
    n4CertificatePath: string | null;
    sswCertificatePath: string | null;
  };
}
