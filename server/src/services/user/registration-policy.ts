import { Program } from "../../../generated/prisma/client";
import { FORM_TEMPLATES, FormTemplate } from "../../config/registration.config";
import { RegistrationErrors } from "../../errors/registration.errors";
import { CreateRegistrationInput } from "../../types/registration.types";
import { endOfDeadlineDay } from "../../utils/date";

type PolicyProgram = Pick<
  Program,
  "status" | "registrationDeadline" | "capacity" | "currentParticipants"
>;

export function assertProgramAcceptsRegistration(program: PolicyProgram, now = new Date()): void {
  if (program.status === "full") throw RegistrationErrors.programFull();
  if (program.status !== "active") throw RegistrationErrors.programNotActive();

  if (program.registrationDeadline && now > endOfDeadlineDay(program.registrationDeadline)) {
    throw RegistrationErrors.deadlinePassed();
  }

  if (program.capacity !== null && program.currentParticipants >= program.capacity) {
    throw RegistrationErrors.programFull();
  }
}

export function resolveFormTemplate(value?: string | null): FormTemplate {
  return FORM_TEMPLATES.includes(value as FormTemplate) ? (value as FormTemplate) : "default";
}

const REQUIRED_FIELDS_BY_TEMPLATE: Record<
  FormTemplate,
  { key: keyof CreateRegistrationInput; label: string }[]
> = {
  default: [
    { key: "nik", label: "NIK" },
    { key: "birthPlace", label: "Tempat lahir" },
    { key: "parentPhone", label: "Nomor telepon orang tua/wali" },
    { key: "ktpProvinceCode", label: "Provinsi KTP" },
    { key: "ktpCityCode", label: "Kota KTP" },
    { key: "ktpAddress", label: "Alamat KTP" },
  ],
  avionics: [
    { key: "phone", label: "Nomor WhatsApp aktif" },
    { key: "domicileCityName", label: "Domisili sekarang" },
    { key: "major", label: "Program studi" },
    { key: "educationInstitution", label: "Perguruan tinggi" },
    { key: "gpa", label: "IPK" },
    { key: "colorBlindStatus", label: "Status kondisi buta warna" },
  ],
};

export function assertRequiredProfileFields(
  input: CreateRegistrationInput,
  template: FormTemplate
): void {
  const missing = REQUIRED_FIELDS_BY_TEMPLATE[template]
    .filter(({ key }) => {
      const value = input[key];
      return typeof value !== "string" || value.trim().length === 0;
    })
    .map(({ label }) => label);

  if (missing.length > 0) throw RegistrationErrors.missingFields(missing);
}
