import ExcelJS from "exceljs";
import {
  GENDER_LABELS,
  PARTICIPANT_COLUMNS,
  PARTICIPANT_HEADER_FILL,
  PARTICIPANT_INSTRUCTION_SHEET_NAME,
  PARTICIPANT_SHEET_NAME,
  PLACEMENT_STATUS_LABELS,
  REGISTRATION_STATUS_LABELS,
  SELECTION_STATUS_LABELS,
  PAYMENT_STATUS_LABELS_PARTICIPANT,
} from "../../config/participant.config";

const JAKARTA_OFFSET_MS = 7 * 3_600_000;

export interface ParticipantExportRow {
  registrationCode: string;
  registrationDate: Date | null;
  registrationStatus: string;
  fullName: string;
  email: string;
  phone: string | null;
  nik: string | null;
  gender: string | null;
  birthPlace: string | null;
  birthDate: Date | null;
  lastEducation: string | null;
  major: string | null;
  educationInstitution: string | null;
  currentActivity: string | null;
  maritalStatus: string | null;
  parentPhone: string | null;
  parentRelationship: string | null;
  ktpProvinceName: string | null;
  ktpCityName: string | null;
  ktpAddress: string | null;
  domicileProvinceName: string | null;
  domicileCityName: string | null;
  domicileAddress: string | null;
  programName: string;
  programFormat: string | null;
  selectionStatus: string | null;
  placementStatus: string | null;
  companyName: string | null;
  placementDate: Date | null;
  paymentStatus: string | null;
  amountPaid: string | null;
}

const toExcelDate = (date: Date) => new Date(date.getTime() + JAKARTA_OFFSET_MS);

function createParticipantWorkbook(): { workbook: ExcelJS.Workbook; sheet: ExcelJS.Worksheet } {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Fitalenta";
  workbook.created = new Date();

  const sheet = workbook.addWorksheet(PARTICIPANT_SHEET_NAME, {
    views: [{ state: "frozen", ySplit: 1 }],
  });
  sheet.columns = PARTICIPANT_COLUMNS.map(({ key, header, width }) => ({ key, header, width }));

  const header = sheet.getRow(1);
  header.font = { bold: true, color: { argb: "FFFFFFFF" } };
  header.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
  header.height = 30;
  header.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: PARTICIPANT_HEADER_FILL },
    };
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });

  sheet.getColumn("registrationDate").numFmt = "yyyy-mm-dd hh:mm";
  sheet.getColumn("birthDate").numFmt = "yyyy-mm-dd";
  sheet.getColumn("placementDate").numFmt = "yyyy-mm-dd";
  sheet.getColumn("amountPaid").numFmt = "#,##0";
  sheet.getColumn("no").alignment = { horizontal: "center" };

  return { workbook, sheet };
}

export function buildParticipantWorkbook(rows: ParticipantExportRow[]): ExcelJS.Workbook {
  const { workbook, sheet } = createParticipantWorkbook();

  rows.forEach((row, index) => {
    sheet.addRow({
      no: index + 1,
      registrationCode: row.registrationCode,
      registrationDate: row.registrationDate ? toExcelDate(row.registrationDate) : null,
      registrationStatus: REGISTRATION_STATUS_LABELS[row.registrationStatus] ?? row.registrationStatus,
      fullName: row.fullName,
      email: row.email,
      phone: row.phone,
      nik: row.nik,
      gender: row.gender ? (GENDER_LABELS[row.gender] ?? row.gender) : null,
      birthPlace: row.birthPlace,
      birthDate: row.birthDate ? toExcelDate(row.birthDate) : null,
      lastEducation: row.lastEducation,
      major: row.major,
      educationInstitution: row.educationInstitution,
      currentActivity: row.currentActivity,
      maritalStatus: row.maritalStatus,
      parentPhone: row.parentPhone,
      parentRelationship: row.parentRelationship,
      ktpProvinceName: row.ktpProvinceName,
      ktpCityName: row.ktpCityName,
      ktpAddress: row.ktpAddress,
      domicileProvinceName: row.domicileProvinceName,
      domicileCityName: row.domicileCityName,
      domicileAddress: row.domicileAddress,
      programName: row.programName,
      programFormat: row.programFormat,
      selectionStatus: row.selectionStatus ? (SELECTION_STATUS_LABELS[row.selectionStatus] ?? row.selectionStatus) : null,
      placementStatus: row.placementStatus ? (PLACEMENT_STATUS_LABELS[row.placementStatus] ?? row.placementStatus) : null,
      companyName: row.companyName,
      placementDate: row.placementDate ? toExcelDate(row.placementDate) : null,
      paymentStatus: row.paymentStatus ? (PAYMENT_STATUS_LABELS_PARTICIPANT[row.paymentStatus] ?? row.paymentStatus) : null,
      amountPaid: row.amountPaid ? Number(row.amountPaid) : null,
    });
  });

  sheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: PARTICIPANT_COLUMNS.length },
  };

  return workbook;
}

const PARTICIPANT_INSTRUCTIONS: [string, string][] = [
  ["No", "Opsional, diabaikan saat impor."],
  ["Kode Registrasi", "Otomatis dibuat sistem. Diabaikan saat impor."],
  ["Tgl Registrasi", "Otomatis. Diabaikan saat impor."],
  ["Status Registrasi", "Otomatis. Diabaikan saat impor."],
  ["Nama Lengkap", "WAJIB. Nama lengkap peserta."],
  ["Email", "WAJIB. Email akun peserta yang terdaftar di sistem."],
  ["No. HP", "Opsional. Format: 081234567890 atau +628..."],
  ["NIK", "Opsional. 16 digit angka tanpa spasi."],
  ["Jenis Kelamin", "Opsional. Isi: L (Laki-laki) atau P (Perempuan)."],
  ["Tempat Lahir", "Opsional. Kota tempat lahir."],
  ["Tgl Lahir", "Opsional. Format: YYYY-MM-DD."],
  ["Pendidikan Terakhir", "Opsional. Contoh: SMA, D3, S1, S2."],
  ["Jurusan", "Opsional. Jurusan pendidikan terakhir."],
  ["Institusi Pendidikan", "Opsional. Nama sekolah/universitas."],
  ["Aktivitas Saat Ini", "Opsional. Contoh: Mahasiswa, Bekerja, dll."],
  ["Status Pernikahan", "Opsional. Contoh: Belum Menikah, Menikah."],
  ["No. HP Orang Tua", "Opsional. Format nomor HP."],
  ["Hub. Orang Tua", "Opsional. Contoh: Ayah, Ibu, Wali."],
  ["Provinsi KTP", "Opsional. Nama provinsi sesuai KTP."],
  ["Kota/Kab KTP", "Opsional. Nama kota/kabupaten sesuai KTP."],
  ["Alamat KTP", "Opsional. Alamat lengkap sesuai KTP."],
  ["Provinsi Domisili", "Opsional. Nama provinsi tempat tinggal saat ini."],
  ["Kota/Kab Domisili", "Opsional. Nama kota/kabupaten tempat tinggal."],
  ["Alamat Domisili", "Opsional. Alamat lengkap tempat tinggal saat ini."],
  ["Program", "WAJIB. Nama program persis seperti di sistem."],
  ["Format Program", "Otomatis diisi dari data program."],
  ["Status Seleksi", "Otomatis. Tidak diproses saat impor."],
  ["Status Penempatan", "Otomatis. Tidak diproses saat impor."],
  ["Nama Perusahaan", "Otomatis. Tidak diproses saat impor."],
  ["Tgl Penempatan", "Otomatis. Tidak diproses saat impor."],
  ["Status Pembayaran", "Otomatis. Tidak diproses saat impor."],
  ["Jumlah Dibayar", "Otomatis. Tidak diproses saat impor."],
];

export function buildParticipantTemplateWorkbook(): ExcelJS.Workbook {
  const { workbook, sheet } = createParticipantWorkbook();

  const genderList = '"L,P"';
  const genderColIndex = PARTICIPANT_COLUMNS.findIndex((c) => c.key === "gender") + 1;
  for (let row = 2; row <= 501; row++) {
    sheet.getCell(row, genderColIndex).dataValidation = {
      type: "list",
      allowBlank: true,
      formulae: [genderList],
    };
  }

  // Add sample row
  sheet.addRow({
    no: 1,
    fullName: "Contoh Nama Peserta",
    email: "peserta@email.com",
    phone: "081234567890",
    nik: "3374011234560001",
    gender: "L",
    birthPlace: "Jakarta",
    birthDate: new Date("2000-01-15"),
    lastEducation: "S1",
    major: "Teknik Informatika",
    educationInstitution: "Universitas Contoh",
    currentActivity: "Fresh Graduate",
    maritalStatus: "Belum Menikah",
    parentPhone: "081298765432",
    parentRelationship: "Ayah",
    ktpProvinceName: "Jawa Tengah",
    ktpCityName: "Kota Semarang",
    ktpAddress: "Jl. Contoh No. 1, RT 01/RW 02, Kel. Contoh, Kec. Contoh",
    domicileProvinceName: "DKI Jakarta",
    domicileCityName: "Jakarta Selatan",
    domicileAddress: "Jl. Domisili No. 5, RT 03/RW 04, Kel. Contoh, Kec. Contoh",
    programName: "Nama Program (sesuai sistem)",
  });

  const guide = workbook.addWorksheet(PARTICIPANT_INSTRUCTION_SHEET_NAME);
  guide.columns = [
    { header: "Kolom", key: "column", width: 25 },
    { header: "Keterangan", key: "note", width: 80 },
  ];
  const guideHeader = guide.getRow(1);
  guideHeader.font = { bold: true };
  guideHeader.eachCell((cell) => {
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: PARTICIPANT_HEADER_FILL } };
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
  });

  PARTICIPANT_INSTRUCTIONS.forEach(([column, note]) => guide.addRow({ column, note }));
  guide.addRow({});
  guide.addRow({
    column: "CATATAN",
    note: "Kolom yang tidak diisi akan diabaikan. Pastikan kolom Email dan Program sudah sesuai dengan data yang ada di sistem. Maksimal 500 baris per impor.",
  });

  return workbook;
}
