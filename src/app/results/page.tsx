"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { ExportButton } from "@/components/results/export-button";
import { ResultsDashboard } from "@/components/results/results-dashboard";
import { getResearchReports, type ResearchReportRecord } from "@/lib/supabase-reports";
import { Eye, FileText, BarChart3 } from "lucide-react";
import type { PipelineOutput } from "@/services/ai-pipeline";

function ResultsContent() {
  const searchParams = useSearchParams();
  const reportId = searchParams.get("id");

  const [reports, setReports] = useState<ResearchReportRecord[]>([]);
  const [selectedReport, setSelectedReport] = useState<ResearchReportRecord | null>(null);
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    async function load() {
      const response = await getResearchReports();
      if (response.error) {
        setMessage(response.error);
        return;
      }

      const data = response.data ?? [];
      setReports(data);

      if (reportId) {
        const match = data.find((r) => r.id === reportId);
        if (match) {
          setSelectedReport(match);
          setMessage("");
          return;
        }
        setMessage("Report not found.");
        return;
      }

      setMessage(data.length ? "Select a report to view its analysis." : "No saved reports yet. Run a pipeline on the Upload page first.");
    }
    void load();
  }, [reportId]);

  const pipelineOutput = selectedReport?.pipeline_output as unknown as PipelineOutput | undefined;

  if (selectedReport && pipelineOutput) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link href="/results" className="text-sm text-muted-foreground hover:text-foreground">&larr; Back to reports</Link>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{selectedReport.title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{selectedReport.source_label} &bull; {new Date(selectedReport.created_at ?? Date.now()).toLocaleDateString()}</p>
          </div>
          <ExportButton title={selectedReport.title} pipeline={pipelineOutput} />
        </div>
        <ResultsDashboard pipeline={pipelineOutput} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Results</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">Analysis dashboard</h1>
        <p className="mt-3 max-w-2xl text-base leading-8 text-muted-foreground">
          Review executive summaries, evidence-backed claims, weak points, contradictions, and next steps in a structured dashboard.
        </p>
      </div>

      <div className="rounded-[1.5rem] border border-border/70 bg-card/80 p-4 text-sm text-muted-foreground">
        {message}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {reports.map((report) => {
          const pipeline = report.pipeline_output as unknown as PipelineOutput | undefined;
          const confidence = pipeline?.confidenceScorer?.data?.overallConfidence as number | undefined;

          return (
            <Link key={report.id} href={`/results?id=${report.id}`} className="rounded-[1.5rem] border border-border/70 bg-card/80 p-5 shadow-sm transition hover:bg-card hover:shadow-md">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <FileText className="h-4 w-4 text-primary" />
                {report.title}
              </div>
              <p className="mt-3 text-sm leading-7 text-muted-foreground line-clamp-3">{report.summary}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                  <BarChart3 className="h-3 w-3" />
                  {confidence ? `${Math.round(confidence * 100)}% confidence` : "No confidence score"}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
                  <Eye className="h-3 w-3" />
                  View analysis
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <AppShell>
      <Suspense fallback={<div className="text-sm text-muted-foreground">Loading...</div>}>
        <ResultsContent />
      </Suspense>
    </AppShell>
  );
}
