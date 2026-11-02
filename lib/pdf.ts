import { jsPDF } from "jspdf";
import { SECTIONS } from "./questions";
import { displayPoints, pointBadge } from "./rationale";
import type { DisclosureState, ScreeningResult } from "./types";

const PAGE_W = 612;
const PAGE_H = 792;
const MARGIN = 54;
const CONTENT_W = PAGE_W - MARGIN * 2;
const RED: [number, number, number] = [236, 17, 26];
const INK: [number, number, number] = [26, 26, 26];
const MUTED: [number, number, number] = [92, 92, 92];
const LINE: [number, number, number] = [228, 226, 223];

function str(value: string | string[] | undefined): string {
  if (!value) return "—";
  if (Array.isArray(value)) return value.length ? value.join(", ") : "—";
  const trimmed = value.trim();
  return trimmed || "—";
}

function drawHeader(doc: jsPDF, page: number, totalHint: string) {
  doc.setFillColor(...RED);
  doc.rect(0, 0, PAGE_W, 8, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...INK);
  doc.text("Scotiabank", MARGIN, 28);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...RED);
  doc.text("CONFIDENTIAL", PAGE_W - MARGIN, 28, { align: "right" });
  doc.setDrawColor(...LINE);
  doc.setLineWidth(0.6);
  doc.line(MARGIN, 36, PAGE_W - MARGIN, 36);
  doc.setTextColor(...MUTED);
  doc.setFontSize(8);
  doc.text(`Pre-patent invention disclosure  ·  ${totalHint}`, MARGIN, PAGE_H - 24);
  doc.text(`Page ${page}`, PAGE_W - MARGIN, PAGE_H - 24, { align: "right" });
}

export function buildDisclosurePdf(
  state: DisclosureState,
  result?: ScreeningResult | null,
  patentId?: string | null,
): jsPDF {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  let page = 1;
  let y = 56;

  const ensure = (needed: number) => {
    if (y + needed > PAGE_H - 48) {
      doc.addPage();
      page += 1;
      drawHeader(doc, page, state.answers.title ? str(state.answers.title) : "Untitled");
      y = 56;
    }
  };

  const title = str(state.answers.title);
  drawHeader(doc, page, title === "—" ? "Untitled" : title);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(...INK);
  doc.text("Confidential invention disclosure", MARGIN, y);
  y += 22;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...MUTED);
  const intro = doc.splitTextToSize(
    `The information in this document is confidential and proprietary to ${str(state.answers.companyName)} and may not be disclosed without prior written permission. Prepared for Scotiabank pre-patent screening.`,
    CONTENT_W,
  );
  doc.text(intro, MARGIN, y);
  y += intro.length * 13 + 10;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...INK);
  doc.text(title === "—" ? "Untitled invention" : title, MARGIN, y);
  y += 18;

  const meta = [
    ...(patentId ? [`Patent ID: ${patentId}`] : []),
    `Company: ${str(state.answers.companyName)}`,
    `Project: ${str(state.answers.internalProject)}`,
    `Exported: ${new Date().toLocaleString()}`,
  ];
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...MUTED);
  meta.forEach((line) => {
    doc.text(line, MARGIN, y);
    y += 13;
  });
  y += 8;

  if (result) {
    ensure(90);
    doc.setFillColor(245, 243, 240);
    doc.roundedRect(MARGIN, y, CONTENT_W, 72, 4, 4, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...INK);
    doc.text(`Screening result: ${result.overall}  (${result.overallScore}/100)`, MARGIN + 14, y + 22);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const rec = doc.splitTextToSize(result.recommendationTitle + ". " + result.nextAction, CONTENT_W - 28);
    doc.text(rec, MARGIN + 14, y + 40);
    y += 88;
  }

  ensure(40);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...INK);
  doc.text("Inventors", MARGIN, y);
  y += 16;
  state.inventors.forEach((inv, index) => {
    const block = [
      `${index + 1}. ${inv.name || "Unnamed"}  ·  ${inv.email || "no email"}`,
      `Address: ${inv.address || "—"}  ·  Residency: ${inv.residency || "—"}  ·  Nationality: ${inv.nationality || "—"}`,
      `Employee: ${inv.employee || "—"}  ·  Outside funding / university / JV: ${inv.outsideFunding || "—"}`,
    ];
    ensure(block.length * 13 + 8);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...INK);
    block.forEach((line) => {
      const wrapped = doc.splitTextToSize(line, CONTENT_W);
      doc.text(wrapped, MARGIN, y);
      y += wrapped.length * 12;
    });
    y += 6;
  });

  for (const section of SECTIONS) {
    if (section.questions.length === 0) continue;
    ensure(36);
    y += 6;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...RED);
    doc.text(section.title, MARGIN, y);
    y += 16;

    for (const question of section.questions) {
      const answer = str(state.answers[question.id]);
      const label = `${question.number ? question.number + ". " : ""}${question.label}`;
      const labelLines = doc.splitTextToSize(label, CONTENT_W);
      const answerLines = doc.splitTextToSize(answer, CONTENT_W);
      ensure(labelLines.length * 12 + answerLines.length * 12 + 16);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(...INK);
      doc.text(labelLines, MARGIN, y);
      y += labelLines.length * 12 + 2;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...MUTED);
      doc.text(answerLines, MARGIN, y);
      y += answerLines.length * 12 + 10;
    }
  }

  ensure(80);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...INK);
  doc.text("Inventor affirmation", MARGIN, y);
  y += 16;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  const affirmation = doc.splitTextToSize(
    "I affirm that to the best of my knowledge this invention disclosure describes an original invention/idea, that the information is complete and correct, and that all persons who might legally claim ownership are identified.",
    CONTENT_W,
  );
  doc.text(affirmation, MARGIN, y);
  y += affirmation.length * 12 + 12;
  const sig = [
    `Name: ${state.signature.name || "—"}`,
    `Email: ${state.signature.email || "—"}`,
    `Typed signature: ${state.signature.typedSignature || "—"}`,
    `Date: ${state.signature.date || "—"}`,
  ];
  sig.forEach((line) => {
    ensure(14);
    doc.text(line, MARGIN, y);
    y += 14;
  });

  if (result) {
    ensure(40);
    y += 8;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...RED);
    doc.text("Patent Submission Review", MARGIN, y);
    y += 16;
    for (const factor of result.factors) {
      const points = displayPoints(factor);
      const header = `${factor.name} — ${factor.rating} (${factor.score}/100)${
        factor.source === "local-rules"
          ? " [score: local rules]"
          : factor.usedWebSearch
            ? " [score: AI agent, web search]"
            : " [score: AI agent]"
      }`;
      ensure(28);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(...INK);
      doc.text(header, MARGIN, y);
      y += 12;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...MUTED);
      for (const point of points) {
        const line = `• ${point.text}  [${pointBadge(point.source).label}]`;
        const wrapped = doc.splitTextToSize(line, CONTENT_W);
        ensure(wrapped.length * 12 + 4);
        doc.text(wrapped, MARGIN, y);
        y += wrapped.length * 12 + 2;
      }
      y += 8;
    }
  }

  const total = doc.getNumberOfPages();
  for (let i = 1; i <= total; i += 1) {
    doc.setPage(i);
    drawHeader(doc, i, title === "—" ? "Untitled" : title);
  }

  return doc;
}

export function downloadDisclosurePdf(
  state: DisclosureState,
  result?: ScreeningResult | null,
  patentId?: string | null,
) {
  const doc = buildDisclosurePdf(state, result, patentId);
  const slug = str(state.answers.title)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
  const idPart = patentId ? `${patentId.toLowerCase()}-` : "";
  doc.save(`scotiabank-invention-disclosure-${idPart}${slug || "draft"}.pdf`);
}
