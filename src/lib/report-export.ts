import { jsPDF } from "jspdf";
import type { PipelineOutput } from "@/services/ai-pipeline";

export interface ReportExportData {
  title: string;
  pipeline: PipelineOutput;
  generatedAt?: Date;
}

interface ReportPayload {
  title: string;
  generatedAt: string;
  executiveSummary: string;
  keyInsights: string[];
  weakClaims: Array<{ claim?: string; reason?: string }>;
  recommendations: Array<{ recommendation?: string }>;
  confidenceScore: number;
  humanReview: string;
}

function buildPayload({ title, pipeline, generatedAt = new Date() }: ReportExportData): ReportPayload {
  const summary = (pipeline.summaryGenerator?.data?.summary as string | undefined) || "No summary available.";
  const insights = (pipeline.researchAnalyzer?.data?.keyFindings as string[] | undefined) || [];
  const weakClaims = (pipeline.weakClaimDetector?.data?.weakClaims as Array<{ claim?: string; reason?: string }> | undefined) || [];
  const recommendations = (pipeline.recommendationGenerator?.data?.recommendations as Array<{ recommendation?: string }> | undefined) || [];
  const confidence = Number(pipeline.confidenceScorer?.data?.overallConfidence ?? 0);
  const humanReview = (pipeline.humanReviewDecision?.data?.decision as string | undefined) || "Needs review";

  return {
    title,
    generatedAt: generatedAt.toLocaleString(),
    executiveSummary: summary,
    keyInsights: insights,
    weakClaims,
    recommendations,
    confidenceScore: confidence,
    humanReview,
  };
}

function downloadFile(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function exportReportToMarkdown(data: ReportExportData): string {
  const payload = buildPayload(data);
  return [
    `# ${payload.title}`,
    "",
    `Generated: ${payload.generatedAt}`,
    "",
    "## Executive Summary",
    payload.executiveSummary,
    "",
    "## Key Insights",
    ...payload.keyInsights.map((insight) => `- ${insight}`),
    "",
    "## Weak Claims",
    payload.weakClaims.length ? payload.weakClaims.map((item, index) => `${index + 1}. ${item.claim || "Untitled claim"}: ${item.reason || "No rationale provided."}`).join("\n") : "- None recorded.",
    "",
    "## Recommendations",
    payload.recommendations.length ? payload.recommendations.map((item, index) => `${index + 1}. ${item.recommendation || "Untitled recommendation"}`).join("\n") : "- None recorded.",
    "",
    `## Confidence Score\n${Math.round(payload.confidenceScore * 100)}%`,
    "",
    `## Human Review\n${payload.humanReview}`,
  ].join("\n");
}

export function exportReportToJson(data: ReportExportData): string {
  return JSON.stringify(buildPayload(data), null, 2);
}

export function exportReportToPdf(data: ReportExportData) {
  const payload = buildPayload(data);
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  let y = 60;

  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 110, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.text(payload.title, margin, 48);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(`Prepared for InsightFlow AI • Generated ${payload.generatedAt}`, margin, 72);

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Executive Summary", margin, 140);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  const summaryLines = doc.splitTextToSize(payload.executiveSummary, pageWidth - margin * 2);
  doc.text(summaryLines, margin, 160);
  y = 190;

  const addSection = (title: string, body: string[]) => {
    if (y > pageHeight - 120) {
      doc.addPage();
      y = 60;
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(title, margin, y);
    y += 22;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    body.forEach((line) => {
      const wrapped = doc.splitTextToSize(line, pageWidth - margin * 2);
      doc.text(wrapped, margin, y);
      y += wrapped.length * 14 + 6;
    });
  };

  addSection("Key Insights", payload.keyInsights.length ? payload.keyInsights.map((item) => `• ${item}`) : ["• No key insights available."]);
  addSection("Weak Claims", payload.weakClaims.length ? payload.weakClaims.map((item) => `• ${item.claim || "Untitled claim"}: ${item.reason || "No rationale provided."}`) : ["• None recorded."]);
  addSection("Recommendations", payload.recommendations.length ? payload.recommendations.map((item) => `• ${item.recommendation || "Untitled recommendation"}`) : ["• None recorded."]);

  const footerY = pageHeight - 40;
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(`Confidence Score: ${Math.round(payload.confidenceScore * 100)}%`, margin, footerY - 10);
  doc.text(`Human Review: ${payload.humanReview}`, margin, footerY);

  doc.save(`${payload.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "research-report"}.pdf`);
}

export async function copyReportToClipboard(data: ReportExportData) {
  const markdown = exportReportToMarkdown(data);
  await navigator.clipboard.writeText(markdown);
}

export function downloadMarkdownReport(data: ReportExportData) {
  downloadFile(`${(data.title || "research-report").toLowerCase().replace(/[^a-z0-9]+/g, "-") || "research-report"}.md`, exportReportToMarkdown(data), "text/markdown;charset=utf-8");
}

export function downloadJsonReport(data: ReportExportData) {
  downloadFile(`${(data.title || "research-report").toLowerCase().replace(/[^a-z0-9]+/g, "-") || "research-report"}.json`, exportReportToJson(data), "application/json;charset=utf-8");
}
