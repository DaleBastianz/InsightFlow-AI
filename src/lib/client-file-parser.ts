export async function parseFileInBrowser(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  const mime = file.type.toLowerCase();

  if (mime.includes("pdf") || ext === "pdf") {
    return parsePdfInBrowser(file);
  }

  if (mime.includes("officedocument") || ext === "docx") {
    return parseDocxInBrowser(file);
  }

  if (mime.includes("text") || ["txt", "md", "markdown"].includes(ext)) {
    return file.text();
  }

  throw new Error("Unsupported file type. Please use PDF, DOCX, TXT, or Markdown.");
}

async function parsePdfInBrowser(file: File): Promise<string> {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const pages: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const text = content.items.map((item: Record<string, unknown>) => item.str).join(" ");
    pages.push(text);
  }

  return pages.join("\n\n").trim();
}

async function parseDocxInBrowser(file: File): Promise<string> {
  const mammoth = await import("mammoth");
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value.trim();
}
