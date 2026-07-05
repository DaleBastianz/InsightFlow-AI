import { NextRequest, NextResponse } from "next/server";
import { searchWithTavily, type TavilyCategory } from "@/services/tavily";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { topic?: string; category?: TavilyCategory };
    const { topic, category } = body;

    if (!topic || typeof topic !== "string") {
      return NextResponse.json({ error: "A topic is required." }, { status: 400 });
    }

    const results = await searchWithTavily(topic, category ?? "technology");
    return NextResponse.json({ results });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unable to run the search.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
