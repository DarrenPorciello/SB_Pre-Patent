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
