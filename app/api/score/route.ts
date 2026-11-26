import { NextResponse } from "next/server";
import { openaiAgentConfigured, scoreWithOpenAIAgent } from "@/lib/openai-agent";
import type { DisclosureState } from "@/lib/types";

export const maxDuration = 180;

export async function POST(request: Request) {
  const body = (await request.json()) as { state?: DisclosureState } & DisclosureState;
  const state = (body.state ?? body) as DisclosureState;

  if (!openaiAgentConfigured()) {
    return NextResponse.json(
      {
        error: "Missing OPENAI_API_KEY in .env.local. Add it, then restart npm run dev.",
      },
      { status: 500 },
    );
  }

  try {
    const result = await scoreWithOpenAIAgent(state);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Screening agent failed.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
