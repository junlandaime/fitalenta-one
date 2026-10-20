import { emailParts, renderEmailLayout, renderTextFooter } from "./layout";

export interface ActionEmailContent {
  preheader: string;
  title: string;
  name: string;
  paragraphs: string[];
  buttonLabel: string;
  link: string;
  expiryNote: string;
  outro: string;
}

export interface RenderedEmail {
  html: string;
  text: string;
}

export function renderActionEmail(content: ActionEmailContent): RenderedEmail {
  const { preheader, title, name, paragraphs, buttonLabel, link, expiryNote, outro } = content;

  const bodyHtml = [
    emailParts.heading(title),
    emailParts.paragraph(`Halo ${name},`),
    ...paragraphs.map(emailParts.paragraph),
    emailParts.button(buttonLabel, link),
    emailParts.note(expiryNote),
    emailParts.linkFallback(link),
    emailParts.divider(),
    emailParts.smallText(outro),
  ].join("\n");

  const html = renderEmailLayout({
    title,
    preheader,
    bodyHtml,
    footerNote: "Email ini dikirim otomatis. Mohon tidak membalas email ini.",
  });

  const text = [
    title,
    "",
    `Halo ${name},`,
    "",
    ...paragraphs.flatMap((paragraph) => [paragraph, ""]),
    `${buttonLabel}:`,
    link,
    "",
    expiryNote,
    "",
    outro,
    "",
    renderTextFooter(),
  ].join("\n");

  return { html, text };
}
