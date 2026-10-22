export const PARTICIPANT_SHEET_NAME = "Data Peserta";
export const PARTICIPANT_INSTRUCTION_SHEET_NAME = "Panduan Import";
export const PARTICIPANT_HEADER_FILL = "FF1B4F72";
export const XLSX_MIME = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

export type ParticipantColumnKey =
  | "no"
  | "registrationCode"
  | "registrationDate"
  | "registrationStatus"
  | "fullName"
  | "email"
  | "phone"
  | "nik"
  | "gender"
  | "birthPlace"
  | "birthDate"
  | "lastEducation"
  | "major"
  | "educationInstitution"
  | "currentActivity"
  | "maritalStatus"
  | "parentPhone"
  | "parentRelationship"
  | "ktpProvinceName"
  | "ktpCityName"
  | "ktpAddress"
  | "domicileProvinceName"
  | "domicileCityName"
  | "domicileAddress"
  | "programName"
  | "programFormat"
  | "selectionStatus"
  | "placementStatus"
  | "companyName"
  | "placementDate"
  | "paymentStatus"
  | "amountPaid";

export interface ParticipantColumn {
  key: ParticipantColumnKey;
  header: string;
  width: number;
}

export const PARTICIPANT_COLUMNS: ParticipantColumn[] = [
  { key: "no", header: "No", width: 5 },
  { key: "registrationCode", header: "Kode Registrasi", width: 20 },
  { key: "registrationDate", header: "Tgl Registrasi", width: 18 },
  { key: "registrationStatus", header: "Status Registrasi", width: 18 },
  { key: "fullName", header: "Nama Lengkap", width: 30 },
  { key: "email", header: "Email", width: 30 },
  { key: "phone", header: "No. HP", width: 18 },
  { key: "nik", header: "NIK", width: 20 },
  { key: "gender", header: "Jenis Kelamin", width: 15 },
  { key: "birthPlace", header: "Tempat Lahir", width: 20 },
  { key: "birthDate", header: "Tgl Lahir", width: 15 },
  { key: "lastEducation", header: "Pendidikan Terakhir", width: 22 },
  { key: "major", header: "Jurusan", width: 22 },
  { key: "educationInstitution", header: "Institusi Pendidikan", width: 28 },
  { key: "currentActivity", header: "Aktivitas Saat Ini", width: 22 },
  { key: "maritalStatus", header: "Status Pernikahan", width: 18 },
  { key: "parentPhone", header: "No. HP Orang Tua", width: 20 },
  { key: "parentRelationship", header: "Hub. Orang Tua", width: 18 },
  { key: "ktpProvinceName", header: "Provinsi KTP", width: 22 },
  { key: "ktpCityName", header: "Kota/Kab KTP", width: 22 },
  { key: "ktpAddress", header: "Alamat KTP", width: 40 },
  { key: "domicileProvinceName", header: "Provinsi Domisili", width: 22 },
  { key: "domicileCityName", header: "Kota/Kab Domisili", width: 22 },
  { key: "domicileAddress", header: "Alamat Domisili", width: 40 },
  { key: "programName", header: "Program", width: 30 },
  { key: "programFormat", header: "Format Program", width: 18 },
  { key: "selectionStatus", header: "Status Seleksi", width: 18 },
  { key: "placementStatus", header: "Status Penempatan", width: 20 },
  { key: "companyName", header: "Nama Perusahaan", width: 28 },
  { key: "placementDate", header: "Tgl Penempatan", width: 18 },
  { key: "paymentStatus", header: "Status Pembayaran", width: 20 },
  { key: "amountPaid", header: "Jumlah Dibayar", width: 20 },
];

export const PARTICIPANT_REQUIRED_COLUMNS: ParticipantColumnKey[] = ["email", "programName"];

export const GENDER_LABELS: Record<string, string> = {
  L: "Laki-laki",
  P: "Perempuan",
};

export const REGISTRATION_STATUS_LABELS: Record<string, string> = {
  menunggu: "Menunggu",
  lolos: "Lolos",
  tidak_lolos: "Tidak Lolos",
};

export const SELECTION_STATUS_LABELS: Record<string, string> = {
  menunggu: "Menunggu",
  lolos: "Lolos",
  tidak_lolos: "Tidak Lolos",
};

export const PLACEMENT_STATUS_LABELS: Record<string, string> = {
  proses: "Proses",
  lolos: "Lolos",
  ditempatkan: "Ditempatkan",
};

export const PAYMENT_STATUS_LABELS_PARTICIPANT: Record<string, string> = {
  pending: "Pending",
  installment_1: "Cicilan 1",
  installment_2: "Cicilan 2",
  installment_3: "Cicilan 3",
  installment_4: "Cicilan 4",
  installment_5: "Cicilan 5",
  installment_6: "Cicilan 6",
  paid: "Lunas",
  overdue: "Jatuh Tempo",
  cancelled: "Dibatalkan",
};

export const IMPORT_PARTICIPANT_LIMITS = {
  maxRows: 500,
};
