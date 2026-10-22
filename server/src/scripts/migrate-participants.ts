import "dotenv/config";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import prisma from "../config/prisma";
import { Gender, PaymentMethod, PaymentStatus, Prisma, RegistrationStatus } from "../../generated/prisma/client";

export interface LegacyParticipantPayment {
  invoice_number: string;
  amount: number | string;
  amount_paid?: number | string | null;
  status?: string | null;
  payment_method?: string | null;
  due_date?: string | null;
  proof_image?: string | null;
  receipt_number?: string | null;
  notes?: string | null;
  is_manual_invoice?: boolean | null;
  installment_amounts?: any;
  current_installment_number?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
}

/**
 * Format data input peserta lama (sesuai export JSON dari database MySQL registrasi.fitalenta.co.id / ojetu)
 */
export interface LegacyParticipantRecord {
  // Akun & Kontak
  name: string;
  email: string;
  phone?: string | null;
  email_verified?: boolean | null;
  account_created_at?: string | null;
  nik?: string | null;
  gender?: "L" | "P" | "laki-laki" | "perempuan" | null;

  // Data Pribadi
  birth_place?: string | null;
  birth_date?: string | null;
  address?: string | null;

  // Pendidikan & Aktivitas
  last_education?: string | null;
  major?: string | null;
  education_institution?: string | null;
  current_activity?: string | null;
  marital_status?: string | null;

  // Orang Tua / Wali
  parent_phone?: string | null;
  parent_relationship?: string | null;

  // Wilayah Domisili / KTP
  ktp_province_code?: string | null;
  ktp_province_name?: string | null;
  ktp_city_code?: string | null;
  ktp_city_name?: string | null;
  ktp_address?: string | null;
  domicile_province_code?: string | null;
  domicile_province_name?: string | null;
  domicile_city_code?: string | null;
  domicile_city_name?: string | null;
  domicile_address?: string | null;

  // Berkas / File
  photo_path?: string | null;
  n4_certificate_path?: string | null;
  ssw_certificate_path?: string | null;

  // Program & Status Pendaftaran
  program_id?: number | null;
  program_name?: string | null;
  program_format?: string | null;
  registration_code?: string | null;
  registration_status?: "menunggu" | "lolos" | "tidak_lolos" | string | null;
  created_at?: string | null;

  // Pembayaran / Tagihan
  payment?: LegacyParticipantPayment | null;
}

function normalizeGender(raw?: string | null): Gender | null {
  if (!raw) return null;
  const lower = raw.trim().toLowerCase();
  if (lower === "l" || lower.startsWith("laki") || lower === "male") return Gender.L;
  if (lower === "p" || lower.startsWith("perem") || lower === "female") return Gender.P;
  return null;
}

function normalizeStatus(raw?: string | null): RegistrationStatus {
  if (!raw) return RegistrationStatus.menunggu;
  const lower = raw.trim().toLowerCase();
  if (lower === "lolos" || lower === "passed" || lower === "diterima") return RegistrationStatus.lolos;
  if (lower === "tidak_lolos" || lower === "gagal" || lower === "rejected") return RegistrationStatus.tidak_lolos;
  return RegistrationStatus.menunggu;
}

function generateRegCode(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `REG-${timestamp}-${random}`;
}

/**
 * Main migration function
 */

function parseSqlDump(sql: string): LegacyParticipantRecord[] {
  function parseTable(tableName: string) {
    const regex = new RegExp("INSERT INTO `" + tableName + "`\\s*\\(([^)]+)\\)\\s*VALUES", "i");
    const m = regex.exec(sql);
    if (!m) return [];
    const cols = m[1].split(",").map((c) => c.trim().replace(/^`|`$/g, ""));

    const start = m.index + m[0].length;
    let end = sql.indexOf(";\\n", start);
    if (end === -1) end = sql.indexOf(";", start);
    const valStr = sql.slice(start, end);

    const rawTuples: string[] = [];
    let inStr = false;
    let strChar = "";
    let parenDepth = 0;
    let cur = "";

    for (let i = 0; i < valStr.length; i++) {
      const ch = valStr[i];
      if (inStr) {
        cur += ch;
        if (ch === strChar) {
          if (i > 0 && valStr[i - 1] === "\\") {
            let bsCount = 0;
            let k = i - 1;
            while (k >= 0 && valStr[k] === "\\") {
              bsCount++;
              k--;
            }
            if (bsCount % 2 === 0) inStr = false;
          } else {
            inStr = false;
          }
        }
      } else {
        if (ch === "'" || ch === '"') {
          inStr = true;
          strChar = ch;
          cur += ch;
        } else if (ch === "(") {
          parenDepth++;
          if (parenDepth === 1) cur = "";
          else cur += ch;
        } else if (ch === ")") {
          parenDepth--;
          if (parenDepth === 0) {
            rawTuples.push(cur);
            cur = "";
          } else {
            cur += ch;
          }
        } else {
          if (parenDepth > 0) cur += ch;
        }
      }
    }

    const rows: Record<string, string | null>[] = [];
    for (const tup of rawTuples) {
      const items: string[] = [];
      let curItem = "";
      let inS = false;
      let sC = "";
      for (let j = 0; j < tup.length; j++) {
        const c = tup[j];
        if (inS) {
          curItem += c;
          if (c === sC) {
            if (j > 0 && tup[j - 1] === "\\") {
              let bs = 0;
              let k = j - 1;
              while (k >= 0 && tup[k] === "\\") {
                bs++;
                k--;
              }
              if (bs % 2 === 0) inS = false;
            } else {
              inS = false;
            }
          }
        } else {
          if (c === "'" || c === '"') {
            inS = true;
            sC = c;
            curItem += c;
          } else if (c === ",") {
            items.push(curItem.trim());
            curItem = "";
          } else {
            curItem += c;
          }
        }
      }
      items.push(curItem.trim());

      const cleaned: (string | null)[] = [];
      for (const it of items) {
        if (!it || it === "NULL") {
          cleaned.push(null);
        } else if ((it.startsWith("'") && it.endsWith("'")) || (it.startsWith('"') && it.endsWith('"'))) {
          cleaned.push(
            it
              .slice(1, -1)
              .replace(/\\'/g, "'")
              .replace(/\\"/g, '"')
              .replace(/\\\\/g, "\\")
          );
        } else {
          cleaned.push(it);
        }
      }

      if (cleaned.length === cols.length) {
        const row: Record<string, string | null> = {};
        for (let idx = 0; idx < cols.length; idx++) {
          row[cols[idx]] = cleaned[idx];
        }
        rows.push(row);
      }
    }
    return rows;
  }

  const users = parseTable("users");
  const regs = parseTable("registrations");
  const programs = parseTable("programs");
  const payments = parseTable("payments");

  const progMap = new Map(programs.map((p) => [p.id, p]));
  const pmtMap = new Map(payments.map((p) => [p.registration_id, p]));

  const participantUsers = users.filter((u) => !u.role || u.role === "user" || u.role === "participant");

  const records: LegacyParticipantRecord[] = [];
  for (const u of participantUsers) {
    const uid = u.id;
    const uRegs = regs.filter((r) => r.user_id === uid);
    const rawName = u.full_name || u.name || "";
    const name = rawName.replace(/[\u2018\u2019]/g, "'");

    if (uRegs.length === 0) {
      records.push({
        name,
        email: u.email!,
        phone: u.phone,
        email_verified: u.is_verified === "1",
        account_created_at: u.created_at,
        program_name: null,
        registration_code: null,
      });
    } else {
      for (const r of uRegs) {
        const prog = progMap.get(r.program_id);
        const pmt = pmtMap.get(r.id);

        let pmtData: LegacyParticipantPayment | null = null;
        if (pmt) {
          let instAmounts = null;
          if (pmt.installment_amounts) {
            try {
              instAmounts = JSON.parse(pmt.installment_amounts);
            } catch {
              instAmounts = null;
            }
          }
          pmtData = {
            invoice_number: pmt.invoice_number!,
            amount: pmt.amount || "0",
            amount_paid: pmt.amount_paid || "0",
            status: pmt.status || "pending",
            payment_method: pmt.payment_method || "transfer",
            due_date: pmt.due_date,
            proof_image: pmt.proof_image,
            receipt_number: pmt.receipt_number,
            notes: pmt.notes,
            is_manual_invoice: pmt.is_manual_invoice === "1",
            installment_amounts: instAmounts,
            current_installment_number: pmt.current_installment_number ? parseInt(pmt.current_installment_number, 10) : 0,
            created_at: pmt.created_at,
            updated_at: pmt.updated_at,
          };
        }

        records.push({
          name,
          email: u.email!,
          phone: u.phone,
          email_verified: u.is_verified === "1",
          account_created_at: u.created_at,
          nik: r.nik,
          gender: (r.gender as any) || null,
          birth_place: r.birth_place,
          birth_date: r.birth_date,
          address: r.ktp_address || u.address,
          last_education: r.last_education,
          major: r.major,
          education_institution: r.education_institution,
          current_activity: r.current_activity,
          marital_status: r.marital_status,
          parent_phone: r.parent_phone,
          parent_relationship: r.parent_relationship,
          ktp_province_code: r.ktp_province_code,
          ktp_province_name: r.ktp_province_name,
          ktp_city_code: r.ktp_city_code,
          ktp_city_name: r.ktp_city_name,
          ktp_address: r.ktp_address,
          domicile_province_code: r.domicile_province_code,
          domicile_province_name: r.domicile_province_name,
          domicile_city_code: r.domicile_city_code,
          domicile_city_name: r.domicile_city_name,
          domicile_address: r.domicile_address,
          photo_path: r.photo_path,
          n4_certificate_path: r.n4_certificate_path,
          ssw_certificate_path: r.ssw_certificate_path,
          program_name: prog ? prog.name : null,
          program_format: prog ? prog.program_format : null,
          registration_code: r.registration_code,
          registration_status: r.registration_status,
          created_at: r.registration_date || r.created_at,
          payment: pmtData,
        });
      }
    }
  }

  return records;
}

export async function migrateParticipants(filePath?: string) {
  const defaultPassword = process.env.DEFAULT_PARTICIPANT_PASSWORD || "Fitalenta2026!";
  const candidatePaths = [
    filePath,
    path.join(process.cwd(), "prisma", "data", "legacy-participants.json"),
    path.join(process.cwd(), "legacy-participants.json"),
    path.join(process.cwd(), "..", "legacy-participants.json"),
    path.join(process.cwd(), "..", "..", "legacy-participants.json"),
    path.join(process.cwd(), "data", "legacy-participants.json"),
  ].filter(Boolean) as string[];

  const targetFile = candidatePaths.find((p) => fs.existsSync(p)) || candidatePaths[0];

  console.log("=================================================");
  console.log("       MIGRASI DATA PESERTA OJETU / FITALENTA    ");
  console.log("=================================================");

  if (!fs.existsSync(targetFile)) {
    console.warn(`File sumber tidak ditemukan: ${targetFile}`);
    console.log("Silakan tempatkan file JSON data peserta pada path tersebut.");
    return;
  }

  let records: LegacyParticipantRecord[] = [];
  if (targetFile.toLowerCase().endsWith(".sql")) {
    console.log(`Membaca dan mem-parsing dump SQL: ${targetFile}`);
    const sqlContent = fs.readFileSync(targetFile, "utf-8");
    records = parseSqlDump(sqlContent);
  } else {
    console.log(`Membaca file JSON: ${targetFile}`);
    const rawData = fs.readFileSync(targetFile, "utf-8");
    records = JSON.parse(rawData);
  }

  console.log(`Jumlah baris data ditemukan : ${records.length}`);
  console.log(`Password seragam peserta    : ${defaultPassword}`);

  const hashedPassword = await bcrypt.hash(defaultPassword, 10);

  // Ambil semua program di database untuk pemetaan nama
  const existingPrograms = await prisma.program.findMany({
    select: { id: true, name: true, programFormat: true },
  });

  let usersCreated = 0;
  let usersUpdated = 0;
  let registrationsCreated = 0;
  let registrationsUpdated = 0;
  let paymentsCreated = 0;
  let paymentsUpdated = 0;
  let accountsOnly = 0;
  let skippedCount = 0;

  for (const record of records) {
    if (!record.email || !record.name) {
      console.warn(`[SKIP] Baris tidak memiliki nama atau email valid.`);
      skippedCount++;
      continue;
    }

    const email = record.email.trim().toLowerCase();

    try {
      // 1. Tentukan tanggal & status verifikasi
      const birthDate = record.birth_date ? new Date(record.birth_date) : null;
      const accountCreatedAt = record.account_created_at ? new Date(record.account_created_at) : new Date();
      const emailVerifiedAt = record.email_verified === false
        ? null
        : (record.account_created_at ? new Date(record.account_created_at) : new Date());

      // 2. Upsert Akun User
      let user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        user = await prisma.user.create({
          data: {
            email,
            name: record.name.trim(),
            password: hashedPassword,
            phone: record.phone?.trim() ?? null,
            address: record.address ?? record.domicile_address ?? null,
            birthPlace: record.birth_place ?? null,
            birthDate: isNaN(birthDate?.getTime() ?? NaN) ? null : birthDate,
            role: "user",
            emailVerifiedAt: emailVerifiedAt,
            createdAt: isNaN(accountCreatedAt.getTime()) ? new Date() : accountCreatedAt,
          },
        });
        usersCreated++;
      } else {
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            name: record.name.trim(),
            phone: record.phone?.trim() ?? user.phone,
            address: record.address ?? record.domicile_address ?? user.address,
            birthPlace: record.birth_place ?? user.birthPlace,
            birthDate: isNaN(birthDate?.getTime() ?? NaN) ? user.birthDate : birthDate,
            password: hashedPassword, // Seragamkan password juga
            emailVerifiedAt: user.emailVerifiedAt ?? emailVerifiedAt,
          },
        });
        usersUpdated++;
      }

      // 3. Hubungkan ke Program jika ada data pendaftaran
      const hasProgram = Boolean(record.program_name || record.program_id || record.registration_code);

      if (!hasProgram) {
        accountsOnly++;
        continue;
      }

      // Cari ID Program yang cocok
      let programId = record.program_id;
      if (!programId && record.program_name) {
        const pName = record.program_name.trim().toLowerCase();
        const found = existingPrograms.find(
          (p) => p.name.trim().toLowerCase() === pName || p.name.toLowerCase().includes(pName) || pName.includes(p.name.toLowerCase())
        );
        if (found) programId = found.id;
      }

      // Jika programId masih belum ditemukan, gunakan program pertama sebagai fallback
      if (!programId && existingPrograms.length > 0) {
        programId = existingPrograms[0].id;
      }

      if (programId) {
        const regStatus = normalizeStatus(record.registration_status);
        const regDate = record.created_at ? new Date(record.created_at) : new Date();

        const existingReg = await prisma.registration.findUnique({
          where: {
            unique_user_program: {
              userId: user.id,
              programId: programId,
            },
          },
        });

        const regCode = record.registration_code?.trim() || existingReg?.registrationCode || generateRegCode();

        let regId: number;
        if (!existingReg) {
          const newReg = await prisma.registration.create({
            data: {
              userId: user.id,
              programId: programId,
              registrationCode: regCode,
              registrationStatus: regStatus,
              nik: record.nik ?? null,
              gender: normalizeGender(record.gender),
              birthPlace: record.birth_place ?? null,
              birthDate: isNaN(birthDate?.getTime() ?? NaN) ? null : birthDate,
              lastEducation: record.last_education ?? null,
              major: record.major ?? null,
              educationInstitution: record.education_institution ?? null,
              currentActivity: record.current_activity ?? null,
              maritalStatus: record.marital_status ?? null,
              parentPhone: record.parent_phone ?? null,
              parentRelationship: record.parent_relationship ?? null,
              ktpProvinceCode: record.ktp_province_code ?? null,
              ktpProvinceName: record.ktp_province_name ?? null,
              ktpCityCode: record.ktp_city_code ?? null,
              ktpCityName: record.ktp_city_name ?? null,
              ktpAddress: record.ktp_address ?? null,
              domicileProvinceCode: record.domicile_province_code ?? null,
              domicileProvinceName: record.domicile_province_name ?? null,
              domicileCityCode: record.domicile_city_code ?? null,
              domicileCityName: record.domicile_city_name ?? null,
              domicileAddress: record.domicile_address ?? null,
              photoPath: record.photo_path ?? null,
              n4CertificatePath: record.n4_certificate_path ?? null,
              sswCertificatePath: record.ssw_certificate_path ?? null,
              registrationDate: isNaN(regDate.getTime()) ? new Date() : regDate,
            },
          });
          regId = newReg.id;

          // Inisialisasi Selection Status
          await prisma.selectionStatus.create({
            data: {
              registrationId: newReg.id,
              status: regStatus,
              notes: "Migrasi otomatis dari sistem legacy ojetu",
            },
          });

          // Inisialisasi Placement Status
          await prisma.placementStatus.create({
            data: {
              registrationId: newReg.id,
              status: regStatus === RegistrationStatus.lolos ? "lolos" : "proses",
              notes: "Diinisialisasi dari migrasi legacy ojetu",
            },
          });

          registrationsCreated++;
        } else {
          // Update pendaftaran yang sudah ada
          regId = existingReg.id;
          await prisma.registration.update({
            where: { id: existingReg.id },
            data: {
              registrationStatus: regStatus,
              nik: record.nik ?? existingReg.nik,
              gender: normalizeGender(record.gender) ?? existingReg.gender,
              photoPath: record.photo_path ?? existingReg.photoPath,
              n4CertificatePath: record.n4_certificate_path ?? existingReg.n4CertificatePath,
              sswCertificatePath: record.ssw_certificate_path ?? existingReg.sswCertificatePath,
            },
          });

          // Pastikan Selection Status ada jika sebelumnya belum terbuat
          const existingSelection = await prisma.selectionStatus.findFirst({
            where: { registrationId: regId },
          });
          if (!existingSelection) {
            await prisma.selectionStatus.create({
              data: {
                registrationId: regId,
                status: regStatus,
                notes: "Migrasi otomatis dari sistem legacy ojetu",
              },
            });
          }

          // Pastikan Placement Status ada jika sebelumnya belum terbuat
          const existingPlacement = await prisma.placementStatus.findFirst({
            where: { registrationId: regId },
          });
          if (!existingPlacement) {
            await prisma.placementStatus.create({
              data: {
                registrationId: regId,
                status: regStatus === RegistrationStatus.lolos ? "lolos" : "proses",
                notes: "Diinisialisasi dari migrasi legacy ojetu",
              },
            });
          }

          registrationsUpdated++;
        }

        // 4. Migrasi / Hubungkan Pembayaran jika ada data payment
        if (record.payment && record.payment.invoice_number) {
          const pmt = record.payment;
          const rawStatus = (pmt.status || "pending").trim().toLowerCase();
          const validStatuses = Object.values(PaymentStatus) as string[];
          const pmtStatus = validStatuses.includes(rawStatus)
            ? (rawStatus as PaymentStatus)
            : PaymentStatus.pending;

          const pmtDueDate = pmt.due_date ? new Date(pmt.due_date) : null;
          const pmtCreatedAt = pmt.created_at ? new Date(pmt.created_at) : new Date();

          const paymentData = {
            registrationId: regId,
            invoiceNumber: pmt.invoice_number.trim(),
            amount: new Prisma.Decimal(pmt.amount || 0),
            amountPaid: new Prisma.Decimal(pmt.amount_paid || 0),
            paymentMethod: (pmt.payment_method === "cash" || pmt.payment_method === "credit_card")
              ? (pmt.payment_method as PaymentMethod)
              : PaymentMethod.transfer,
            status: pmtStatus,
            dueDate: isNaN(pmtDueDate?.getTime() ?? NaN) ? null : pmtDueDate,
            proofImage: pmt.proof_image || null,
            receiptNumber: pmt.receipt_number || null,
            notes: pmt.notes || null,
            isManualInvoice: Boolean(pmt.is_manual_invoice),
            installmentAmounts: pmt.installment_amounts ?? undefined,
            currentInstallmentNumber: Number(pmt.current_installment_number || 0),
            createdAt: isNaN(pmtCreatedAt.getTime()) ? new Date() : pmtCreatedAt,
          };

          const existingPayment = await prisma.payment.findUnique({
            where: { invoiceNumber: pmt.invoice_number.trim() },
          });

          if (!existingPayment) {
            await prisma.payment.create({ data: paymentData });
            paymentsCreated++;
          } else {
            await prisma.payment.update({
              where: { invoiceNumber: pmt.invoice_number.trim() },
              data: {
                registrationId: regId,
                amount: paymentData.amount,
                amountPaid: paymentData.amountPaid,
                status: paymentData.status,
                dueDate: paymentData.dueDate,
                proofImage: paymentData.proofImage,
                receiptNumber: paymentData.receiptNumber,
                notes: paymentData.notes,
                isManualInvoice: paymentData.isManualInvoice,
                installmentAmounts: paymentData.installmentAmounts,
                currentInstallmentNumber: paymentData.currentInstallmentNumber,
              },
            });
            paymentsUpdated++;
          }
        }
      }
    } catch (err) {
      console.error(`Gagal memproses peserta ${email}:`, err);
      skippedCount++;
    }
  }

  console.log("-------------------------------------------------");
  console.log(`✔ Akun peserta baru dibuat       : ${usersCreated}`);
  console.log(`✔ Akun peserta diperbarui        : ${usersUpdated}`);
  console.log(`✔ Pendaftaran program baru dibuat: ${registrationsCreated}`);
  console.log(`✔ Pendaftaran program diperbarui : ${registrationsUpdated}`);
  console.log(`✔ Tagihan pembayaran baru dibuat : ${paymentsCreated}`);
  console.log(`✔ Tagihan pembayaran diperbarui  : ${paymentsUpdated}`);
  console.log(`✔ Akun user tanpa program        : ${accountsOnly}`);
  console.log(`⚠ Data dilewati/error            : ${skippedCount}`);
  console.log(`✔ Semua peserta diseragamkan password-nya ke: ${defaultPassword}`);
  console.log("=================================================");
}

if (process.argv[1] && process.argv[1].includes("migrate-participants")) {
  const filePathArg = process.argv[2];
  migrateParticipants(filePathArg)
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
      process.exit(0);
    });
}
