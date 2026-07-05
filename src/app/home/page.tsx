"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, FileText, Sparkles, BarChart3, Bot, ShieldCheck, Workflow, Layers3, Clock } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { getResearchReports, type ResearchReportRecord } from "@/lib/supabase-reports";

const workflows = [
  {
    title: "Board-ready memo",
    description: "Turn a market brief into a crisp executive narrative with evidence, uncertainty flags, and recommendations.",
    badge: "Board",
    icon: Sparkles,
    color: "from-violet-500/20 to-indigo-500/10",
    href: "/upload",
  },
  {
    title: "Evidence review",
    description: "Surface weak claims and contradictions before a team reviews a strategy or product launch memo.",
    badge: "Risk",
    icon: ShieldCheck,
    color: "from-emerald-500/20 to-teal-500/10",
    href: "/upload",
  },
  {
    title: "Decision support",
    description: "Combine source notes, documents, and web context into clear follow-up actions for product and growth teams.",
    badge: "Action",
    icon: Workflow,
    color: "from-amber-500/20 to-orange-500/10",
    href: "/upload",
  },
];

const pillars = [
  { icon: Bot, title: "Research copilot", description: "Synthesize findings from source materials into concise, decision-ready insights." },
  { icon: Layers3, title: "Structured output", description: "Generate briefs and polished deliverables with a consistent format every time." },
  { icon: BarChart3, title: "Actionable analytics", description: "Monitor momentum and review quality in one unified workspace." },
];

export default function HomePage() {
  const [reports, setReports] = useState<ResearchReportRecord[]>([]);
  const [totalDocs, setTotalDocs] = useState("—");
  const [avgConf, setAvgConf] = useState("—");

  useEffect(() => {
    void (async () => {
      const res = await getResearchReports();
      if (!res.error && res.data) {
        setReports(res.data);
        setTotalDocs(String(res.data.length));
        const avg = res.data.length
          ? Math.round((res.data.reduce((s, r) => s + (r.confidence ?? 0), 0) / res.data.length) * 100)
          : 0;
        setAvgConf(res.data.length ? `${avg}%` : "—");
      }
    })();
  }, []);

  const stats = [
    { title: "Reports saved", value: totalDocs, icon: FileText },
    { title: "Avg. confidence", value: avgConf, icon: BarChart3 },
    { title: "AI agents active", value: "10", icon: Bot },
  ];

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-primary/20 via-background to-emerald-500/10 p-8 shadow-xl lg:p-12">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,oklch(0.62_0.22_266/0.18),transparent_60%),radial-gradient(ellipse_at_bottom_right,oklch(0.70_0.18_160/0.12),transparent_60%)]" />
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                AI Research Studio
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Turn raw research into<br />
                <span className="bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
                  executive-ready outputs
                </span>
              </h1>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">
                Surface what matters, identify weak claims, and share polished recommendations — without switching tools.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/upload"
                  className="btn-glow inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition hover:scale-105 hover:shadow-primary/50"
                >
                  <FileText className="h-4 w-4" />
                  Start analysis
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/results"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-white/10"
                >
                  View sample results
                </Link>
              </div>
            </div>
            <div className="space-y-3">
              {["Source intake — 85% complete", "Evidence analysis — Running", "Executive narrative — Ready"].map((step, i) => (
                <div key={step} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                  <div className={`h-2 w-2 rounded-full ${i === 2 ? "bg-emerald-400" : i === 1 ? "bg-amber-400 animate-pulse" : "bg-primary"}`} />
                  <span className="text-sm text-muted-foreground">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.title} className="rounded-[1.5rem] border border-white/10 bg-card/80 p-6 shadow-sm backdrop-blur">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-primary/15 p-2 text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                </div>
                <p className="mt-4 text-3xl font-bold text-foreground">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Pillars */}
        <div className="grid gap-4 md:grid-cols-3">
          {pillars.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.title} className="group rounded-[1.5rem] border border-white/10 bg-card/80 p-6 shadow-sm transition hover:border-primary/30 hover:bg-primary/5">
                <div className="rounded-xl bg-primary/15 p-2.5 text-primary w-fit group-hover:bg-primary/25 transition">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-base font-semibold text-foreground">{p.title}</h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">{p.description}</p>
              </div>
            );
          })}
        </div>

        {/* Workflow cards */}
        <div>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Common workflows</h2>
            <Link href="/upload" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              Start one <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {workflows.map((w) => {
              const Icon = w.icon;
              return (
                <Link key={w.title} href={w.href} className={`group rounded-[1.5rem] border border-white/10 bg-gradient-to-br ${w.color} p-6 shadow-sm transition hover:scale-[1.02] hover:border-primary/30`}>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full border border-white/15 bg-black/20 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {w.badge}
                    </span>
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="mt-5 text-base font-semibold text-foreground">{w.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{w.description}</p>
                  <div className="mt-5 flex items-center gap-2 text-sm font-medium text-primary opacity-0 transition group-hover:opacity-100">
                    Open workspace <ArrowRight className="h-4 w-4" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent reports */}
        {reports.length > 0 && (
          <div>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Recent reports</h2>
              <Link href="/history" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {reports.slice(0, 3).map((r) => (
                <div key={r.id} className="rounded-[1.5rem] border border-white/10 bg-card/80 p-5 shadow-sm">
                  <p className="text-sm font-semibold text-foreground line-clamp-1">{r.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{r.source_label}</p>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground line-clamp-2">{r.summary}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs font-medium text-primary">{Math.round((r.confidence ?? 0) * 100)}% confidence</span>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {new Date(r.created_at ?? Date.now()).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
