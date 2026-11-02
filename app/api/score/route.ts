import { NextResponse } from "next/server";
import { localScore, openaiAgentConfigured, scoreWithOpenAIAgent } from "@/lib/openai-agent";
import type { DisclosureState } from "@/lib/types";

export const maxDuration = 180;

export async function POST(request: Request) {
  const body = (await request.json()) as { state?: DisclosureState; webSearch?: boolean } & DisclosureState;
  const webSearch = Boolean(body.webSearch);
  const state = (body.state ?? body) as DisclosureState;

  if (!openaiAgentConfigured()) {
    return NextResponse.json(
      localScore(
        state,
        "Missing OPENAI_API_KEY in .env.local. Add it, then restart npm run dev.",
        webSearch ? "web" : "disclosure-only",
      ),
    );
  }

  try {
    const result = await scoreWithOpenAIAgent(state, webSearch);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Screening agent failed.";
    return NextResponse.json(
      localScore(state, message, webSearch ? "web" : "disclosure-only"),
    );
  }
}
