import { NextRequest, NextResponse } from "next/server";
import { scrapeWithFirecrawl } from "@/services/firecrawl";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { url?: string };
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "A valid URL is required." }, { status: 400 });
    }

    const result = await scrapeWithFirecrawl(url);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unable to read URL content.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
