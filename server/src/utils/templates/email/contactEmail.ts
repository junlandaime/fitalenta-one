
import { EMAIL_BRAND } from "../../../config/email.config";
import { escapeHtml } from "../../html";
import type { RenderedEmail } from "./actionEmail";
import { emailParts, renderEmailLayout, renderTextFooter } from "./layout";

const { colors, fontStack } = EMAIL_BRAND;

export interface ContactEmailContent {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
  company?: string;
}

function detailRows(rows: [label: string, value: string, href?: string][]): string {
  const cells = rows
    .map(([label, value, href], index) => {
      const border = index === rows.length - 1 ? "" : `border-bottom:1px solid ${colors.border};`;
      const content = href
        ? `<a href="${escapeHtml(href)}" style="color:${colors.primary};text-decoration:none;">${escapeHtml(value)}</a>`
        : escapeHtml(value);
      return `
        <tr>
          <td width="110" valign="top" style="padding:11px 16px;${border}font-family:${fontStack};font-size:12px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:${colors.muted};">${escapeHtml(label)}</td>
          <td valign="top" style="padding:11px 16px;${border}font-family:${fontStack};font-size:14px;line-height:1.5;color:${colors.heading};">${content}</td>
        </tr>`;
    })
    .join("");

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;border:1px solid ${colors.border};border-radius:10px;background:${colors.soft};">
      ${cells}
    </table>`;
}

export function renderContactEmail({ name, email, subject, message, phone, company }: ContactEmailContent): RenderedEmail {
  const rows: [string, string, string?][] = [
    ["Nama", name],
    ["Email", email, `mailto:${email}`],
  ];
  if (phone) rows.push(["Telepon", phone, `tel:${phone.replace(/[^\d+]/g, "")}`]);
  if (company) rows.push(["Perusahaan", company]);
  rows.push(["Subjek", subject]);

  const messageHtml = escapeHtml(message).replace(/\r?\n/g, "<br>");
  const replyHref = `mailto:${email}?subject=${encodeURIComponent(`Re: ${subject}`)}`;

  const bodyHtml = [
    emailParts.heading("Pesan baru dari website"),
    emailParts.paragraph("Seseorang baru saja mengirim pesan melalui formulir kontak FITALENTA."),
    detailRows(rows),
    `<p style="margin:0 0 8px;font-family:${fontStack};font-size:12px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:${colors.muted};">Pesan</p>`,
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding:16px 18px;background:${colors.soft};border-left:4px solid ${colors.primary};border-radius:0 10px 10px 0;font-family:${fontStack};font-size:15px;line-height:1.7;color:${colors.text};">${messageHtml}</td></tr></table>`,
    emailParts.button("Balas Pesan", replyHref),
    emailParts.divider(),
    emailParts.smallText("Anda juga bisa membalas email ini langsung; balasan akan dikirim ke alamat pengirim."),
  ].join("\n");

  const html = renderEmailLayout({
    title: `Pesan baru dari ${name}`,
    preheader: `${name}: ${subject}`,
    bodyHtml,
  });

  const text = [
    "Pesan baru dari website",
    "",
    `Nama: ${name}`,
    `Email: ${email}`,
    ...(phone ? [`Telepon: ${phone}`] : []),
    ...(company ? [`Perusahaan: ${company}`] : []),
    `Subjek: ${subject}`,
    "",
    "Pesan:",
    message,
    "",
    "Anda dapat membalas email ini langsung; balasan akan dikirim ke alamat pengirim.",
    "",
    renderTextFooter(),
  ].join("\n");

  return { html, text };
}
