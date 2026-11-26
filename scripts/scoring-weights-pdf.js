const { jsPDF } = require("jspdf");

const doc = new jsPDF({ unit: "pt", format: "letter" });
const PAGE_W = 612;
const MARGIN = 54;
const RED = [236, 17, 26];
const INK = [26, 26, 26];
const MUTED = [92, 92, 92];
const LINE = [228, 226, 223];
const MIST = [245, 243, 240];

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

let y = 72;
doc.setFont("helvetica", "bold");
doc.setFontSize(18);
doc.setTextColor(...INK);
doc.text("Pre-patent screening scores", MARGIN, y);
y += 22;
doc.setFont("helvetica", "normal");
doc.setFontSize(10);
doc.setTextColor(...MUTED);
const intro = doc.splitTextToSize(
  "The overall score is a weighted average of six factor scores, each from 0 to 100. High is 72 or above, Medium is 42 to 71, and Low is below 42.",
  504,
);
doc.text(intro, MARGIN, y);
y += intro.length * 14 + 18;

doc.setFont("helvetica", "bold");
doc.setFontSize(12);
doc.setTextColor(...INK);
doc.text("Factor weights", MARGIN, y);
y += 16;

const rows = [
  ["Novelty", "38%"],
  ["Prior public disclosure", "18%"],
  ["Revenue opportunity", "14%"],
  ["How developed the idea is", "12%"],
  ["Will a competitor want to copy it", "12%"],
  ["Helping Scotiabank’s reputation", "6%"],
];

rows.forEach((row, i) => {
  if (i % 2 === 0) {
    doc.setFillColor(...MIST);
    doc.rect(MARGIN, y - 12, 504, 28, "F");
  }
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(...INK);
  doc.text(row[0], MARGIN + 12, y + 6);
  doc.setFont("helvetica", "bold");
  doc.text(row[1], MARGIN + 492, y + 6, { align: "right" });
  y += 28;
});

y += 20;
doc.setFont("helvetica", "bold");
doc.setFontSize(12);
doc.setTextColor(...INK);
doc.text("Overall score", MARGIN, y);
y += 16;
doc.setFont("helvetica", "normal");
doc.setFontSize(10);
doc.setTextColor(...MUTED);
const overall = doc.splitTextToSize(
  "Overall = (Novelty × 0.38) + (Disclosure × 0.18) + (Revenue × 0.14) + (Development × 0.12) + (Competitor copy-risk × 0.12) + (Reputation × 0.06). If prior public disclosure is under 35, overall is capped at 38 so the result cannot be High.",
  504,
);
doc.text(overall, MARGIN, y);
y += overall.length * 14 + 18;

doc.setFont("helvetica", "bold");
doc.setFontSize(12);
doc.setTextColor(...INK);
doc.text("What the rating means", MARGIN, y);
y += 16;
doc.setFont("helvetica", "normal");
doc.setFontSize(10);
doc.setTextColor(...MUTED);
[
  "Low: Strengthen the idea, or consider a low-cost public disclosure instead of patenting.",
  "Medium: Gather more documentation and evidence, then resubmit.",
  "High: This idea has passed the screen. Proceed to executive sponsorship to enter the Bank’s formal process.",
].forEach((line) => {
  const wrapped = doc.splitTextToSize(line, 504);
  doc.text(wrapped, MARGIN, y);
  y += wrapped.length * 14 + 8;
});

doc.setFontSize(8);
doc.setTextColor(...MUTED);
doc.text("Internal use only  ·  The Bank of Nova Scotia", MARGIN, 768);
doc.text("Page 1", PAGE_W - MARGIN, 768, { align: "right" });

doc.save("Resources/Scoring-Weights.pdf");
console.log("wrote Resources/Scoring-Weights.pdf");
