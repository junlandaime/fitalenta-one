import "dotenv/config";
import bcrypt from "bcryptjs";
import prisma from "../config/prisma";
import { BCRYPT_ROUNDS } from "../config/admin.config";

/**
 * Script untuk mengecek status akun dan/atau mereset password akun user tertentu secara langsung.
 *
 * Contoh penggunaan:
 * 1. Cek info akun saja:
 *    npx tsx src/scripts/set-user-password.ts user@example.com
 *
 * 2. Set/reset password baru:
 *    npx tsx src/scripts/set-user-password.ts user@example.com PasswordBaru123!
 */
async function main() {
  const emailInput = process.argv[2]?.trim().toLowerCase();
  const newPassword = process.argv[3];

  console.log("=================================================");
  console.log("       FITALENTA USER ACCOUNT & PASSWORD TOOL    ");
  console.log("=================================================");

  if (!emailInput) {
    console.error("Gunakan perintah berikut:");
    console.error("  npx tsx src/scripts/set-user-password.ts <email> [password_baru]");
    console.error("Contoh:");
    console.error("  npx tsx src/scripts/set-user-password.ts user@example.com Sandi123456");
    process.exit(1);
  }

  console.log(`Email Target : ${emailInput}`);

  const user = await prisma.user.findUnique({
    where: { email: emailInput },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      role: true,
      emailVerifiedAt: true,
      createdAt: true,
    },
  });

  if (!user) {
    console.error(`\n❌ Akun dengan email "${emailInput}" TIDAK DITEMUKAN di database.`);
    process.exit(1);
  }

  console.log(`\nInformasi Akun:`);
  console.log(`- ID               : ${user.id}`);
  console.log(`- Nama             : ${user.name}`);
  console.log(`- Role             : ${user.role}`);
  console.log(`- No. Telp         : ${user.phone || "-"}`);
  console.log(`- Terdaftar pada   : ${user.createdAt.toISOString()}`);
  console.log(`- Status Verifikasi: ${user.emailVerifiedAt ? `✔ Terverifikasi (${user.emailVerifiedAt.toISOString()})` : "❌ Belum Terverifikasi"}`);

  if (newPassword) {
    if (newPassword.length < 6) {
      console.error("\n❌ Password minimal 6 karakter.");
      process.exit(1);
    }

    console.log(`\nMemperbarui password untuk ${emailInput}...`);
    const hashedPassword = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        emailVerifiedAt: user.emailVerifiedAt ?? new Date(),
      },
    });

    console.log(`✔ BERHASIL: Password akun ${emailInput} telah diperbarui!`);
    console.log(`✔ Akun telah dipastikan terverifikasi aktif.`);
    console.log(`✔ Pengguna kini dapat langsung login di website dengan password baru tersebut.`);
  } else {
    console.log(`\nTips: Untuk mengubah password akun ini, tambahkan password di parameter akhir:`);
    console.log(`  npx tsx src/scripts/set-user-password.ts ${emailInput} PasswordBaru123!`);
  }

  console.log("=================================================");
}

main()
  .catch((err) => {
    console.error("Terjadi error:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
