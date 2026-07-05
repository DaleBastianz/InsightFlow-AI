export type ParseSource = "file" | "url" | "text";

async function parsePdf(buffer: Buffer): Promise<string> {
  const pdfParse = await import("pdf-parse");
  const parseFn = typeof pdfParse === "function" ? pdfParse : (pdfParse.default || pdfParse);
  if (typeof parseFn !== "function") {
    throw new Error("pdf-parse did not resolve to a function.");
  }
  const data = await parseFn(buffer);
  return data.text.trim();
}

export async function parseDocumentFromBuffer(buffer: Buffer, fileName: string, mimeType: string): Promise<string> {
  const extension = fileName.split(".").pop()?.toLowerCase() ?? "";
  const normalizedMime = mimeType.toLowerCase();

  if (normalizedMime.includes("pdf") || extension === "pdf") {
    return parsePdf(buffer);
  }

  if (normalizedMime.includes("officedocument") || extension === "docx") {
    const mammoth = await import("mammoth");
    const result = await mammoth.extractRawText({ buffer });
    return result.value.trim();
  }

  if (normalizedMime.includes("text") || ["txt", "md", "markdown"].includes(extension)) {
    return buffer.toString("utf-8").trim();
  }

  throw new Error("Unsupported file type. Please use PDF, DOCX, TXT, or Markdown.");
}

export async function parseTextContent(text: string): Promise<string> {
  return text.trim();
}
