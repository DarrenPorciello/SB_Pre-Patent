import type { Section } from "./types";

export const SECTIONS: Section[] = [
  {
    id: "getting-started",
    title: "Idea name and ownership",
    eyebrow: "Section 1 of 7",
    description:
      "Give the idea a working name, then record who owns it and whether related filings already exist. This is the confidential invention disclosure used before legal counsel is engaged.",
    questions: [
      {
        id: "title",
        number: "Name",
        label: "Idea name",
        type: "text",
        placeholder: "A short, specific name for the idea",
        required: true,
      },
      {
        id: "companyName",
        number: "Co.",
        label: "Company name",
        type: "text",
        required: true,
      },
      {
        id: "patentabilitySearch",
        number: "A",
        label: "Should a patentability search be made?",
        hint: "A search to determine if others have already publicly disclosed or used the invention.",
        type: "yesno",
        required: true,
      },
      {
        id: "freedomToOperate",
        number: "B",
        label: "Should a freedom-to-operate search be made?",
        hint: "A search to determine if others’ patents would be infringed by Scotiabank exploiting the invention.",
        type: "yesno",
        required: true,
      },
      {
        id: "priorFilings",
        number: "1",
        label:
          "Have patent applications or industrial designs related to this invention already been filed in Canada or elsewhere?",
        hint: "If yes, include application numbers.",
        type: "textarea",
        rows: 3,
        placeholder: "No, or list countries and application numbers",
        required: true,
      },
      {
        id: "ownerLicensee",
        number: "1a",
        label: "Who will own or license the invention?",
        type: "text",
        placeholder: "e.g. The Bank of Nova Scotia",
        required: true,
      },
      {
        id: "entityType",
        number: "2",
        label: "Is Scotiabank or a potential licensee any of the following?",
        type: "checkbox",
        options: [
          { value: "over500", label: "A company with more than 500 employees" },
          { value: "charity", label: "A charity" },
          { value: "university", label: "A university" },
        ],
      },
      {
        id: "outsideContractors",
        number: "3",
        label:
          "Were outside contractors, students, a university, or an outside company involved with the invention?",
        hint: "If so, provide contact information.",
        type: "textarea",
        rows: 3,
        placeholder: "No, or list names and contacts",
        required: true,
      },
      {
        id: "outsideFunding",
        number: "3a",
        label:
          "Was the work funded by anyone other than Scotiabank (government grant, university, another company, joint venture)?",
        hint: "If so, provide details including the agreement under which funding was granted.",
        type: "textarea",
        rows: 3,
        required: true,
      },
      {
        id: "internalProject",
        number: "6",
        label:
          "Name of the internal company project, if any, or product to which the invention relates",
        type: "text",
      },
    ],
  },
  {
    id: "timeline",
    title: "Timeline and records",
    eyebrow: "Section 2 of 7",
    description:
      "Conception and reduction-to-practice dates matter. Keep dated records. Notes from the disclosure form are shown under each question.",
    questions: [
      {
        id: "conceptionDate",
        number: "7",
        label: "Date when you first had the idea which led to the invention",
        hint: "This is the date of conception: when a definite and permanent idea of the complete and operative invention was formed. Keep research logs and internal notes.",
        type: "date",
        required: true,
      },
      {
        id: "reductionDate",
        number: "8",
        label:
          "Date, if any, when the idea was first reduced to a working physical embodiment",
        hint: "Date of actual reduction to practice — when the concept was embodied in a workable physical (or implemented) form.",
        type: "date",
      },
      {
        id: "reverseEngineer",
        number: "9",
        label:
          "Can the invention be reverse engineered? If not, could it be maintained as a trade secret?",
        type: "textarea",
        rows: 3,
        required: true,
      },
      {
        id: "firstDescriptionDate",
        number: "17",
        label: "Date of first written description or drawings",
        type: "date",
      },
      {
        id: "signedDated",
        number: "18",
        label: "Are the first written description and drawings signed and dated?",
        type: "yesno",
      },
      {
        id: "labRecords",
        number: "19",
        label:
          "The invention is also described in lab book / additional identified records",
        type: "text",
        placeholder: "Lab book number, Confluence page, repository, ticket IDs",
      },
      {
        id: "customerRequested",
        number: "20",
        label:
          "Was the invention requested by a customer, distributor, or other person not employed by Scotiabank?",
        hint: "If so, who requested it?",
        type: "textarea",
        rows: 2,
      },
      {
        id: "thirdPartyProduct",
        number: "21",
        label:
          "Did you use or incorporate a product or process made by another when inventing this?",
        type: "textarea",
        rows: 2,
      },
    ],
  },
  {
    id: "disclosure",
    title: "Public disclosure and use",
    eyebrow: "Section 3 of 7",
    description:
      "Publication can occur by sharing a description with a single member of the public without confidentiality. Sales, demos, and papers all count. This is a core screening factor.",
    questions: [
      {
        id: "disclosedAnyone",
        number: "10",
        label: "Has the invention been disclosed to anyone? If so, when and where?",
        hint: "A disclosure may be oral, written, electronic, a demo, or a sale.",
        type: "textarea",
        rows: 3,
        required: true,
      },
      {
        id: "disclosedToWhom",
        number: "10a",
        label: "To whom has the invention been disclosed?",
        type: "textarea",
        rows: 2,
        required: true,
      },
      {
        id: "writtenPublication",
        number: "11",
        label: "Has any part of the invention been described in a written publication?",
        hint: "If yes, include when.",
        type: "textarea",
        rows: 2,
        required: true,
      },
      {
        id: "plannedPublication",
        number: "12",
        label: "Are there any plans for written publication describing the invention?",
        hint: "If yes, include the planned date.",
        type: "textarea",
        rows: 2,
        required: true,
      },
      {
        id: "shownOrSold",
        number: "13",
        label:
          "Has any part of the invention been published, shown, announced, offered for sale, or sold?",
        hint: "If so, when, where, and to whom?",
        type: "textarea",
        rows: 3,
        required: true,
      },
      {
        id: "plannedMarketing",
        number: "14",
        label:
          "Are there any plans for publishing, marketing, showing, announcing, offering, or selling?",
        hint: "If yes, include the planned date.",
        type: "textarea",
        rows: 2,
        required: true,
      },
      {
        id: "offerForSale",
        number: "15",
        label: "Has there been an offer for sale? If so, when, where, and to whom?",
        hint: "Confidentiality of a sale is irrelevant for this question.",
        type: "textarea",
        rows: 2,
        required: true,
      },
      {
        id: "usedAnywhere",
        number: "16",
        label: "Has the invention been used anywhere? If so, when and where?",
        type: "textarea",
        rows: 2,
        required: true,
      },
    ],
  },
  {
    id: "invention",
    title: "The invention",
    eyebrow: "Section 4 of 7",
    description:
      "Describe what is new, why it is better, how parts work together, and what is old. Do not limit yourself to one prototype. Methods and processes are patentable as well as systems.",
    questions: [
      {
        id: "problemsSolved",
        number: "23",
        label: "Identify the problems solved by the invention or idea",
        hint: "Describe current problems, difficulties, and drawbacks of known approaches (cumbersome, expensive, prone to failure, inefficient).",
        type: "textarea",
        rows: 6,
        required: true,
      },
      {
        id: "howOvercomes",
        number: "24",
        label:
          "Describe how the invention overcomes those problems, how it was discovered, and any other uses (even in unrelated fields)",
        type: "textarea",
        rows: 6,
        required: true,
      },
      {
        id: "structureOperation",
        number: "25",
        label:
          "Describe the structure, construction or fabrication, and operation of the invention",
        hint: "Include schematic figures, block diagrams, flowcharts, and specific implementation detail. For software, describe hardware/software, data stored or transformed, and any physical-world effect. Explain why a computer is required.",
        type: "textarea",
        rows: 8,
        required: true,
      },
      {
        id: "alternativeDesigns",
        number: "26",
        label:
          "Can you think of any other way to obtain the advantages of this feature with a different design? If so, how?",
        type: "textarea",
        rows: 5,
      },
      {
        id: "additionalFunding",
        number: "26a",
        label: "If you had additional funding, how would you change or improve the invention?",
        type: "textarea",
        rows: 4,
      },
    ],
  },
  {
    id: "prior-art",
    title: "Prior art and competition",
    eyebrow: "Section 5 of 7",
    description:
      "It is as important to point out what is not part of your invention as it is to explain what is new. Name competing technology and who owns it.",
    questions: [
      {
        id: "priorSolutions",
        number: "27",
        label:
          "Identify prior solutions to the problems, if any, and their disadvantages. If none, describe existing technology.",
        hint: "Include Company or competitive products, publications, and patents — commercialized or not.",
        type: "textarea",
        rows: 6,
        required: true,
      },
      {
        id: "competingTech",
        number: "28",
        label:
          "What technology would compete with the invention? Who manufactures, sells, or owns it? How is this invention better or different?",
        type: "textarea",
        rows: 5,
        required: true,
      },
      {
        id: "advantages",
        number: "29",
        label:
          "Identify advantages and differences of the invention over what has been tried or is already known",
        hint: "Avoid saying it is simply “better”. Explain why, and what specifically makes it different.",
        type: "textarea",
        rows: 6,
        required: true,
      },
      {
        id: "similarPatents",
        number: "22",
        label:
          "Are you aware of any patents, documents, or other information that disclose a similar product or process?",
        type: "textarea",
        rows: 3,
        required: true,
      },
      {
        id: "detectUse",
        number: "32",
        label:
          "Describe how Scotiabank would detect use of the invention by competitors or other third parties",
        type: "textarea",
        rows: 4,
      },
    ],
  },
  {
    id: "business",
    title: "Business case and screening",
    eyebrow: "Section 6 of 7",
    description:
      "These answers feed the six-factor scoring model: novelty, development, public disclosure, revenue, reputation, and competitor copy risk.",
    questions: [
      {
        id: "category",
        number: "S1",
        label: "What category does this idea fall into?",
        type: "select",
        required: true,
        options: [
          { value: "ai", label: "AI / machine learning" },
          { value: "blockchain", label: "Blockchain / distributed ledger" },
          { value: "uiux", label: "UI / UX" },
          { value: "payments", label: "Payments / money movement" },
          { value: "risk", label: "Risk, fraud, or compliance" },
          { value: "data", label: "Data, analytics, or infrastructure" },
          { value: "process", label: "Process, operations, or other" },
        ],
      },
      {
        id: "plainLanguageIdea",
        number: "S2",
        label: "Describe the idea in plain language",
        hint: "Assume the reader is not on your team.",
        type: "textarea",
        rows: 4,
        required: true,
      },
      {
        id: "filingPurpose",
        number: "22a",
        label: "What is the business purpose for filing a patent application?",
        hint: "For example: to sue others, to block competitors, marketing of a product or service, obtaining funding or grants.",
        type: "textarea",
        rows: 3,
        required: true,
      },
      {
        id: "costsAssessed",
        number: "22b",
        label:
          "Have the expected development costs, potential revenue, and similar economics been assessed?",
        type: "textarea",
        rows: 3,
        required: true,
      },
      {
        id: "revenueImpact",
        number: "S3",
        label:
          "Will annual revenue from the improvement likely exceed $1 million CAD?",
        type: "radio",
        required: true,
        options: [
          { value: "yes", label: "Yes — likely above $1 million annually" },
          { value: "maybe", label: "Possibly — depends on adoption" },
          { value: "no", label: "No — likely below $1 million" },
          { value: "unknown", label: "Not yet assessed" },
        ],
      },
      {
        id: "revenueDetail",
        number: "S3a",
        label: "Explain the revenue or cost-save opportunity",
        type: "textarea",
        rows: 3,
        required: true,
      },
      {
        id: "reputationHelp",
        number: "S4",
        label: "Will this likely help Scotiabank’s reputation?",
        type: "radio",
        required: true,
        options: [
          { value: "yes", label: "Yes — clearly brand-positive" },
          { value: "somewhat", label: "Somewhat — incremental brand value" },
          { value: "neutral", label: "Neutral / internal only" },
          { value: "no", label: "No — limited or negative reputational effect" },
        ],
      },
      {
        id: "reputationDetail",
        number: "S4a",
        label: "How would this help (or not help) Scotiabank’s reputation?",
        type: "textarea",
        rows: 3,
        required: true,
      },
      {
        id: "competitorCopy",
        number: "S5",
        label: "Would a competitor likely want to copy it?",
        type: "radio",
        required: true,
        options: [
          { value: "yes", label: "Yes — competitors would want this" },
          { value: "possibly", label: "Possibly — some would" },
          { value: "no", label: "No — unlikely to be copied" },
        ],
      },
      {
        id: "productIntent",
        number: "30",
        label:
          "Is the invention currently intended for incorporation into any Scotiabank product or service?",
        hint: "If yes, provide details including expected release date.",
        type: "textarea",
        rows: 4,
        required: true,
      },
      {
        id: "competitorsWant",
        number: "31",
        label:
          "Which competitors would likely want to use this invention? How might they redesign it to avoid copying (include inferior versions)?",
        type: "textarea",
        rows: 5,
        required: true,
      },
    ],
  },
  {
    id: "affirmation",
    title: "Inventor affirmation",
    eyebrow: "Section 7 of 7",
    description:
      "You affirm that, to the best of your knowledge, this disclosure describes an original invention and that all persons who might claim ownership are identified.",
    questions: [],
  },
];

export const REQUIRED_IDS = SECTIONS.flatMap((section) =>
  section.questions.filter((q) => q.required).map((q) => q.id),
);

export function findQuestion(id: string) {
  for (const section of SECTIONS) {
    const match = section.questions.find((q) => q.id === id);
    if (match) return { section, question: match };
  }
  return null;
}
