"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { SummaryCard } from "@/components/results/summary-card";
import { deleteResearchReport, getResearchReports, type ResearchReportRecord } from "@/lib/supabase-reports";
import { Eye } from "lucide-react";

export default function HistoryPage() {
  const [reports, setReports] = useState<ResearchReportRecord[]>([]);
  const [message, setMessage] = useState<string>("Loading reports...");

  const loadReports = async () => {
    const response = await getResearchReports();
    if (response.error) {
      setMessage(response.error);
      return;
    }

    setReports(response.data ?? []);
    setMessage(response.data?.length ? "Saved reports are ready to review." : "No saved reports yet.");
  };

  useEffect(() => {
    void loadReports();
  }, []);

  const handleDelete = async (id?: string) => {
    if (!id) {
      return;
    }

    const response = await deleteResearchReport(id);
    if (response.error) {
      setMessage(`Delete failed: ${response.error}`);
      return;
    }

    setMessage("Report deleted.");
    void loadReports();
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">History</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">Recent analyses</h1>
          <p className="mt-3 max-w-2xl text-base leading-8 text-muted-foreground">
            Revisit prior uploads, inspect outputs, and continue refining earlier workflows.
          </p>
        </div>

        <div className="rounded-[1.5rem] border border-border/70 bg-card/80 p-4 text-sm text-muted-foreground">
          {message}
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {reports.map((report) => (
            <div key={report.id} className="rounded-[1.5rem] border border-border/70 bg-card/80 p-5 shadow-sm">
              <SummaryCard title={report.title} value={`${report.source_label} • ${new Date(report.created_at ?? Date.now()).toLocaleDateString()}`} />
              <p className="mt-3 text-sm leading-7 text-muted-foreground line-clamp-3">{report.summary}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary">Confidence {Math.round((report.confidence ?? 0) * 100)}%</span>
                <div className="flex items-center gap-3">
                  <Link href={`/results?id=${report.id}`} className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                    <Eye className="h-3.5 w-3.5" />
                    View
                  </Link>
                  <button onClick={() => void handleDelete(report.id)} className="text-sm font-medium text-red-500">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
