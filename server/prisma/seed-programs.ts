import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client";

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST || "127.0.0.1",
  port: process.env.DATABASE_PORT ? Number(process.env.DATABASE_PORT) : 3306,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  connectionLimit: 5,
});
const prisma = new PrismaClient({ adapter });

const categoryNames = ["Pelatihan", "Work", "Korea"];

const programs = [
  {
    categoryName: "Pelatihan",
    programFormat: "Reguler",
    name: "Program Reguler",
    description:
      "program pelatihan bagi yang tertarik kerja di jepang dengan bidang pekerjaan (kaigo, pengelolaan makanan, pertanian, perhotelan, driver)\n\nCatatan :\nBiaya Registrasi : Rp 300.000\nDp : Rp 5.000.000",
    requirements:
      "- Ijazah Minimal SMA/Sederajat\n- Sehat Jasmani & Rohani\n- Usia Maksimal 30 Tahun\n- Siap Belajar Diklat",
    schedule: "Senin-Jumat",
    duration: "6 bulan",
    capacity: 20,
    currentParticipants: 1,
    status: "active" as const,
    isRunning: true,
    contactInfo:
      "Email: info@fitalenta.co.id\nTelp: 0811 1011 9273\nAlamat: Gedung Science Techno Park ITB. Jl. Ganesha No.15E, Lb. Siliwangi, Kec. Coblong, Bandung 40132",
    registrationDeadline: null,
    startDate: null,
    endDate: null,
    location: "Bandung (offline)",
    trainingCost: 9500000.0,
    trainingFeeDetails:
      "Biaya pelatihan.\nModul, buku pelajaran bahasa Jepang, dan materi pendukung lainnya.\nAkses penuh ke fasilitas kelas dan laboratorium bahasa.\nPendampingan dan bimbingan belajar intensif.\npelatihan budaya kerja Jepang.\nPelatihan SSW sesuai bidang bagi jalur Tokutei Ginou.",
    departureCost: 30000000.0,
    departureFeeDetails:
      "Tiket pesawat ke Jepang (sekali jalan).\nPengurusan Visa Kerja & dokumen keberangkatan.\nAsuransi perjalanan dan asuransi kesehatan awal di Jepang.\nBiaya penempatan kerja di Jepang (termasuk administrasi penyaluran).\nPendampingan proses keberangkatan hingga penyaluran ke perusahaan di Jepang.",
    installmentPlan: "4_installments",
    downPayment: 5000000.0,
    jobMatchingCost: 0.0,
    bridgeFund: "Tersedia ",
    timelineText:
      "Bulan 1: Pelatihan Dasar Bahasa Jepang (Hiragana & Katakana)\nBulan 2: Pengembangan Kosakata dan Tata Bahasa\nBulan 3: Budaya Jepang dan Etika Kerja\nBulan 4: Persiapan Akhir dan Evaluasi",
    requirementsText:
      "Minimal 18 tahun dan Maksimal 30 Tahun.\nMinimal Ijazah SMA/SMK Sederajat.\nSehat Jasmani & Rohani (Wajib dibuktikan dengan Surat Keterangan Sehat dari fasilitas kesehatan).\nTidak memiliki catatan kriminal (Wajib melampirkan Surat Keterangan Catatan Kepolisian/SKCK).\nBersedia mengikuti seluruh rangkaian pelatihan dan aturan asrama hingga selesai.",
    sortOrder: 1,
  },
  {
    categoryName: "Pelatihan",
    programFormat: "Asrama",
    name: "Program Asrama",
    description:
      "program pelatihan sekaligus karantina kerja berasrama bagi yang tertarik kerja di jepang dengan bidang pekerjaan (kaigo, pengelolaan makanan, pertanian, perhotelan, driver)\n\n\nCatatan : \nBiaya Registrasi : Rp 300.000\nDP : Rp. 3.000.000",
    requirements:
      "- Ijazah Minimal SMA/Sederajat\n- Sehat Jasmani & Rohani\n- Usia Maksimal 30 Tahun\n- Siap Belajar Diklat",
    schedule: "Senin-Jumat",
    duration: "6 bulan",
    capacity: 20,
    currentParticipants: 11,
    status: "active" as const,
    isRunning: true,
    contactInfo:
      "Email: info@fitalenta.co.id\nTelp: 0811 1011 9273\nAlamat: Gedung Science Techno Park ITB. Jl. Ganesha No.15E, Lb. Siliwangi, Kec. Coblong, Bandung 40132",
    registrationDeadline: new Date("2024-12-30T17:00:00.000Z"),
    startDate: new Date("2024-01-31T17:00:00.000Z"),
    endDate: new Date("2024-04-29T17:00:00.000Z"),
    location: "Bandung dan Cikarang",
    trainingCost: 15000000.0,
    trainingFeeDetails:
      "Biaya pelatihan\nModul, buku pelajaran bahasa Jepang, dan materi pendukung lainnya.\nAkses penuh ke fasilitas kelas.\nFasilitas asrama.\nPendampingan dan bimbingan belajar intensif.\nPelatihan budaya kerja Jepang.\nPelatihan SSW sesuai bidang bagi jalut Tokutei Ginou",
    departureCost: 30000000.0,
    departureFeeDetails:
      "Tiket pesawat ke Jepang (sekali jalan).\nPengurusan Visa Kerja & dokumen keberangkatan.\nAsuransi perjalanan dan asuransi kesehatan awal di Jepang.\nBiaya penempatan kerja di Jepang (termasuk administrasi penyaluran).\nPendampingan proses keberangkatan hingga penyaluran ke perusahaan di Jepang.",
    installmentPlan: "5_installments",
    downPayment: 0.0,
    jobMatchingCost: 0.0,
    bridgeFund: "Tersedia ",
    timelineText:
      "Bulan 1: Pelatihan Dasar Bahasa Jepang (Hiragana & Katakana)\nBulan 2: Pengembangan Kosakata dan Tata Bahasa\nBulan 3: Budaya Jepang dan Etika Kerja\nBulan 4: Persiapan Akhir dan Evaluasi",
    requirementsText:
      "Minimal 18 tahun dan Maksimal 30 Tahun.\nMinimal Ijazah SMA/SMK Sederajat.\nSehat Jasmani & Rohani (Wajib dibuktikan dengan Surat Keterangan Sehat dari fasilitas kesehatan).\nTidak memiliki catatan kriminal (Wajib melampirkan Surat Keterangan Catatan Kepolisian/SKCK).\nBersedia mengikuti seluruh rangkaian pelatihan dan aturan asrama hingga selesai.",
    sortOrder: 2,
  },
  {
    categoryName: "Pelatihan",
    programFormat: "Hybrid",
    name: "Program Hybrid",
    description:
      "Program pelatihan sekaligus karantina kerja secara hybrid  bagi yang tertarik kerja di jepang dengan bidang pekerjaan (kaigo, pengelolaan makanan, pertanian, perhotelan, driver)\n\nBiaya Registrasi : Rp. 300.000",
    requirements:
      "- Ijazah Minimal SMA/Sederajat\n- Sehat Jasmani & Rohani\n- Usia Maksimal 30 Tahun\n- Siap Belajar Diklat",
    schedule: "Senin-Jumat",
    duration: "6 bulan",
    capacity: 15,
    currentParticipants: 2,
    status: "active" as const,
    isRunning: true,
    contactInfo:
      "Email: info@fitalenta.co.id\nTelp: 0811 1011 9273\nAlamat: Gedung Science Techno Park ITB. Jl. Ganesha No.15E, Lb. Siliwangi, Kec. Coblong, Bandung 40132",
    registrationDeadline: new Date("2024-12-30T17:00:00.000Z"),
    startDate: new Date("2024-01-31T17:00:00.000Z"),
    endDate: new Date("2024-04-29T17:00:00.000Z"),
    location: "via Google Meet/Zoom",
    trainingCost: 7000000.0,
    trainingFeeDetails:
      "Biaya pelatihan.\nAkses ke platform pembelajaran virtual (LMS).\nModul & buku pelajaran digital bahasa Jepang. \nSesi live interaction & bimbingan virtual.\nFasilitas asrama (akomodasi & utilitas dasar) selama 1 bulan pemantapan luring.\nPendampingan & bimbingan belajar.",
    departureCost: 30000000.0,
    departureFeeDetails:
      "Tiket pesawat ke Jepang Visa & dokumen keberangkatan \nAsuransi perjalanan & kesehatan \nBiaya penempatan kerja di Jepang\nPendampingan proses keberangkatan hingga penyaluran",
    installmentPlan: "3_installments",
    downPayment: 5000000.0,
    jobMatchingCost: 0.0,
    bridgeFund: "Tersedia ",
    timelineText:
      "Minggu 1-6: Pelatihan Dasar Bahasa Jepang (Virtual: Penguasaan Hiragana & Katakana).\nMinggu 7-12: Pengembangan Kosakata dan Tata Bahasa Lanjutan (Virtual: Fokus N5 dan Komunikasi Dasar).\nMinggu 13-20: Bahasa Lanjutan, Evaluasi Virtual, dan Persiaapan Administratif (Virtual: Fokus N4, Self-Study, dan Pre-screening dokumen penempatan).\nMinggu 21-24: Pemantapan Budaya, Kesiapan Fisik/Mental, dan Penyaluran (Luring di Asrama: Etika Kerja, Simulasi Wawancara, dan Ujian Akhir).",
    requirementsText:
      "Minimal 18 tahun dan Maksimal 30 Tahun.\nMinimal Ijazah SMA/SMK Sederajat.\nSehat Jasmani & Rohani (Wajib dibuktikan dengan Surat Keterangan Sehat dari fasilitas kesehatan).\nTidak memiliki catatan kriminal (Wajib melampirkan Surat Keterangan Catatan Kepolisian/SKCK).\nBersedia mengikuti seluruh rangkaian pelatihan dan aturan asrama hingga selesai.",
    sortOrder: 3,
  },
  {
    categoryName: "Pelatihan",
    programFormat: "Beasiswa",
    name: "Program beasiswa bahasa Jepang - N1",
    description:
      "Program beasiswa N2-N1 langsung belajar di Jepang selama 2 tahun sambil kerja part time, program ini diperuntukkan untuk yang ingin kuliah di jepang maupun bekerja sesuai backround jenjang sebelumnya",
    requirements: "Usia maksimal 30 tahun, lulusan minimal S1, Sehat Rohani&jasmani, siap belajar N4-N3",
    schedule: "senin-jumat ",
    duration: "6 bulan+2 tahun",
    capacity: 5,
    currentParticipants: 0,
    status: "active" as const,
    isRunning: true,
    contactInfo: "info@fitalenta.co.id / 0811-1011-9273",
    registrationDeadline: null,
    startDate: null,
    endDate: null,
    location: "Bandung-Osaka",
    trainingCost: 15000000.0,
    trainingFeeDetails: "administrasi, pelatihan bahasa, beasiswa bahasa, Bimbingan",
    departureCost: 25000000.0,
    departureFeeDetails: "Tiket, visa, CoE, paspor ",
    installmentPlan: "none",
    downPayment: 0.0,
    jobMatchingCost: 0.0,
    bridgeFund: "Tidak Tersedia",
    timelineText:
      "1. Belajar bhs Jepang hingga N4/N3 di Indonesia\n2. Interview dgn lembaga bhs Jepang\n3. Pemberkasan keberangkatan\n4. Belajar bhs Jepang di Osaka hingga N1 (pemilihan study/kerja)",
    requirementsText: "",
    sortOrder: 999,
  },
  {
    categoryName: "Pelatihan",
    programFormat: "Fast Track",
    name: "Tokutei Ginou Program Fast Track",
    description:
      "Program pelatihan khusus bagi yang sudah memiliki sertifikat JLPT N4 dan SSW dengan pilihan kelas intensif bersifat opsional.\n\nBiaya Registrasi : Rp 300.000\nBiaya Intensif (optional) : Rp 3.000.000",
    requirements:
      "- Ijazah SMA/sederajat\n- Sehat  jasmani dan rohani\n- Usia ≤ 30\n- Siap Intensif\n- Memiliki sertifikat JLPT N4 & SSW",
    schedule: "",
    duration: "1 bulan",
    capacity: 9999999,
    currentParticipants: 21,
    status: "active" as const,
    isRunning: true,
    contactInfo:
      "Email: info@fitalenta.co.id\nTelp: 0811 1011 9273\nAlamat: Gedung Science Techno Park ITB. Jl. Ganesha No.15E, Lb. Siliwangi, Kec. Coblong, Bandung 40132",
    registrationDeadline: new Date("2024-12-30T17:00:00.000Z"),
    startDate: new Date("2024-01-31T17:00:00.000Z"),
    endDate: new Date("2024-05-30T17:00:00.000Z"),
    location: "online/offline (Bandung)",
    trainingCost: 3000000.0,
    trainingFeeDetails: "Biaya intensif 1 bulan (opsional)\nAccess job\nPendampingan job matching",
    departureCost: 30000000.0,
    departureFeeDetails:
      "Tiket pesawat ke Jepang Visa dan dokumen keberangkatan \nAsuransi perjalanan dan kesehatan awal\nBiaya penempatan kerja di Jepang\nProcessing fee administrasi penyaluran",
    installmentPlan: "none",
    downPayment: 0.0,
    jobMatchingCost: 0.0,
    bridgeFund: "Tersedia",
    timelineText:
      "Minggu 1: Verifikasi Dokumen, Sertifikat N4/SSW, Keahlian Teknis, dan interview awal dengan FITALENTA\nMinggu 2: join WAG, access job FITALENTA \nMinggu 3: Job Matching\nMinggu 4: Pemberkasan hingga take-off",
    requirementsText:
      "Memiliki sertifikat Noryoku Shiken N4\nMemiliki sertifikat Specified Skilled Worker (SSW)\nMinimal 18 tahun dan Maksimal 30 Tahun.\nMinimal Ijazah SMA/SMK Sederajat.\nSehat Jasmani & Rohani (Wajib dibuktikan dengan Surat Keterangan Sehat dari fasilitas kesehatan).\nTidak memiliki catatan kriminal (Wajib melampirkan Surat Keterangan Catatan Kepolisian/SKCK).\nBersedia mengikuti seluruh rangkaian program fast track.",
    sortOrder: 999,
  },
  {
    categoryName: "Work",
    programFormat: "Reguler",
    name: "Program Gijinkoku",
    description: "Program yang dikhususkan bagi lulusan engineer yg tertarik kerja di Jepang",
    requirements: "S1 Engineer, usia max 30 tahun,Sehat rohani&jasmani, siap belajar N4-N3",
    schedule: "senin-jumat",
    duration: "6 bulan",
    capacity: 20,
    currentParticipants: 1,
    status: "active" as const,
    isRunning: true,
    contactInfo: "info@fitalenta.co.id / 0811-1011-9273",
    registrationDeadline: null,
    startDate: null,
    endDate: null,
    location: "Bandung",
    trainingCost: 15000000.0,
    trainingFeeDetails: "administrasi, pelatihan bahasa, JO, Bimbingan",
    departureCost: 25000000.0,
    departureFeeDetails: "Tiket, visa, CoE, paspor ",
    installmentPlan: "3_installments",
    downPayment: 0.0,
    jobMatchingCost: 0.0,
    bridgeFund: "Tersedia",
    timelineText:
      "Bulan 1: Pelatihan Dasar Bahasa Jepang (Hiragana & Katakana)\nBulan 2: Pengembangan Kosakata dan Tata Bahasa\nBulan 3: Budaya Jepang dan Etika Kerja\nBulan 4: Persiapan Akhir dan Evaluasi",
    requirementsText: "",
    sortOrder: 6,
  },
  {
    categoryName: "Korea",
    programFormat: "Reguler",
    name: "Program Korea",
    description:
      "Program konsultasi dan kelas persiapan bahasa Korea (TOPIK) serta pendampingan awal dokumen bagi calon mahasiswa S1/S2 yang berencana melanjutkan studi ke Korea Selatan. Seluruh proses persiapan dilaksanakan di Indonesia.",
    requirements:
      "Calon mahasiswa S1 atau S2 (Ijazah SMA/Sederajat atau S1), Memiliki minat studi ke Korea Selatan, Bersedia mengikuti kelas selama program berlangsung",
    schedule: "1–2 kali/minggu (menyesuaikan kesepakatan kelas)",
    duration: "3 bulan",
    capacity: 20,
    currentParticipants: 0,
    status: "active" as const,
    isRunning: true,
    contactInfo: "info@fitalenta.co.id / 0811-1011-9273",
    registrationDeadline: null,
    startDate: null,
    endDate: null,
    location: "Online",
    trainingCost: 4200000.0,
    trainingFeeDetails: "administrasi, pelatihan bahasa korea, pendampingan persyaratan kuliah",
    departureCost: 0.0,
    departureFeeDetails: "",
    installmentPlan: "3_installments",
    downPayment: 0.0,
    jobMatchingCost: 0.0,
    bridgeFund: "Tersedia (Jaminan dari perusahaan pengirim)",
    timelineText: "",
    requirementsText: "",
    sortOrder: 7,
  },
  {
    categoryName: "Korea",
    programFormat: "Reguler",
    name: "Program Korea",
    description:
      "Program konsultasi dan kelas persiapan bahasa Korea (TOPIK) serta pendampingan awal dokumen bagi calon mahasiswa S1/S2 yang berencana melanjutkan studi ke Korea Selatan. Seluruh proses persiapan dilaksanakan di Indonesia.",
    requirements:
      "Calon mahasiswa S1 atau S2 (Ijazah SMA/Sederajat atau S1), Memiliki minat studi ke Korea Selatan, Bersedia mengikuti kelas selama program berlangsung",
    schedule: "1–2 kali/minggu (menyesuaikan kesepakatan kelas)",
    duration: "3 bulan",
    capacity: 20,
    currentParticipants: 1,
    status: "active" as const,
    isRunning: true,
    contactInfo: "info@fitalenta.co.id / 0811-1011-9273",
    registrationDeadline: null,
    startDate: null,
    endDate: null,
    location: "Online",
    trainingCost: 7200000.0,
    trainingFeeDetails: "administrasi, pelatihan bahasa korea, pendampingan persyaratan kuliah",
    departureCost: 0.0,
    departureFeeDetails: "",
    installmentPlan: "3_installments",
    downPayment: 0.0,
    jobMatchingCost: 0.0,
    bridgeFund: "Tersedia (Jaminan dari perusahaan pengirim)",
    timelineText: "",
    requirementsText: "",
    sortOrder: 7,
  },
  {
    categoryName: "Korea",
    programFormat: "Reguler",
    name: "Program Korea",
    description:
      "Program konsultasi dan kelas persiapan bahasa Korea (TOPIK) serta pendampingan awal dokumen bagi calon mahasiswa S1/S2 yang berencana melanjutkan studi ke Korea Selatan. Seluruh proses persiapan dilaksanakan di Indonesia.",
    requirements:
      "Calon mahasiswa S1 atau S2 (Ijazah SMA/Sederajat atau S1), Memiliki minat studi ke Korea Selatan, Bersedia mengikuti kelas selama program berlangsung",
    schedule: "1–2 kali/minggu (menyesuaikan kesepakatan kelas)",
    duration: "3 bulan",
    capacity: 20,
    currentParticipants: 1,
    status: "active" as const,
    isRunning: true,
    contactInfo: "info@fitalenta.co.id / 0811-1011-9273",
    registrationDeadline: null,
    startDate: null,
    endDate: null,
    location: "Online",
    trainingCost: 9000000.0,
    trainingFeeDetails: "administrasi, pelatihan bahasa korea, pendampingan persyaratan kuliah",
    departureCost: 0.0,
    departureFeeDetails: "",
    installmentPlan: "3_installments",
    downPayment: 0.0,
    jobMatchingCost: 0.0,
    bridgeFund: "Tersedia (Jaminan dari perusahaan pengirim)",
    timelineText: "",
    requirementsText: "",
    sortOrder: 7,
  },
  {
    categoryName: "Korea",
    programFormat: "Reguler",
    name: "Program Korea",
    description:
      "Program konsultasi dan kelas persiapan bahasa Korea (TOPIK) serta pendampingan awal dokumen bagi calon mahasiswa S1/S2 yang berencana melanjutkan studi ke Korea Selatan. Seluruh proses persiapan dilaksanakan di Indonesia.",
    requirements:
      "Calon mahasiswa S1 atau S2 (Ijazah SMA/Sederajat atau S1), Memiliki minat studi ke Korea Selatan, Bersedia mengikuti kelas selama program berlangsung",
    schedule: "1–2 kali/minggu (menyesuaikan kesepakatan kelas)",
    duration: "3 bulan",
    capacity: 20,
    currentParticipants: 1,
    status: "active" as const,
    isRunning: true,
    contactInfo: "info@fitalenta.co.id / 0811-1011-9273",
    registrationDeadline: null,
    startDate: null,
    endDate: null,
    location: "Online",
    trainingCost: 11400000.0,
    trainingFeeDetails: "administrasi, pelatihan bahasa korea, pendampingan persyaratan kuliah",
    departureCost: 0.0,
    departureFeeDetails: "",
    installmentPlan: "3_installments",
    downPayment: 0.0,
    jobMatchingCost: 0.0,
    bridgeFund: "Tersedia (Jaminan dari perusahaan pengirim)",
    timelineText: "",
    requirementsText: "",
    sortOrder: 7,
  },
  {
    categoryName: "Korea",
    programFormat: "Reguler",
    name: "Program Kerja Korea",
    description: "Program yang dikhususkan bagi lulusan engineer yg tertarik kerja di Korea",
    requirements:
      "S1 Engineer, usia max 30 tahun,Sehat rohani&jasman, pengalaman expert dibidang engineer, paspor jika ada",
    schedule: "1-3 bulan belajar  bahasa korea secara online (setelah mendapatkan OL)",
    duration: "masa tunggu kelolosan max 6 bulan",
    capacity: 20,
    currentParticipants: 1,
    status: "active" as const,
    isRunning: true,
    contactInfo: "info@fitalenta.co.id / 0811-1011-9273",
    registrationDeadline: null,
    startDate: null,
    endDate: null,
    location: "Korea",
    trainingCost: 0.0,
    trainingFeeDetails: "10 juta/bulan selama 12 bulana",
    departureCost: 99999999.99,
    departureFeeDetails: "administrasi berkas, visa, CoE, Tiket pesawat, pembekalan bahasa korea, agen",
    installmentPlan: "none",
    downPayment: 0.0,
    jobMatchingCost: 0.0,
    bridgeFund: "Tersedia (Jaminan dari perusahaan pengirim)",
    timelineText:
      "CV-Interview-pengajuan CV ke agen-masa tunggu max 6 bulan- 1-3 bulan turun Offering Letter sampai on opoarding",
    requirementsText: "",
    sortOrder: 999,
  },
];

async function main() {
  console.log("Menghubungkan ke database dan menyiapkan program...");
  const categoryMap = new Map<string, number>();

  for (const name of categoryNames) {
    let category = await prisma.programCategory.findFirst({ where: { name } });
    if (!category) {
      category = await prisma.programCategory.create({ data: { name } });
    }
    categoryMap.set(name, category.id);
  }
  console.log(`✔ ${categoryNames.length} kategori program siap`);

  let count = 0;
  for (const { categoryName, ...programData } of programs) {
    const data = {
      ...programData,
      categoryId: categoryMap.get(categoryName),
    };

    const existing = await prisma.program.findFirst({
      where: { name: programData.name },
    });

    if (existing) {
      await prisma.program.update({
        where: { id: existing.id },
        data,
      });
    } else {
      await prisma.program.create({ data });
    }
    count++;
    console.log(`  [${count}/${programs.length}] Program: ${programData.name}`);
  }
  console.log(`✔ Selesai: ${count} program berhasil disinkronkan ke database.`);
}

main()
  .catch((e) => {
    console.error("❌ Error saat seeding programs:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });