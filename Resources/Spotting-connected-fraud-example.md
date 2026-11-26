# Spotting connected fraud — example questions and answers

## Idea name and ownership

**Idea name**  
Spotting connected fraud before a card payment goes through

**Company name**  
Scotiabank

**Should a patentability search be made?**  
Yes

**Should a freedom-to-operate search be made?**  
Yes

**Have patent applications or industrial designs related to this invention already been filed in Canada or elsewhere?**  
No. Nothing related has been filed in Canada or anywhere else.

**Who will own or license the invention?**  
The Bank of Nova Scotia

**Is Scotiabank or a potential licensee any of the following?**  
A company with more than 500 employees

**Were outside contractors, students, a university, or an outside company involved with the invention?**  
No. This was done by Scotiabank people on the fraud team.

**Was the work funded by anyone other than Scotiabank (government grant, university, another company, joint venture)?**  
No. Scotiabank paid for the work. No grant, university, or outside company was involved.

**Name of the internal company project, if any, or product to which the invention relates**  
Card fraud tools

## Timeline and records

**Date when you first had the idea which led to the invention**  
2025-11-12

**Date, if any, when the idea was first reduced to a working physical embodiment**  
2026-03-18

**Can the invention be reverse engineered? If not, could it be maintained as a trade secret?**  
Someone watching our yes/no/extra-check decisions might guess how we score risk. That makes a trade secret hard to keep, so a patent is the better option.

**Date of first written description or drawings**  
2025-12-02

**Are the first written description and drawings signed and dated?**  
Yes

**The invention is also described in lab book / additional identified records**  
Team notes and a working demo on our internal wiki.

**Was the invention requested by a customer, distributor, or other person not employed by Scotiabank?**  
No. We came up with it after a wave of fake-account fraud in late 2025.

**Did you use or incorporate a product or process made by another when inventing this?**  
No. We did not build this on top of another company’s fraud product.

## Public disclosure and use

**Has the invention been disclosed to anyone? If so, when and where?**  
No. Only shared inside the Bank with the fraud team and two product managers.

**To whom has the invention been disclosed?**  
Scotiabank colleagues on the fraud team. No vendors, customers, or conferences.

**Has any part of the invention been described in a written publication?**  
No.

**Are there any plans for written publication describing the invention?**  
No. We are not planning a paper, blog, or talk before a filing decision.

**Has any part of the invention been published, shown, announced, offered for sale, or sold?**  
No.

**Are there any plans for publishing, marketing, showing, announcing, offering, or selling?**  
No outside marketing until we know if we are filing.

**Has there been an offer for sale? If so, when, where, and to whom?**  
No.

**Has the invention been used anywhere? If so, when and where?**  
Yes, but only in a closed Scotiabank test in Canada, starting March 2026. The public cannot see it.

## The invention

**Identify the problems solved by the invention or idea**  
Today we often decide if a card payment is fraud using fixed rules or a score that looks at that one purchase. That misses groups of people working together. We also sometimes block good customers. Other tools that look at connections between accounts usually run overnight, so the bad payment has already gone through.

**Describe how the invention overcomes those problems, how it was discovered, and any other uses (even in unrelated fields)**  
This idea looks at who is connected to the card, the phone, the store, and the account while the payment is still being approved — in about the time it takes to tap a card. We noticed the gap when overnight reports flagged fraud rings the next day, after the money was already gone. The same approach could help with e-transfers and wires later.

**Describe the structure, construction or fabrication, and operation of the invention**  
When a card is used, the system quickly checks recent links: same phone, same store, same account, similar cards. If those links look like a fraud ring, we can approve, ask for an extra check, or decline before the purchase finishes. A computer is needed because this happens thousands of times a minute. The real-world result is the payment going through, being challenged, or being stopped.

**Can you think of any other way to obtain the advantages of this feature with a different design? If so, how?**  
We could add more fields to the old scoring model, but that still would not see a group of connected accounts. We could wait overnight to map connections, but then the payment is already done. We could only look at the store, which is simpler, but easier for fraudsters to get around.

**If you had additional funding, how would you change or improve the invention?**  
With more time and money we would cover other countries and add e-transfer and wire payments.

## Prior art and competition

**Identify prior solutions to the problems, if any, and their disadvantages. If none, describe existing technology.**  
Banks usually use rule lists, a score on a single payment, or an overnight report of linked accounts. Those are slow to update, they decline too many good customers, and they miss organized fraud until the next day. Other vendors do similar things, but not a connection check while the payment is still waiting.

**What technology would compete with the invention? Who manufactures, sells, or owns it? How is this invention better or different?**  
Common fraud tools from other vendors, plus each bank’s own rules. Ours is different because it checks the web of connections during the payment, not after.

**Identify advantages and differences of the invention over what has been tried or is already known**  
It should catch fraud rings sooner and decline fewer honest customers. The new part is checking connections in the few seconds (or less) while the tap or swipe is still being approved.

**Are you aware of any patents, documents, or other information that disclose a similar product or process?**  
I have not seen a patent that covers checking linked accounts during the card approval itself. A search is still worth doing.

**Describe how Scotiabank would detect use of the invention by competitors or other third parties**  
If a competitor started declining or extra-checking the same kinds of linked payments, or advertised “instant connection checks,” we would likely notice in their product materials and in how stores talk about declines.

## Business case and screening

**What category does this idea fall into?**  
AI / machine learning

**Describe the idea in plain language**  
Before a card payment is approved, look at who and what is connected to it so we can stop a fraud ring right away instead of finding it tomorrow.

**What is the business purpose for filing a patent application?**  
Stop other banks from copying this, protect a useful payments tool, and show clients we are serious about catching fraud without blocking real shoppers.

**Have the expected development costs, potential revenue, and similar economics been assessed?**  
Yes. We sketched costs vs. money saved from less fraud and fewer wrongly blocked purchases.

**Will annual revenue from the improvement likely exceed $1 million CAD?**  
Yes — likely above $1 million annually

**Explain the revenue or cost-save opportunity**  
From the early 2026 test, we expect more than $1 million CAD a year in Canada from less fraud and from purchases that would have been wrongly declined.

**Will this likely help Scotiabank’s reputation?**  
Yes — clearly brand-positive

**How would this help (or not help) Scotiabank’s reputation?**  
Clients trust us more if we stop fraud without constantly locking their cards for no reason.

**Would a competitor likely want to copy it?**  
Yes — competitors would want this

**Is the invention currently intended for incorporation into any Scotiabank product or service?**  
Yes. We want this in our card fraud tools. A small live test in late 2026, then a wider Canadian rollout in 2027.

**Which competitors would likely want to use this invention? How might they redesign it to avoid copying (include inferior versions)?**  
Other big Canadian banks and large U.S. card issuers would want this. They might copy a slower overnight version or only look at the store, which would work less well.

## Inventors

**Inventor 1**  
Name: Jordan Hale  
Email: jordan.hale@example.com  
Address: 123 Demonstration Street, Toronto ON M5V 0A0  
Residency: Canada  
Nationality: Canadian  
Scotiabank employee: Yes  
Outside funding: No

**Inventor 2**  
Name: Maya Chen  
Email: maya.chen@example.com  
Address: 123 Demonstration Street, Toronto ON M5V 0A0  
Residency: Canada  
Nationality: Canadian  
Scotiabank employee: Yes  
Outside funding: No

## Affirmation

**Name**  
Jordan Hale

**Email**  
jordan.hale@example.com

**Typed signature**  
Jordan Hale

**Date**  
2026-09-08
