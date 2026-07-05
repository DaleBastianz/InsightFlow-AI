export type ParseSource = "file" | "url" | "text";

export async function parseDocumentFromBuffer(buffer: Buffer, fileName: string, mimeType: string): Promise<string> {
  const extension = fileName.split(".").pop()?.toLowerCase() ?? "";
  const normalizedMime = mimeType.toLowerCase();

  if (normalizedMime.includes("pdf") || extension === "pdf") {
    throw new Error("PDF parsing is handled in the browser. Please upload via the UI.");
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
