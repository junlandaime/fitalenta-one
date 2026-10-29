import nodemailer, { type Transporter } from "nodemailer";
import { getResendClient } from "../config/resend";

export interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  from?: string;
}

let transporter: Transporter | null = null;

export function getTransporter(): Transporter | null {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  if (!host) return null;

  const port = Number(process.env.SMTP_PORT) || 465;
  const isSecure = process.env.SMTP_SECURE !== undefined
    ? process.env.SMTP_SECURE === "true"
    : port === 465;

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: isSecure,
    auth: {
      user: process.env.SMTP_USER || "",
      pass: process.env.SMTP_PASS || "",
    },
    tls: {
      rejectUnauthorized: process.env.SMTP_REJECT_UNAUTHORIZED === "true",
    },
  });

  return transporter;
}

export function getDefaultSender(): string {
  return (
    process.env.MAIL_FROM ||
    process.env.AUTH_EMAIL_FROM ||
    process.env.CONTACT_EMAIL_FROM ||
    (process.env.SMTP_USER ? `Fitalenta <${process.env.SMTP_USER}>` : "Fitalenta <noreply@fitalenta.co.id>")
  );
}

export async function sendMail(options: SendMailOptions): Promise<void> {
  const from = options.from || getDefaultSender();
  const smtp = getTransporter();

  if (smtp) {
    await smtp.sendMail({
      from,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      replyTo: options.replyTo,
    });
    return;
  }

  const resend = getResendClient();
  if (resend) {
    const { error } = await resend.emails.send({
      from,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || "",
      replyTo: options.replyTo,
    });
    if (error) throw new Error(error.message);
    return;
  }

  throw new Error("Layanan email belum dikonfigurasi. Pastikan SMTP_HOST (cPanel/Gmail) atau RESEND_API_KEY telah diatur di server/.env");
}

export async function verifyMailConnection(): Promise<{ ok: boolean; message: string }> {
  const smtp = getTransporter();
  if (smtp) {
    try {
      await smtp.verify();
      return {
        ok: true,
        message: `Koneksi SMTP ke ${process.env.SMTP_HOST}:${process.env.SMTP_PORT || 465} berhasil terverifikasi.`,
      };
    } catch (err: any) {
      return { ok: false, message: `Verifikasi SMTP gagal: ${err.message}` };
    }
  }

  const resend = getResendClient();
  if (resend) {
    return { ok: true, message: "Menggunakan layanan Resend (RESEND_API_KEY terdeteksi)." };
  }

  return { ok: false, message: "Belum ada konfigurasi email (SMTP_HOST atau RESEND_API_KEY belum diisi)." };
}
