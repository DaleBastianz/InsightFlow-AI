"use client";

import { useState } from "react";
import { Sparkles, Database, Trash2 } from "lucide-react";
import { type PipelineOutput } from "@/services/ai-pipeline";
import { deleteResearchReport, saveResearchReport, type ResearchReportRecord } from "@/lib/supabase-reports";
import { ResultsDashboard } from "@/components/results/results-dashboard";
import { ExportButton } from "@/components/results/export-button";

export function AgentPipelinePanel({ content, sourceLabel }: { content: string; sourceLabel: string }) {
  const [result, setResult] = useState<PipelineOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<string | null>(null);
  const [savedReportId, setSavedReportId] = useState<string | null>(null);

  const runPipeline = async () => {
    setLoading(true);
    setError(null);
    setSaveState(null);
    try {
      const response = await fetch("/api/run-pipeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, sourceLabel }),
      });

      const data = await response.json() as PipelineOutput & { error?: string };

      if (!response.ok || data.error) {
        throw new Error(data.error ?? "The pipeline could not be completed.");
      }

      setResult(data);
      setSaveState("Analysis complete. Scroll down to view the full breakdown.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "The pipeline could not be completed.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveReport = async () => {
    if (!result) {
      setSaveState("Run the pipeline before saving.");
      return;
    }

    setSaveState("Saving report...");

    const payload: ResearchReportRecord = {
      title: sourceLabel || "Untitled research report",
      source_type: "text",
      source_label: sourceLabel,
      summary: (result.summaryGenerator?.data?.summary as string | undefined) || "No summary available",
      content,
      pipeline_output: result as unknown as Record<string, unknown>,
      confidence: Number(result.confidenceScorer?.data?.overallConfidence ?? 0),
    };

    const response = await saveResearchReport(payload);
    if (response.error) {
      setSaveState(`Save failed: ${response.error}`);
      return;
    }

    setSavedReportId(response.data?.id ?? null);
    setSaveState("Report saved successfully.");
  };

  const handleDeleteReport = async () => {
    if (!savedReportId) {
      return;
    }

    setSaveState("Deleting report...");
    const response = await deleteResearchReport(savedReportId);
    if (response.error) {
      setSaveState(`Delete failed: ${response.error}`);
      return;
    }

    setSavedReportId(null);
    setSaveState("Report deleted.");
  };

  return (
    <div className="rounded-[1.5rem] border border-border/70 bg-card/80 p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">AI processing pipeline</h3>
          <p className="mt-1 text-sm text-muted-foreground">Sequential agents analyze the source and return structured evidence-based results.</p>
        </div>
        <button
          onClick={runPipeline}
          disabled={loading}
          aria-label="Run AI analysis pipeline"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-70"
        >
          <Sparkles className="h-4 w-4" />
          {loading ? "Running..." : "Run pipeline"}
        </button>
      </div>

      {loading && <div className="mt-4 rounded-2xl border border-border/70 bg-background/70 px-4 py-3 text-sm text-muted-foreground">Running the research pipeline — this may take up to a minute...</div>}
      {error && <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-500">{error}</div>}

      {result && !loading && (
        <>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={handleSaveReport}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              <Database className="h-4 w-4" />
              Save report
            </button>
            {savedReportId && (
              <button
                onClick={handleDeleteReport}
                className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background px-4 py-2 text-sm font-medium text-muted-foreground"
              >
                <Trash2 className="h-4 w-4" />
                Delete saved report
              </button>
            )}
            <ExportButton title={sourceLabel || "Research Report"} pipeline={result} />
          </div>

          {saveState && <div className="mt-4 rounded-2xl border border-border/70 bg-background/70 px-4 py-3 text-sm text-muted-foreground">{saveState}</div>}

          <div className="mt-8">
            <ResultsDashboard pipeline={result} />
          </div>
        </>
      )}
    </div>
  );
}
