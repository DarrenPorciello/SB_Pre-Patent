# Scotiabank Pre-Patent Screening

Internal tool for Scotiabank employees to file a confidential invention disclosure, get a six-factor pre-patent score, and decide whether an idea should go to executive sponsorship and IP counsel.

The screening agent scores:

- Novelty (38%)
- Prior public disclosure (18%)
- Revenue opportunity (14%)
- How developed the idea is (12%)
- Competitor copy-risk (12%)
- Helping Scotiabank’s reputation (6%)

Overall is a weighted average of those scores. High is 72+, Medium is 42–71, Low is below 42. If prior public disclosure is under 35, overall cannot be High.

## How to run

You need Node.js 18 or later.

```bash
npm install
```

Create `.env.local` in the project root (use `.env.example` as a template):

```
OPENAI_API_KEY=sk-your-key-here
OPENAI_AGENT_ID=agent_your-id-here
OPENAI_WEB_AGENT_ID=agent_your-web-id-here
```

`OPENAI_API_KEY` is required. The agent IDs are optional; without them the app still scores using the inline agent.

Start the app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Production build:

```bash
npm run build
npm start
```

Do not commit `.env.local`. It is gitignored.

## What you can do in the app

- Start a new disclosure. Each one gets a 6-digit patent ID. Write it down; you need it to come back.
- Search that ID on the home page. An unfinished disclosure opens the form. A scored one opens the results.
- On page 1, use **Examples** to fill **Clarix** or **Connected fraud**.
- Submit for screening (form only) or submit with web search. The OpenAI agent scores every category. There is no local-rules fallback.
- Download a PDF of the disclosure and scores.

Patents are stored in this browser only (localStorage), not on a shared server.

## Admin

The user icon in the bottom-right opens admin sign-in.

- Username: `username`
- Password: `password`

Admin mode adds **Existing patents**: list, status (incomplete / scored–pending review / approved / denied), and delete with confirmation. The same icon returns to user mode.

## Codebase

| Path | What it is |
| --- | --- |
| `app/` | Next.js App Router pages: home, `/apply`, `/results`, `/patents`, and `POST /api/score` |
| `components/` | UI: disclosure wizard, search, admin menu, language toggle |
| `lib/questions.ts` | Disclosure form sections and required fields |
| `lib/example.ts` | Clarix and connected-fraud example data |
| `lib/openai-agent.ts` | Calls the OpenAI agent and normalizes scores |
| `lib/agent-instructions.ts` | Agent prompts (form-only and web search) |
| `lib/sessions.ts` | Patent IDs, localStorage, admin review/delete |
| `lib/pdf.ts` | Disclosure PDF export |
| `lib/i18n.ts` | English and Spanish copy |
| `Resources/` | Source PDFs (Clarix disclosure, scoring notes) |

Stack: Next.js 15, React 19, TypeScript, Tailwind CSS, jsPDF.
