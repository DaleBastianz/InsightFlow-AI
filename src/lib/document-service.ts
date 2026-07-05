import mammoth from "mammoth";

export type ParseSource = "file" | "url" | "text";

export async function parseDocumentFromBuffer(buffer: Buffer, fileName: string, mimeType: string): Promise<string> {
  const extension = fileName.split(".").pop()?.toLowerCase() ?? "";
  const normalizedMime = mimeType.toLowerCase();

  if (normalizedMime.includes("pdf") || extension === "pdf") {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const req = eval('require');
    const pdfModule = req("pdf-parse");
    const parseFn = typeof pdfModule === "function" ? pdfModule : (pdfModule.default || pdfModule);
    if (!parseFn || typeof parseFn !== "function") {
        throw new Error("pdf-parse is still not a function.");
    }
    const data = await parseFn(buffer);
    return data.text.trim();
  }

  if (normalizedMime.includes("officedocument") || extension === "docx") {
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
