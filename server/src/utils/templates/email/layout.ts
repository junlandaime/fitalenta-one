import { EMAIL_BRAND, getEmailLogoUrl } from "../../../config/email.config";
import { escapeHtml } from "../../html";

const { colors, fontStack } = EMAIL_BRAND;

interface LayoutOptions {
  title: string;
  preheader: string;
  bodyHtml: string;
  footerNote?: string;
}

function renderPreheader(text: string): string {
  const filler = "&nbsp;&zwnj;".repeat(40);
  return `<div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">${escapeHtml(text)}${filler}</div>`;
}

export const emailParts = {
  heading(text: string): string {
    return `<h1 style="margin:0 0 20px;font-family:${fontStack};font-size:24px;line-height:1.3;font-weight:700;color:${colors.heading};">${escapeHtml(text)}</h1>`;
  },

  paragraph(text: string): string {
    return `<p style="margin:0 0 16px;font-family:${fontStack};font-size:15px;line-height:1.7;color:${colors.text};">${escapeHtml(text)}</p>`;
  },

  button(label: string, href: string): string {
    return `
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0 8px;">
        <tr>
          <td align="center" bgcolor="${colors.primary}" style="border-radius:8px;">
            <a href="${escapeHtml(href)}" target="_blank" class="btn" style="display:inline-block;padding:14px 32px;font-family:${fontStack};font-size:15px;font-weight:700;line-height:1;color:#ffffff;text-decoration:none;border-radius:8px;">${escapeHtml(label)}</a>
          </td>
        </tr>
      </table>`;
  },

  note(text: string): string {
    return `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:20px 0;">
        <tr>
          <td style="padding:14px 16px;background:${colors.soft};border-left:4px solid ${colors.accent};border-radius:0 8px 8px 0;font-family:${fontStack};font-size:13px;line-height:1.6;color:${colors.text};">${escapeHtml(text)}</td>
        </tr>
      </table>`;
  },

  linkFallback(href: string): string {
    return `
      <p style="margin:24px 0 6px;font-family:${fontStack};font-size:12px;line-height:1.6;color:${colors.muted};">Tombol tidak berfungsi? Salin dan tempel tautan berikut ke browser Anda:</p>
      <p style="margin:0;font-family:${fontStack};font-size:12px;line-height:1.6;word-break:break-all;"><a href="${escapeHtml(href)}" target="_blank" style="color:${colors.primary};text-decoration:underline;">${escapeHtml(href)}</a></p>`;
  },

  divider(): string {
    return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0 20px;"><tr><td style="border-top:1px solid ${colors.border};font-size:0;line-height:0;">&nbsp;</td></tr></table>`;
  },

  smallText(text: string): string {
    return `<p style="margin:0 0 8px;font-family:${fontStack};font-size:13px;line-height:1.6;color:${colors.muted};">${escapeHtml(text)}</p>`;
  },
};

export function renderEmailLayout({ title, preheader, bodyHtml, footerNote }: LayoutOptions): string {
  const { name, company, website, websiteUrl, supportEmail, phone, addressLines } = EMAIL_BRAND;
  const year = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="id" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>${escapeHtml(title)}</title>
  <style>
    @media only screen and (max-width: 620px) {
      .container { width: 100% !important; }
      .px { padding-left: 24px !important; padding-right: 24px !important; }
      .btn { display: block !important; text-align: center !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background:${colors.page};-webkit-text-size-adjust:100%;">
  ${renderPreheader(preheader)}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${colors.page}" style="background:${colors.page};">
    <tr>
      <td align="center" style="padding:32px 12px;">
        <table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;">
          <tr>
            <td style="background:${colors.surface};border:1px solid ${colors.border};border-radius:14px;overflow:hidden;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td class="px" bgcolor="${colors.header}" style="padding:26px 40px;background:${colors.header};">
                    <a href="${escapeHtml(websiteUrl)}" target="_blank" style="text-decoration:none;">
                      <img src="${escapeHtml(getEmailLogoUrl())}" alt="${escapeHtml(name)}" height="38" style="display:block;border:0;outline:none;height:38px;width:auto;font-family:${fontStack};font-size:22px;font-weight:700;color:#ffffff;">
                    </a>
                  </td>
                </tr>
                <tr><td bgcolor="${colors.accent}" style="height:4px;font-size:0;line-height:0;background:${colors.accent};">&nbsp;</td></tr>
                <tr>
                  <td class="px" style="padding:36px 40px 32px;">
                    ${bodyHtml}
                  </td>
                </tr>
                <tr>
                  <td class="px" bgcolor="${colors.soft}" style="padding:24px 40px;background:${colors.soft};border-top:1px solid ${colors.border};">
                    ${footerNote ? `<p style="margin:0 0 12px;font-family:${fontStack};font-size:12px;line-height:1.6;color:${colors.muted};">${escapeHtml(footerNote)}</p>` : ""}
                    <p style="margin:0 0 4px;font-family:${fontStack};font-size:13px;line-height:1.6;font-weight:700;color:${colors.heading};">${escapeHtml(company)}</p>
                    <p style="margin:0;font-family:${fontStack};font-size:12px;line-height:1.7;color:${colors.muted};">
                      ${addressLines.map(escapeHtml).join("<br>")}<br>
                      Telp. ${escapeHtml(phone)} &middot; <a href="mailto:${escapeHtml(supportEmail)}" style="color:${colors.primary};text-decoration:none;">${escapeHtml(supportEmail)}</a><br>
                      <a href="${escapeHtml(websiteUrl)}" target="_blank" style="color:${colors.primary};text-decoration:none;">${escapeHtml(website)}</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:18px 12px 0;font-family:${fontStack};font-size:11px;line-height:1.6;color:${colors.muted};">
              &copy; ${year} ${escapeHtml(company)}. Seluruh hak dilindungi.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function renderTextFooter(): string {
  const { company, addressLines, phone, supportEmail, website } = EMAIL_BRAND;
  return ["--", company, ...addressLines, `Telp. ${phone} | ${supportEmail}`, website].join("\n");
}
