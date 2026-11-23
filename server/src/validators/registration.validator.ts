import { body, ValidationChain } from "express-validator";
import { Gender } from "../../generated/prisma/client";
import { COLOR_BLIND_OPTIONS, NIK_PATTERN, PHONE_PATTERN } from "../config/registration.config";

interface TextField {
  field: string;
  label: string;
  required?: boolean;
  max?: number;
}

const TEXT_FIELDS: TextField[] = [
  { field: "birthPlace", label: "Tempat lahir" },
  { field: "lastEducation", label: "Pendidikan terakhir", required: true },
  { field: "major", label: "Jurusan" },
  { field: "educationInstitution", label: "Institusi pendidikan" },
  { field: "currentActivity", label: "Kegiatan saat ini" },
  { field: "maritalStatus", label: "Status pernikahan", max: 50 },
  { field: "parentRelationship", label: "Hubungan dengan orang tua/wali", max: 50 },
  { field: "ktpProvinceCode", label: "Kode provinsi KTP", max: 20 },
  { field: "ktpProvinceName", label: "Provinsi KTP" },
  { field: "ktpCityCode", label: "Kode kota KTP", max: 20 },
  { field: "ktpCityName", label: "Kota KTP" },
  { field: "ktpAddress", label: "Alamat KTP", max: 1000 },
  { field: "domicileProvinceCode", label: "Kode provinsi domisili", max: 20 },
  { field: "domicileProvinceName", label: "Provinsi domisili" },
  { field: "domicileCityCode", label: "Kode kota domisili", max: 20 },
  { field: "domicileCityName", label: "Kota domisili" },
  { field: "domicileAddress", label: "Alamat domisili", max: 1000 },
  { field: "fullName", label: "Nama lengkap" },
  { field: "gpa", label: "IPK", max: 10 },
];

function baseChain(field: string, label: string, required: boolean): ValidationChain {
  return required
    ? body(field).trim().notEmpty().withMessage(`${label} wajib diisi`).bail()
    : body(field).optional({ values: "falsy" }).trim();
}

function textRule({ field, label, required = false, max = 255 }: TextField): ValidationChain {
  return baseChain(field, label, required)
    .isLength({ max })
    .withMessage(`${label} maksimal ${max} karakter`);
}

function phoneRule(field: string, label: string, required: boolean): ValidationChain {
  return baseChain(field, label, required)
    .matches(PHONE_PATTERN)
    .withMessage(`${label} tidak valid (contoh: 081234567890)`);
}

const GENDER_VALUES = Object.values(Gender);

export const createRegistrationRules: ValidationChain[] = [
  body("programId")
    .notEmpty().withMessage("Program wajib dipilih").bail()
    .isInt({ min: 1 }).withMessage("Program tidak valid")
    .toInt(),

  body("nik")
    .optional({ values: "falsy" })
    .trim()
    .matches(NIK_PATTERN).withMessage("NIK harus 16 digit angka"),

  body("gender")
    .notEmpty().withMessage("Jenis kelamin wajib diisi").bail()
    .isIn(GENDER_VALUES).withMessage(`Jenis kelamin harus salah satu dari: ${GENDER_VALUES.join(", ")}`),

  body("birthDate")
    .trim()
    .notEmpty().withMessage("Tanggal lahir wajib diisi").bail()
    .isISO8601({ strict: true, strictSeparator: true }).withMessage("Tanggal lahir harus berformat YYYY-MM-DD").bail()
    .custom((value: string) => new Date(value) < new Date()).withMessage("Tanggal lahir tidak boleh di masa depan"),

  body("colorBlindStatus")
    .optional({ values: "falsy" })
    .trim()
    .isIn(COLOR_BLIND_OPTIONS).withMessage(`Status buta warna harus salah satu dari: ${COLOR_BLIND_OPTIONS.join(", ")}`),

  phoneRule("parentPhone", "Nomor telepon orang tua/wali", false),
  phoneRule("phone", "Nomor telepon", false),

  ...TEXT_FIELDS.map(textRule),
];
