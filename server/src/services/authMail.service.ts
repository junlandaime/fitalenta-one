import { getClientBaseUrl } from "../config/email.config";
import { PASSWORD_RESET_TTL_MINUTES } from "../config/password.config";
import resend from "../config/resend";
import { signEmailVerificationToken } from "../utils/emailVerification";
import { signPasswordResetToken } from "../utils/passwordResetToken";
import { renderActionEmail } from "../utils/templates/email/actionEmail";

interface MailRecipient {
  id: number;
  email: string;
  name: string;
}

interface PasswordResetRecipient extends MailRecipient {
  password: string;
}

function buildClientLink(path: string, token: string): string {
  return `${getClientBaseUrl()}${path}?token=${encodeURIComponent(token)}`;
}

async function deliver(to: string, subject: string, { html, text }: { html: string; text: string }): Promise<void> {
  const { error } = await resend.emails.send({
    from: (process.env.AUTH_EMAIL_FROM || process.env.CONTACT_EMAIL_FROM) as string,
    to,
    subject,
    html,
    text,
  });
  if (error) throw new Error(error.message);
}

function dispatch(task: Promise<void>, context: string): void {
  task.catch((error) => console.error(`${context} error:`, error));
}

export function queueVerificationEmail(user: MailRecipient): void {
  const link = buildClientLink("/verify-email", signEmailVerificationToken(user.id, user.email));
  const email = renderActionEmail({
    preheader: "Satu langkah lagi untuk mengaktifkan akun FITALENTA Anda.",
    title: "Verifikasi alamat email Anda",
    name: user.name,
    paragraphs: [
      "Terima kasih telah mendaftar di FITALENTA. Satu langkah lagi: verifikasi alamat email Anda untuk mengaktifkan akun dan mulai mendaftar program.",
    ],
    buttonLabel: "Verifikasi Email",
    link,
    expiryNote: "Tautan verifikasi ini berlaku selama 24 jam sejak email ini dikirim.",
    outro: "Jika Anda tidak merasa mendaftar di FITALENTA, abaikan email ini. Tidak ada tindakan lebih lanjut yang diperlukan.",
  });
  dispatch(deliver(user.email, "Verifikasi email akun FITALENTA", email), "Send verification email");
}

export function queuePasswordResetEmail(user: PasswordResetRecipient): void {
  const link = buildClientLink("/reset-password", signPasswordResetToken(user));
  const email = renderActionEmail({
    preheader: "Buat password baru untuk akun FITALENTA Anda.",
    title: "Atur ulang password Anda",
    name: user.name,
    paragraphs: [
      "Kami menerima permintaan untuk mengatur ulang password akun FITALENTA Anda. Klik tombol di bawah untuk membuat password baru.",
    ],
    buttonLabel: "Atur Ulang Password",
    link,
    expiryNote: `Tautan ini berlaku selama ${PASSWORD_RESET_TTL_MINUTES} menit sejak email ini dikirim.`,
    outro:
      "Jika Anda tidak meminta reset password, abaikan email ini dan password Anda tidak akan berubah. Demi keamanan, jangan bagikan tautan ini kepada siapa pun.",
  });
  dispatch(deliver(user.email, "Reset password akun FITALENTA", email), "Send password reset email");
}