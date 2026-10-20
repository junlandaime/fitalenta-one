import "dotenv/config";
import bcrypt from "bcryptjs";
import prisma from "../config/prisma";

/**
 * Script untuk memverifikasi kecocokan password peserta (User dengan role: 'user')
 * Dapat digunakan di lokal maupun saat pengujian pasca-migrasi di server production.
 *
 * Contoh penggunaan:
 * 1. Cek sampel akun acak (default 5 akun):
 *    npm run verify:passwords
 *
 * 2. Cek email spesifik:
 *    npx tsx src/scripts/verify-participant-passwords.ts user@example.com
 */
async function verifyParticipantPasswords() {
  const targetPassword = process.env.DEFAULT_PARTICIPANT_PASSWORD || "Fitalenta2026!";
  const targetEmail = process.argv[2]?.trim().toLowerCase();

  console.log("=================================================");
  console.log("    UJI VERIFIKASI LOGIN PASSWORD PESERTA        ");
  console.log("=================================================");
  console.log(`Password yang diuji : ${targetPassword}`);

  let usersToCheck;

  if (targetEmail) {
    console.log(`Mode                : Spesifik Email (${targetEmail})`);
    const user = await prisma.user.findUnique({
      where: { email: targetEmail },
      select: { id: true, email: true, name: true, role: true, password: true },
    });

    if (!user) {
      console.error(`❌ Akun dengan email "${targetEmail}" tidak ditemukan di database.`);
      return;
    }
    usersToCheck = [user];
  } else {
    console.log(`Mode                : Sampel Akun Peserta (5 Akun Acak)`);
    usersToCheck = await prisma.user.findMany({
      where: { role: "user" },
      take: 5,
      select: { id: true, email: true, name: true, role: true, password: true },
      orderBy: { id: "asc" },
    });
  }

  if (usersToCheck.length === 0) {
    console.log("Tidak ada user dengan role 'user' yang ditemukan di database.");
    return;
  }

  console.log("-------------------------------------------------");
  let passCount = 0;
  let failCount = 0;

  for (const user of usersToCheck) {
    const isMatch = await bcrypt.compare(targetPassword, user.password);

    if (isMatch) {
      passCount++;
      console.log(`[✔ VALID] ${user.name} (${user.email}) -> Password Cocok!`);
    } else {
      failCount++;
      console.log(`[❌ GAGAL] ${user.name} (${user.email}) -> Password Tidak Cocok.`);
    }
  }

  console.log("-------------------------------------------------");
  console.log(`Hasil: ${passCount} Valid, ${failCount} Gagal.`);
  if (failCount === 0) {
    console.log("✔ SELURUH AKUN BERHASIL DIKONFIRMASI DAPAT LOGIN DENGAN PASSWORD DEFAULT.");
  } else {
    console.warn("⚠ Ditemukan akun yang tidak cocok. Jalankan 'npm run reset:passwords' untuk menyeragamkan ulang.");
  }
  console.log("=================================================");
}

verifyParticipantPasswords()
  .catch((err) => {
    console.error("Terjadi error saat verifikasi:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
