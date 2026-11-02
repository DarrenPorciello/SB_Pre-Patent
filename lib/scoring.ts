import type {
  Answers,
  DisclosureState,
  FactorResult,
  Rating,
  ScreeningResult,
} from "./types";
import { pointsFromText } from "./rationale";

function text(answers: Answers, id: string): string {
  const value = answers[id];
  if (Array.isArray(value)) return value.join(" ").trim();
  return (value ?? "").toString().trim();
}

function wordCount(value: string): number {
  return value.split(/\s+/).filter(Boolean).length;
}

export function ratingFromScore(score: number): Rating {
  if (score >= 72) return "High";
  if (score >= 42) return "Medium";
  return "Low";
}

export function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

const NEGATIVE_DISCLOSURE =
  /\b(yes|published|publication|sold|sale|offered|announced|demo|conference|github|blog|press|twitter|linkedin|webinar|trade show)\b|(?<!non-)(?<!internally )\bpublic\b/i;
const CONFIDENTIAL_ONLY =
  /\b(no|none|internal only|nda|under nda|confidential|not disclosed|have not)\b/i;
const SPECIFICITY =
  /\b(algorithm|model|protocol|ledger|api|workflow|engine|score|risk|fraud|payment|clearing|settlement|latency|encrypt|token|graph|pipeline)\b/i;
const COMPARISON =
  /\b(unlike|compared|whereas|instead of|different from|prior|existing|competitor|today|currently|avoids|reduces|improves)\b/i;

function disclosureRisk(answers: Answers): {
  score: number;
  flags: string[];
} {
  const fields = [
    "disclosedAnyone",
    "disclosedToWhom",
    "writtenPublication",
    "shownOrSold",
    "offerForSale",
    "usedAnywhere",
  ];
  const planned = text(answers, "plannedPublication") + " " + text(answers, "plannedMarketing");
  const flags: string[] = [];
  let risk = 8;

  for (const id of fields) {
    const value = text(answers, id);
    if (!value) continue;
    const lower = value.toLowerCase();
    if (/^no\b/.test(lower) || lower === "none" || /not (been )?(disclosed|published|sold|used)/i.test(value)) {
      continue;
    }
    if (NEGATIVE_DISCLOSURE.test(value) && !/^no\b/i.test(value)) {
      risk += id === "offerForSale" || id === "shownOrSold" || id === "writtenPublication" ? 28 : 16;
      flags.push(id);
    } else if (value.length > 12 && !CONFIDENTIAL_ONLY.test(value)) {
      risk += 10;
      flags.push(id);
    }
  }

  if (NEGATIVE_DISCLOSURE.test(planned) && !/^no\b/i.test(planned)) {
    risk += 8;
    flags.push("plannedDisclosure");
  }

  return { score: clamp(100 - risk), flags };
}

function scoreNovelty(answers: Answers): FactorResult {
  const advantages = text(answers, "advantages");
  const problems = text(answers, "problemsSolved");
  const prior = text(answers, "priorSolutions");
  const competing = text(answers, "competingTech");
  const similar = text(answers, "similarPatents");
  const idea = text(answers, "plainLanguageIdea") + " " + text(answers, "howOvercomes");

  let score = 28;
  const notes: string[] = [];

  const detail = wordCount(advantages) + wordCount(problems);
  if (detail > 80) score += 22;
  else if (detail > 35) score += 14;
  else if (detail > 12) score += 6;
  else notes.push("The novelty write-up is still thin — spell out what is actually new.");

  if (COMPARISON.test(advantages) || COMPARISON.test(competing)) {
    score += 14;
    notes.push("Differentiation against existing approaches is described.");
  } else {
    notes.push("Call out concrete differences versus what already exists, not just that it is “better”.");
  }

  if (SPECIFICITY.test(idea) || SPECIFICITY.test(advantages)) score += 10;

  if (wordCount(prior) > 20) score += 8;
  if (wordCount(competing) > 20) score += 6;

  const similarLower = similar.toLowerCase();
  if (!similar || /^no\b/.test(similarLower) || /not aware|none known/.test(similarLower)) {
    score += 8;
    notes.push("No close prior patents were identified by the inventor — still worth a patentability search.");
  } else if (similar.length > 20) {
    score -= 12;
    notes.push("Similar disclosures were noted, which may narrow the remaining inventive space.");
  }

  score = clamp(score);
  return {
    id: "novelty",
    name: "Novelty",
    score,
    rating: ratingFromScore(score),
    rationale:
      notes.join(" ") ||
      "Novelty was assessed from the problem statement, claimed differences, and known similar art.",
  };
}

function scoreDevelopment(answers: Answers): FactorResult {
  const reduction = text(answers, "reductionDate");
  const structure = text(answers, "structureOperation");
  const product = text(answers, "productIntent");
  const conception = text(answers, "conceptionDate");
  const records = text(answers, "labRecords");
  const signed = text(answers, "signedDated");
  const funding = text(answers, "additionalFunding");

  let score = 18;
  const notes: string[] = [];

  if (conception) {
    score += 8;
  }
  if (reduction) {
    score += 22;
    notes.push("A reduction-to-practice date is recorded, which strengthens the disclosure.");
  } else {
    notes.push("No working embodiment date was given — the idea may still be conceptual.");
  }

  const implWords = wordCount(structure);
  if (implWords > 120) score += 24;
  else if (implWords > 50) score += 16;
  else if (implWords > 18) score += 8;
  else notes.push("Add structure, flow, and operation detail so counsel can see how it actually works.");

  if (/yes|planned|release|roadmap|pilot|production/i.test(product) && wordCount(product) > 8) {
    score += 12;
    notes.push("There is an intended product or service path.");
  }
  if (records) score += 6;
  if (signed === "yes") score += 6;
  if (wordCount(funding) > 12) score += 4;

  score = clamp(score);
  return {
    id: "development",
    name: "How developed the idea is",
    score,
    rating: ratingFromScore(score),
    rationale:
      notes.join(" ") ||
      "Development was assessed from reduction to practice, implementation detail, and product intent.",
  };
}

function scoreDisclosure(answers: Answers): FactorResult {
  const { score, flags } = disclosureRisk(answers);
  let rationale: string;
  if (flags.length === 0) {
    rationale =
      "No clear public disclosure, sale, or publication was described. That preserves patent options if confidentiality has been maintained.";
  } else if (flags.includes("offerForSale") || flags.includes("shownOrSold") || flags.includes("writtenPublication")) {
    rationale =
      "There are signals of publication, sale, or public showing. That can start statutory bars — treat this as a patent-risk item and get counsel involved before any further disclosure.";
  } else {
    rationale =
      "Some sharing is described. Confirm it was under NDA or internal-only. A single unprotected disclosure can count as a publication.";
  }
  return {
    id: "disclosure",
    name: "Prior public disclosure",
    score,
    rating: ratingFromScore(score),
    rationale,
  };
}

function scoreRevenue(answers: Answers): FactorResult {
  const impact = text(answers, "revenueImpact");
  const detail = text(answers, "revenueDetail");
  const assessed = text(answers, "costsAssessed");

  let score = 20;
  const notes: string[] = [];

  if (impact === "yes") {
    score += 48;
    notes.push("Inventor expects annual impact above the $1 million CAD threshold.");
  } else if (impact === "maybe") {
    score += 28;
    notes.push("Revenue impact is possible but not yet proven.");
  } else if (impact === "no") {
    score += 8;
    notes.push("Expected annual impact is below the screening threshold, which lowers patent ROI.");
  } else {
    score += 12;
    notes.push("Revenue has not been assessed yet.");
  }

  if (wordCount(detail) > 25) score += 12;
  else if (wordCount(detail) > 8) score += 6;

  if (/yes|modelled|modeled|forecast|npv|business case/i.test(assessed)) score += 12;
  else if (/not yet|no\b|unassessed/i.test(assessed)) score -= 4;

  score = clamp(score);
  return {
    id: "revenue",
    name: "Revenue opportunity",
    score,
    rating: ratingFromScore(score),
    rationale: notes.join(" ") || "Revenue opportunity was scored from the threshold answer and supporting detail.",
  };
}

function scoreReputation(answers: Answers): FactorResult {
  const help = text(answers, "reputationHelp");
  const detail = text(answers, "reputationDetail");
  let score = 24;
  const notes: string[] = [];

  if (help === "yes") {
    score += 46;
    notes.push("The idea is described as clearly brand-positive for Scotiabank.");
  } else if (help === "somewhat") {
    score += 28;
    notes.push("Reputational lift is incremental rather than distinctive.");
  } else if (help === "neutral") {
    score += 14;
    notes.push("The idea is largely internal, with limited brand signal.");
  } else if (help === "no") {
    score += 4;
    notes.push("Little reputational benefit was claimed.");
  }

  if (/\b(trust|client|customer|innovation|safety|inclusion|canada|leadership|security|privacy)\b/i.test(detail)) {
    score += 12;
  }
  if (wordCount(detail) > 20) score += 8;

  score = clamp(score);
  return {
    id: "reputation",
    name: "Helping Scotiabank’s reputation",
    score,
    rating: ratingFromScore(score),
    rationale: notes.join(" ") || "Reputation impact was scored from the screening answer and explanation.",
  };
}

function scoreCompetitor(answers: Answers): FactorResult {
  const copy = text(answers, "competitorCopy");
  const who = text(answers, "competitorsWant");
  const detect = text(answers, "detectUse");
  const purpose = text(answers, "filingPurpose");

  let score = 22;
  const notes: string[] = [];

  if (copy === "yes") {
    score += 44;
    notes.push("A competitor would likely want to copy this, which supports defensive filing.");
  } else if (copy === "possibly") {
    score += 26;
    notes.push("Some competitive interest is plausible.");
  } else if (copy === "no") {
    score += 8;
    notes.push("Low copy-risk can mean the idea is hard to detect, easy to design around, or of limited strategic value.");
  }

  if (wordCount(who) > 30) score += 12;
  else if (wordCount(who) > 10) score += 6;
  else notes.push("Name specific competitors and realistic design-arounds.");

  if (wordCount(detect) > 20) score += 10;
  if (/\b(block|competitor|defensive|freedom to operate|license)\b/i.test(purpose)) score += 8;

  score = clamp(score);
  return {
    id: "competitor",
    name: "Will a competitor want to copy it",
    score,
    rating: ratingFromScore(score),
    rationale: notes.join(" ") || "Competitive copy-risk was scored from named rivals, design-arounds, and detectability.",
  };
}

export function scoreDisclosureApplication(state: DisclosureState): ScreeningResult {
  const { answers, inventors } = state;
  const factors = [
    scoreNovelty(answers),
    scoreDevelopment(answers),
    scoreDisclosure(answers),
    scoreRevenue(answers),
    scoreReputation(answers),
    scoreCompetitor(answers),
  ];

  const weights: Record<string, number> = {
    novelty: 0.24,
    development: 0.14,
    disclosure: 0.22,
    revenue: 0.16,
    reputation: 0.1,
    competitor: 0.14,
  };

  let overallScore = factors.reduce(
    (sum, factor) => sum + factor.score * (weights[factor.id] ?? 0),
    0,
  );

  const disclosure = factors.find((f) => f.id === "disclosure");
  if (disclosure && disclosure.score < 35) {
    overallScore = Math.min(overallScore, 38);
  }

  const namedInventors = inventors.filter((inv) => inv.name.trim()).length;
  if (namedInventors === 0) overallScore -= 4;

  overallScore = clamp(overallScore);
  const overall = ratingFromScore(overallScore);

  const title = text(answers, "title") || "this idea";
  const tagged = factors.map((factor) => {
    const points = pointsFromText(factor.rationale, "local-rules");
    return {
      ...factor,
      source: "local-rules" as const,
      reasonSource: "local-rules" as const,
      usedWebSearch: false,
      points,
    };
  });

  if (overall === "Low") {
    return {
      submittedAt: new Date().toISOString(),
      overallScore,
      overall,
      factors: tagged,
      recommendationTitle: "Strengthen the idea, or consider a low-cost public disclosure",
      recommendation: `“${title}” is not yet a strong candidate for patent counsel time. Deepen what is new, reduce or document any public sharing, and tighten the commercial story. If the idea is unlikely to clear a later screen, a defensive publication can be cheaper than filing.`,
      nextAction:
        "Revise this disclosure with more implementation detail and a clearer difference versus existing technology. Do not present externally without IP guidance.",
    };
  }

  if (overall === "Medium") {
    return {
      submittedAt: new Date().toISOString(),
      overallScore,
      overall,
      factors: tagged,
      recommendationTitle: "Gather more documentation and evidence",
      recommendation: `“${title}” shows promise but is not ready for executive sponsorship. Build dated records, a working description, and a sharper view of revenue and competitive copy-risk before involving a patent lawyer.`,
      nextAction:
        "Collect lab notes, diagrams, and any NDA-covered discussions. Update this form and resubmit when the Medium gaps are closed.",
    };
  }

  return {
    submittedAt: new Date().toISOString(),
    overallScore,
    overall,
    factors: tagged,
    recommendationTitle: "Proceed to executive sponsorship",
    recommendation: `“${title}” cleared the automated pre-screen at High. Legal time should now be spent on this idea rather than on unscreened submissions.`,
    nextAction:
      "This idea has passed the automated pre-screen. Seek executive sponsorship to enter the Bank’s formal patent process.",
  };
}
