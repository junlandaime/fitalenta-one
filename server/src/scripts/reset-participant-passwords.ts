import "dotenv/config";
import bcrypt from "bcryptjs";
import prisma from "../config/prisma";

/**
 * Script untuk mereset seluruh password peserta (User dengan role: 'user')
 * menjadi satu password seragam setelah proses migrasi data dari sistem lama.
 * 
 * Password default dapat ditentukan melalui variabel environment:
 * DEFAULT_PARTICIPANT_PASSWORD (default fallback: "Fitalenta2026!")
 */
async function resetAllParticipantPasswords() {
  const defaultPassword = process.env.DEFAULT_PARTICIPANT_PASSWORD || "Fitalenta2026!";
  console.log("=================================================");
  console.log("  RESET PASSWORD PESERTA (BULK POST-MIGRATION)   ");
  console.log("=================================================");
  console.log(`Password seragam baru: ${defaultPassword}`);

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(defaultPassword, saltRounds);

  // Cari semua user dengan role "user"
  const participantCount = await prisma.user.count({
    where: { role: "user" },
  });

  if (participantCount === 0) {
    console.log("Tidak ada user dengan role 'user' yang ditemukan.");
    return;
  }

  console.log(`Ditemukan ${participantCount} akun peserta.`);
  console.log("Memperbarui password...");

  const updateResult = await prisma.user.updateMany({
    where: { role: "user" },
    data: {
      password: hashedPassword,
    },
  });

  console.log("-------------------------------------------------");
  console.log(`✔ Berhasil memperbarui ${updateResult.count} akun peserta.`);
  console.log(`✔ Semua peserta kini dapat login menggunakan password: ${defaultPassword}`);
  console.log("=================================================");
}

resetAllParticipantPasswords()
  .catch((error) => {
    console.error("Gagal menjalankan reset password peserta:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
