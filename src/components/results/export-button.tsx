"use client";

import { useState } from "react";
import { FileText, Copy, FileJson, FileDown } from "lucide-react";
import { copyReportToClipboard, downloadJsonReport, downloadMarkdownReport, exportReportToPdf } from "@/lib/report-export";
import type { PipelineOutput } from "@/services/ai-pipeline";

interface ExportButtonProps {
  title?: string;
  pipeline: PipelineOutput;
}

export function ExportButton({ title = "Research Report", pipeline }: ExportButtonProps) {
  const [message, setMessage] = useState<string | null>(null);

  const runExport = async (type: "pdf" | "markdown" | "json" | "clipboard") => {
    setMessage(null);
    try {
      if (type === "pdf") {
        exportReportToPdf({ title, pipeline });
        setMessage("PDF export started.");
        return;
      }

      if (type === "markdown") {
        downloadMarkdownReport({ title, pipeline });
        setMessage("Markdown export downloaded.");
        return;
      }

      if (type === "json") {
        downloadJsonReport({ title, pipeline });
        setMessage("JSON export downloaded.");
        return;
      }

      await copyReportToClipboard({ title, pipeline });
      setMessage("Report copied to clipboard.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Export failed.");
    }
  };

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex flex-wrap gap-2">
        <button onClick={() => void runExport("pdf")} aria-label="Export report as PDF" className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted">
          <FileDown className="h-4 w-4" />
          PDF
        </button>
        <button onClick={() => void runExport("markdown")} aria-label="Export report as Markdown" className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted">
          <FileText className="h-4 w-4" />
          Markdown
        </button>
        <button onClick={() => void runExport("json")} aria-label="Export report as JSON" className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted">
          <FileJson className="h-4 w-4" />
          JSON
        </button>
        <button onClick={() => void runExport("clipboard")} aria-label="Copy report to clipboard" className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted">
          <Copy className="h-4 w-4" />
          Clipboard
        </button>
      </div>
      {message && <p className="text-sm text-muted-foreground">{message}</p>}
    </div>
  );
}
