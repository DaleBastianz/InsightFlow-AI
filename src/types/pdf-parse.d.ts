declare module "pdf-parse" {
  interface PdfData {
    text: string;
    numpages: number;
    numrender: number;
    info: Record<string, unknown>;
    metadata: Record<string, unknown>;
    version: string;
  }

  type PdfParseFn = (buffer: Buffer, options?: Record<string, unknown>) => Promise<PdfData>;

  const pdfParse: PdfParseFn & { default?: PdfParseFn };
  export default pdfParse;
  export = pdfParse;
}
