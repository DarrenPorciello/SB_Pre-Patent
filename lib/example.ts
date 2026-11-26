import type { DisclosureState } from "./types";

export const EXAMPLE_DISCLOSURE: DisclosureState = {
  answers: {
    companyName: "Scotiabank",
    patentabilitySearch: "yes",
    freedomToOperate: "yes",
    priorFilings:
      "No. Nothing related has been filed in Canada or anywhere else.",
    ownerLicensee: "The Bank of Nova Scotia",
    entityType: ["over500"],
    outsideContractors:
      "No. This was done by Scotiabank people on the fraud team.",
    outsideFunding:
      "No. Scotiabank paid for the work. No grant, university, or outside company was involved.",
    title: "Spotting connected fraud before a card payment goes through",
    internalProject: "Card fraud tools",
    conceptionDate: "2025-11-12",
    reductionDate: "2026-03-18",
    reverseEngineer:
      "Someone watching our yes/no/extra-check decisions might guess how we score risk. That makes a trade secret hard to keep, so a patent is the better option.",
    firstDescriptionDate: "2025-12-02",
    signedDated: "yes",
    labRecords: "Team notes and a working demo on our internal wiki.",
    customerRequested:
      "No. We came up with it after a wave of fake-account fraud in late 2025.",
    thirdPartyProduct:
      "No. We did not build this on top of another company’s fraud product.",
    disclosedAnyone:
      "No. Only shared inside the Bank with the fraud team and two product managers.",
    disclosedToWhom:
      "Scotiabank colleagues on the fraud team. No vendors, customers, or conferences.",
    writtenPublication: "No.",
    plannedPublication: "No. We are not planning a paper, blog, or talk before a filing decision.",
    shownOrSold: "No.",
    plannedMarketing: "No outside marketing until we know if we are filing.",
    offerForSale: "No.",
    usedAnywhere:
      "Yes, but only in a closed Scotiabank test in Canada, starting March 2026. The public cannot see it.",
    problemsSolved:
      "Today we often decide if a card payment is fraud using fixed rules or a score that looks at that one purchase. That misses groups of people working together. We also sometimes block good customers. Other tools that look at connections between accounts usually run overnight, so the bad payment has already gone through.",
    howOvercomes:
      "This idea looks at who is connected to the card, the phone, the store, and the account while the payment is still being approved — in about the time it takes to tap a card. We noticed the gap when overnight reports flagged fraud rings the next day, after the money was already gone. The same approach could help with e-transfers and wires later.",
    structureOperation:
      "When a card is used, the system quickly checks recent links: same phone, same store, same account, similar cards. If those links look like a fraud ring, we can approve, ask for an extra check, or decline before the purchase finishes. A computer is needed because this happens thousands of times a minute. The real-world result is the payment going through, being challenged, or being stopped.",
    alternativeDesigns:
      "We could add more fields to the old scoring model, but that still would not see a group of connected accounts. We could wait overnight to map connections, but then the payment is already done. We could only look at the store, which is simpler, but easier for fraudsters to get around.",
    additionalFunding:
      "With more time and money we would cover other countries and add e-transfer and wire payments.",
    priorSolutions:
      "Banks usually use rule lists, a score on a single payment, or an overnight report of linked accounts. Those are slow to update, they decline too many good customers, and they miss organized fraud until the next day. Other vendors do similar things, but not a connection check while the payment is still waiting.",
    competingTech:
      "Common fraud tools from other vendors, plus each bank’s own rules. Ours is different because it checks the web of connections during the payment, not after.",
    advantages:
      "It should catch fraud rings sooner and decline fewer honest customers. The new part is checking connections in the few seconds (or less) while the tap or swipe is still being approved.",
    similarPatents:
      "I have not seen a patent that covers checking linked accounts during the card approval itself. A search is still worth doing.",
    detectUse:
      "If a competitor started declining or extra-checking the same kinds of linked payments, or advertised “instant connection checks,” we would likely notice in their product materials and in how stores talk about declines.",
    category: "ai",
    plainLanguageIdea:
      "Before a card payment is approved, look at who and what is connected to it so we can stop a fraud ring right away instead of finding it tomorrow.",
    filingPurpose:
      "Stop other banks from copying this, protect a useful payments tool, and show clients we are serious about catching fraud without blocking real shoppers.",
    costsAssessed:
      "Yes. We sketched costs vs. money saved from less fraud and fewer wrongly blocked purchases.",
    revenueImpact: "yes",
    revenueDetail:
      "From the early 2026 test, we expect more than $1 million CAD a year in Canada from less fraud and from purchases that would have been wrongly declined.",
    reputationHelp: "yes",
    reputationDetail:
      "Clients trust us more if we stop fraud without constantly locking their cards for no reason.",
    competitorCopy: "yes",
    productIntent:
      "Yes. We want this in our card fraud tools. A small live test in late 2026, then a wider Canadian rollout in 2027.",
    competitorsWant:
      "Other big Canadian banks and large U.S. card issuers would want this. They might copy a slower overnight version or only look at the store, which would work less well.",
  },
  inventors: [
    {
      id: "example-inv-1",
      name: "Jordan Hale",
      email: "jordan.hale@example.com",
      address: "123 Demonstration Street, Toronto ON M5V 0A0",
      residency: "Canada",
      nationality: "Canadian",
      employee: "yes",
      outsideFunding: "no",
    },
    {
      id: "example-inv-2",
      name: "Maya Chen",
      email: "maya.chen@example.com",
      address: "123 Demonstration Street, Toronto ON M5V 0A0",
      residency: "Canada",
      nationality: "Canadian",
      employee: "yes",
      outsideFunding: "no",
    },
  ],
  signature: {
    name: "Jordan Hale",
    email: "jordan.hale@example.com",
    typedSignature: "Jordan Hale",
    date: "2026-09-08",
  },
};

export const CLARIX_DISCLOSURE: DisclosureState = {
  answers: {
    companyName: "Scotiabank",
    patentabilitySearch: "yes",
    freedomToOperate: "yes",
    priorFilings: "Unknown",
    ownerLicensee: "Scotiabank",
    entityType: ["over500"],
    outsideContractors: "No",
    outsideFunding: "No",
    title: "Clarix - Conversational Credit Risk Intelligence",
    internalProject: "SAS Innovation Lab",
    conceptionDate: "2026-04-14",
    reductionDate: "2026-07-01",
    reverseEngineer: "Yes",
    firstDescriptionDate: "2026-04-14",
    signedDated: "no",
    labRecords: "N/A",
    customerRequested: "No",
    thirdPartyProduct: "Yes",
    disclosedAnyone: "Yes, at Scotiabank",
    disclosedToWhom: "Scotiabank employees",
    writtenPublication: "No",
    plannedPublication: "No",
    shownOrSold: "No",
    plannedMarketing: "No",
    offerForSale: "No",
    usedAnywhere: "No",
    problemsSolved:
      "Credit-risk reporting and analysis currently involve significant manual and fragmented work. The current state includes manual documentation, with 70–80% of documentation maintained manually and often refreshed only when requested; multiple days spent reconstructing logic, rules and lineage for an audit or risk inquiry; duplicate logic across reports and teams; high technical dependency for routine data questions; and operational-risk exposure caused by static documentation, manual ingestion steps and limited end-to-end traceability. Clarix addresses the problem of providing governed credit-risk analysis through a conversational interface while preserving the data scope, calculation governance, source attribution and limitations required for controlled analytical use. It is designed to operate only against user-provided, uploaded or approved connected data and to indicate when supporting evidence is unavailable. The problem is therefore not simply how to generate natural-language answers. It is how to translate a natural-language analytical question into a governed analytical process that resolves the requested metric, time, geography, segment and permitted data scope; obtains the analytical computation from curated reporting data; and returns findings together with supporting sources, filters and limitations.",
    howOvercomes:
      "Clarix uses a governed question-to-answer process. A user asks an analytical question in natural language. Clarix interprets the request and resolves the metric, period, geography, segment and approved data scope. If integrated with Databricks, then we can run governed queries against curated reporting tables. Clarix returns the resulting findings together with drivers, source tables, filters and limitations. A significant design characteristic is the separation of conversational reasoning from quantitative computation. In the documented architecture, Databricks SQL performs analytical computation using curated Gold-layer data products rather than relying on the language model itself to generate or calculate portfolio metrics. The system is also grounded by design. It is intended to use only user-provided, uploaded or approved connected data and to state when evidence is unavailable. Outputs can include plain-language insights, source references, chart-ready tables, charts, assumptions and limitations. Clarix was discovered as there were significant technical and administrative challenges to building a similar solution with SAS Viya due to critical features being unavailable. Investigation to find an alternative solution within the bank’s existing technology stack led to the design of Clarix. The same solution pattern can be extended beyond mortgage analysis to cards, collections, recoveries and any other products and reports.",
    structureOperation:
      "1. User interaction layer. Microsoft Teams is the documented user-facing entry point, permitting users to interact with Clarix conversationally without directly accessing Databricks. 2. Conversational orchestration layer. Copilot Studio receives/interprets the question, identifies the required action, and applies Clarix's response instructions and controls. 3. Secure intermediary layer. A secure API layer connects the conversational system to Databricks and enforces authentication, approved query policies, logging and consistent result formatting before information is returned. 4. Analytical computation layer. Databricks SQL executes analytical computation on curated Gold-layer data products. The architecture deliberately assigns portfolio calculation to this governed analytical layer rather than asking the language model to calculate the portfolio metrics itself. 5. Governance layer. Universal Catalog supplies permissions, metadata, lineage and auditability, enabling responses to be controlled and traced to underlying data. 6. Question-resolution process. For an analytical question, Clarix resolves the metric, requested period, geography, segment and approved data scope. Governed queries then operate against curated reporting tables, after which the answer is formed with findings, identified drivers, source tables, applied filters and limitations. 7. Response controls and grounding. Clarix is designed to operate from provided/uploaded/approved connected information and to indicate when evidence is not available. Outputs can include source references, chart-ready tables, assumptions and limitations. 8. Validation. The documented implementation uses structured QA for both analytical accuracy and responsible-AI behavior. The presentation reports a score of 195/200 and states that none of the tested answers were hallucinated. 9. Deployment architecture. The proposed deployment process proceeds through Foundation, Build, Validate, Pilot and Scale. Foundation defines priority questions, Gold tables, glossary, personas and success measures; Build configures Copilot Studio, secured Databricks actions and response templates; Validate tests factual, calculation, security, performance and hallucination behavior; Pilot publishes to a restricted Teams group and captures feedback and telemetry; and Scale expands use cases, user groups and automated reporting with change controls.",
    alternativeDesigns:
      "The underlying inventive concept should not necessarily be limited to the products used in the present target architecture. Alternative implementations could potentially substitute another conversational user interface for Teams, another orchestration mechanism for Copilot Studio, another controlled API/service layer, or another governed analytical platform for Databricks, provided that the implementation retains the relevant question-resolution, governed-computation, access-control, traceability and evidence-grounding characteristics. An alternative implementation could also expose the functionality through an enterprise web application or analytical portal instead of a chat interface.",
    additionalFunding:
      "Additional investment could be directed toward implementing the documented Scale stage: increasing supported use cases and user groups and extending automated reporting under change controls. The documented architecture also contemplates application of the same solution pattern across mortgages, cards, collections, recoveries and other products and reports.",
    priorSolutions:
      "Existing processes rely heavily on manual documentation, reconstructing logic and lineage to answer inquiries, duplicated reporting logic, and technical specialists for routine questions. Most documentation is maintained manually, audit and risk inquiries can require days of reconstruction, and duplicated logic increases maintenance effort and the likelihood of errors.",
    competingTech:
      "The competing technology would be other LLM powered chatbots integrated with established data platforms. There are a wide range of companies in each domain. Clarix is designed based on Scotiabank’s existing technology vendors so it is easier and quicker to implement.",
    advantages:
      "Clarix integrates conversational analytics with a governed analytical architecture. Instead of treating a language model as the source of portfolio calculations, the documented design assigns analytical computation to Databricks SQL operating against curated Gold-layer data products. Clarix also resolves analytical scope before the calculation, including the metric, period, geography, segment and approved data scope, and returns findings together with source tables, filters and limitations. Governance is incorporated into the architecture through a secure API layer providing authentication, approved query policies, logging and result shaping and through Universal Catalog providing permissions, metadata, lineage and auditability. The documented system is further designed to limit itself to user-provided, uploaded or approved connected information and to indicate when supporting evidence is unavailable. Operationally, the intended benefits are faster answers, increased analyst capacity for deeper investigation, consistent governed metrics, conversational self-service, stronger centralized controls and scalability across additional products and reports.",
    similarPatents: "No",
    detectUse:
      "Unless the use is public, it will be difficult to determine. Potential evidence could therefore include publicly available product documentation, demonstrations, architecture descriptions, technical publications, patent filings or accessible product behavior.",
    category: "risk",
    plainLanguageIdea:
      "Clarix lets a user ask a credit-risk question in ordinary language. It figures out the metric, time period, geography, segment and approved data, then has Databricks calculate the numbers from curated reporting tables. The answer comes back with sources, filters and limitations. The language model does not invent the portfolio numbers.",
    filingPurpose:
      "File to keep other banks from copying this governed conversational credit-risk process, and to protect a tool built on Scotiabank’s existing stack. A patent also supports later use in cards, collections, recoveries, and other reports.",
    costsAssessed: "No",
    revenueImpact: "unknown",
    revenueDetail: "Expected development costs, potential revenue, and similar economics have not been assessed.",
    reputationHelp: "somewhat",
    reputationDetail:
      "Faster, governed answers to credit-risk questions can reduce operational risk and show stronger control over data and calculations, which supports trust with audit, risk, and internal users.",
    competitorCopy: "yes",
    productIntent: "No",
    competitorsWant:
      "A financial services firm could attempt to achieve similar advantages by replacing individual technology layers while retaining the overall workflow, such as substituting a different conversational interface, orchestration technology, API mechanism, governed data platform or metadata/catalog solution. Another potential design-around would combine conversational interpretation and analytical computation in a single layer rather than separating the reasoning/orchestration layer from governed portfolio computation. A simpler implementation could omit some of the documented governance features, such as lineage, centralized query policies, source identification or controlled data scope.",
  },
  inventors: [
    {
      id: "clarix-inv-1",
      name: "Mir Jamiur Rahman",
      email: "",
      address: "",
      residency: "",
      nationality: "",
      employee: "yes",
      outsideFunding: "no",
    },
    {
      id: "clarix-inv-2",
      name: "Anil Iqbal",
      email: "",
      address: "",
      residency: "",
      nationality: "",
      employee: "yes",
      outsideFunding: "no",
    },
  ],
  signature: {
    name: "Mir Jamiur Rahman",
    email: "mir.rahman@example.com",
    typedSignature: "Mir Jamiur Rahman",
    date: "2026-07-15",
  },
};
