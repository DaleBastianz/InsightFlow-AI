import { NextRequest, NextResponse } from "next/server";
import { runAiProcessingPipeline, type PipelineInput } from "@/services/ai-pipeline";

export const runtime = "nodejs";
// AI pipeline can take a while with multiple agents
export const maxDuration = 120;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as PipelineInput;

    if (!body.content || typeof body.content !== "string") {
      return NextResponse.json({ error: "Content is required." }, { status: 400 });
    }

    const result = await runAiProcessingPipeline(body);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "The pipeline could not be completed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
