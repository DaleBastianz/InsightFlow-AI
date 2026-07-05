import { NextRequest, NextResponse } from "next/server";
import { parseDocumentFromBuffer } from "@/lib/document-service";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File is too large. Maximum size is 10MB." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const text = await parseDocumentFromBuffer(buffer, file.name, file.type);

    return NextResponse.json({ text });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unable to parse file.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
