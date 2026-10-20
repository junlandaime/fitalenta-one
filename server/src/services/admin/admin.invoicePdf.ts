import { Response } from "express";
import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";
import { Writable } from "stream";
import { INVOICE_ASSETS, INVOICE_ISSUER } from "../../config/payment.config";
import { PaymentDetail } from "../../types/payment.types";
import { formatDate, formatRupiah, getRomanMonthYear } from "../../utils/format";

type Doc = PDFKit.PDFDocument;

const MARGIN = 50;
const FONT = { regular: "Helvetica", bold: "Helvetica-Bold", italic: "Helvetica-Oblique" } as const;
const BODY_SIZE = 10;
const LINE_GAP = 3;
const LETTER_BOX = { labelWidth: 150, padding: 14, rowGap: 8 };

interface Billing {
  description: string;
  amount: string;
  installmentNumber: number | null;
}

function assetPath(file: string): string | null {
  const fullPath = path.join(process.cwd(), ...INVOICE_ASSETS.folder, file);
  return fs.existsSync(fullPath) ? fullPath : null;
}

function resolveBilling(invoice: PaymentDetail): Billing {
  const { installment } = invoice;
  if (!installment) {
    return {
      description: invoice.notes || "Biaya Program",
      amount: invoice.amount,
      installmentNumber: null,
    };
  }

  const index = Math.min(installment.current, installment.total - 1);
  return {
    description: `Cicilan Ke-${index + 1} Biaya Program`,
    amount: installment.amounts[index],
    installmentNumber: index + 1,
  };
}

function buildLetterNumber(invoice: PaymentDetail, date: Date): string {
  const sequence = parseInt(invoice.invoiceNumber.split("-").pop() ?? "", 10);
  const { roman, year } = getRomanMonthYear(date);
  const prefix = Number.isNaN(sequence) ? invoice.invoiceNumber : String(sequence);

  return `${prefix}/${INVOICE_ISSUER.letterCode}/${roman}/${year}`;
}

function buildNotes(invoice: PaymentDetail): string[] {
  const deadline = invoice.nextDueDate ?? invoice.dueDate;
  const lines = [];

  if (deadline) {
    lines.push(`Batas akhir pembayaran s.d ${formatDate(deadline)}, pukul ${INVOICE_ISSUER.paymentDeadlineTime}`);
  }
  if (invoice.notes) lines.push(invoice.notes);

  return lines.length > 0 ? lines : ["-"];
}

function setFont(doc: Doc, font: string = FONT.regular, size = BODY_SIZE): Doc {
  return doc.font(font).fontSize(size).fillColor("#000000");
}

function contentWidth(doc: Doc): number {
  return doc.page.width - MARGIN * 2;
}

function drawLetterhead(doc: Doc, invoice: PaymentDetail): void {
  const logo = assetPath(INVOICE_ASSETS.logo);
  if (logo) doc.image(logo, MARGIN + 10, 42, { width: 130 });

  const textX = 220;
  setFont(doc, FONT.bold, 10).text(INVOICE_ISSUER.name, textX, 46);
  setFont(doc, FONT.regular, 8);
  [...INVOICE_ISSUER.addressLines, `Telp: ${INVOICE_ISSUER.phone}`, INVOICE_ISSUER.website].forEach((line) =>
    doc.text(line, textX, doc.y + 1)
  );

  if (invoice.invoiceState === "draft") {
    setFont(doc, FONT.bold, 8).fillColor("#b91c1c").text("DRAFT - BELUM DITERBITKAN", textX, doc.y + 4);
  }
}

function drawRecipient(doc: Doc, invoice: PaymentDetail, billing: Billing, letterDate: Date): void {
  doc.x = MARGIN;
  doc.y = 135;

  setFont(doc).text(`${INVOICE_ISSUER.city}, ${formatDate(letterDate)}`, MARGIN, doc.y);
  doc.text(`No: ${buildLetterNumber(invoice, letterDate)}`, MARGIN, doc.y + 4);

  doc.text("Kepada Yth.", MARGIN, doc.y + 12);
  setFont(doc, FONT.bold).text(invoice.participant.name, MARGIN, doc.y + 1);

  const subject = billing.installmentNumber
    ? `Invoice Cicilan Ke-${billing.installmentNumber} ${invoice.program.name}`
    : `Invoice ${invoice.notes || invoice.program.name}`;
  setFont(doc, FONT.bold).text(`Perihal: ${subject}`, MARGIN, doc.y + 18, { underline: true });

  setFont(doc, FONT.italic).text("Assalamu’alaikum Warahmatullahi Wabarakatuh.", MARGIN, doc.y + 18);
  setFont(doc).text("Salam hormat,", MARGIN, doc.y + 12);
}

function drawIntroduction(doc: Doc, invoice: PaymentDetail, billing: Billing): void {
  const scheme = billing.installmentNumber ? " melalui skema cicilan" : "";
  const program = invoice.program.name;

  setFont(doc).text(
    `Terimakasih atas kepercayaan yang diberikan kepada ${INVOICE_ISSUER.name} untuk ikut serta dalam pengiriman tenaga kerja melalui ${program}. Bersama ini kami sampaikan tagihan biaya ${program}${scheme}.`,
    MARGIN,
    doc.y + 6,
    { width: contentWidth(doc), align: "justify", indent: 32, lineGap: LINE_GAP }
  );
}

function drawDetailBox(doc: Doc, invoice: PaymentDetail, billing: Billing): void {
  const { labelWidth, padding, rowGap } = LETTER_BOX;
  const valueX = MARGIN + padding + labelWidth + 14;
  const valueWidth = MARGIN + contentWidth(doc) - padding - valueX;

  const rows: { label: string; lines: string[] }[] = [
    { label: "Nama Program", lines: [invoice.program.name] },
    { label: "Tagihan", lines: [formatRupiah(billing.amount)] },
    { label: "Rincian Tagihan", lines: [billing.description] },
    { label: "Rekening Tujuan", lines: [INVOICE_ISSUER.name, `Nomor Rekening ${INVOICE_ISSUER.bank.name} ${INVOICE_ISSUER.bank.accountNumber}`] },
    { label: "Catatan", lines: buildNotes(invoice) },
  ];

  setFont(doc);
  const heights = rows.map(({ lines }) => doc.heightOfString(lines.join("\n"), { width: valueWidth }));
  const boxHeight = heights.reduce((sum, h) => sum + h + rowGap, 0) + padding * 2 - rowGap;
  const top = doc.y + 18;

  doc.lineWidth(0.8).strokeColor("#000000").rect(MARGIN, top, contentWidth(doc), boxHeight).stroke();

  let y = top + padding;
  rows.forEach((row, index) => {
    setFont(doc, FONT.bold).text(row.label, MARGIN + padding, y, { width: labelWidth });
    setFont(doc).text(":", MARGIN + padding + labelWidth, y);
    setFont(doc).text(row.lines.join("\n"), valueX, y, { width: valueWidth });
    y += heights[index] + rowGap;
  });

  doc.y = top + boxHeight;
}

function drawClosing(doc: Doc): void {
  const width = contentWidth(doc);

  setFont(doc).text("Sesuai dengan ketentuan yang berlaku, ", MARGIN, doc.y + 16, {
    width,
    align: "justify",
    indent: 32,
    lineGap: LINE_GAP,
    continued: true,
  });
  setFont(doc, FONT.bold).text("seluruh pembayaran yang telah dibayarkan tidak dapat dikembalikan dengan alasan apa pun", {
    continued: true,
  });
  setFont(doc).text(
    ". Harap dapat melakukan pengecekan kembali atas rincian invoice yang Anda terima. Demikian invoice yang kami berikan, atas perhatian Anda kami ucapkan terimakasih.",
    { continued: false }
  );

  setFont(doc, FONT.italic).text("Wassalamu’alaikum Warahmatullahi Wabarakatuh.", MARGIN, doc.y + 12);
}

function drawSignature(doc: Doc): void {
  setFont(doc).text("Hormat Kami,", MARGIN, doc.y + 16);

  const signature = assetPath(INVOICE_ASSETS.signature);
  const signatureTop = doc.y + 8;
  if (signature) doc.image(signature, MARGIN, signatureTop, { width: 210 });

  const nameY = signatureTop + (signature ? 68 : 40);
  setFont(doc, FONT.bold).text(INVOICE_ISSUER.signatory.name, MARGIN, nameY, { underline: true });
  setFont(doc).text(INVOICE_ISSUER.signatory.title, MARGIN, doc.y + 1, { underline: false });
}

function drawMotto(doc: Doc): void {
  setFont(doc, FONT.italic, 7.5).text(INVOICE_ISSUER.motto, MARGIN, doc.page.height - MARGIN - 12, {
    width: contentWidth(doc),
    lineBreak: false,
  });
}

export function streamInvoicePdf(invoice: PaymentDetail, output: Writable): void {
  const doc = new PDFDocument({
    size: "A4",
    margins: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN },
    info: { Title: `Invoice ${invoice.invoiceNumber}`, Author: INVOICE_ISSUER.name },
  });
  doc.pipe(output);

  const billing = resolveBilling(invoice);
  const letterDate = invoice.issuedAt ?? new Date();

  drawLetterhead(doc, invoice);
  drawRecipient(doc, invoice, billing, letterDate);
  drawIntroduction(doc, invoice, billing);
  drawDetailBox(doc, invoice, billing);
  drawClosing(doc);
  drawSignature(doc);
  drawMotto(doc);

  doc.end();
}

export function sendInvoicePdf(res: Response, invoice: PaymentDetail, download = false): void {
  const disposition = download ? "attachment" : "inline";

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `${disposition}; filename="${invoice.invoiceNumber}.pdf"`);
  res.setHeader("Cache-Control", "private, no-store");
  streamInvoicePdf(invoice, res);
}
