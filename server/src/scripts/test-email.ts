import "dotenv/config";
import { sendMail, verifyMailConnection, getDefaultSender } from "../services/mailer.service";

async function main() {
  const targetEmail = process.argv[2] || process.env.CONTACT_EMAIL_TO || process.env.SMTP_USER;
  console.log("==========================================");
  console.log("       FITALENTA EMAIL TEST RUNNER        ");
  console.log("==========================================");
  console.log(`Provider        : ${process.env.SMTP_HOST ? "SMTP (" + process.env.SMTP_HOST + ")" : process.env.RESEND_API_KEY ? "Resend" : "None"}`);
  console.log(`Default Sender  : ${getDefaultSender()}`);
  console.log(`Target Penerima : ${targetEmail || "(belum ditentukan)"}`);

  if (!targetEmail) {
    console.error("\n[Error] Mohon sediakan email tujuan uji coba!");
    console.error("Contoh penggunaan: npm run test:email nama@email.com");
    process.exit(1);
  }

  console.log("\n[1/2] Memeriksa koneksi layanan email...");
  const status = await verifyMailConnection();
  console.log(`Status koneksi: ${status.ok ? "SUKSES" : "PERINGATAN/GAGAL"} - ${status.message}`);

  if (!status.ok && process.env.SMTP_HOST) {
    console.error("\n[Error] Koneksi SMTP gagal. Periksa kembali SMTP_HOST, SMTP_PORT, SMTP_USER, dan SMTP_PASS di .env");
    process.exit(1);
  }

  console.log(`\n[2/2] Mengirim email uji coba ke: ${targetEmail}...`);
  try {
    await sendMail({
      to: targetEmail,
      subject: "Uji Coba Pengiriman Email Sistem FITALENTA",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #0e4a8f; margin-top: 0;">Uji Coba Email FITALENTA Berhasil!</h2>
          <p>Halo,</p>
          <p>Jika Anda menerima email ini, berarti konfigurasi server email (SMTP / Webmail cPanel) untuk sistem FITALENTA telah <strong>berhasil terhubung dan berfungsi dengan sempurna</strong>.</p>
          <div style="background-color: #f8fafc; border-left: 4px solid #0e4a8f; padding: 12px; margin: 16px 0;">
            <p style="margin: 0; font-size: 14px; color: #334155;"><strong>Host:</strong> ${process.env.SMTP_HOST || "Resend API"}</p>
            <p style="margin: 4px 0 0 0; font-size: 14px; color: #334155;"><strong>Pengirim:</strong> ${getDefaultSender()}</p>
          </div>
          <p>Email verifikasi pendaftaran akun peserta kini siap dikirim secara otomatis.</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="font-size: 12px; color: #64748b; margin: 0;">Email ini dikirim otomatis oleh skrip pengujian Fitalenta backend.</p>
        </div>
      `,
      text: "Uji Coba Email FITALENTA Berhasil!\n\nJika Anda menerima email ini, berarti konfigurasi server email FITALENTA telah berhasil berfungsi dengan baik.",
    });
    console.log(`\n[SUKSES] Email uji coba berhasil dikirim ke ${targetEmail}!`);
    console.log("Silakan periksa folder Inbox (atau Spam/Junk) di email penerima.");
  } catch (err: any) {
    console.error("\n[GAGAL] Terjadi kesalahan saat mengirim email:", err?.message || err);
    process.exit(1);
  }
}

main();
