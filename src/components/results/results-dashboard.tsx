"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Copy, ChevronDown, ShieldAlert, Sparkles, BrainCircuit } from "lucide-react";
import type { PipelineOutput } from "@/services/ai-pipeline";

interface ResultsDashboardProps {
  pipeline: PipelineOutput;
}

function SectionCard({ title, children, accent = "border-border/70" }: { title: string; children: React.ReactNode; accent?: string }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <motion.section
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-[1.5rem] border ${accent} bg-card/80 p-5 shadow-sm`}
    >
      <button onClick={() => setExpanded((value) => !value)} className="flex w-full items-center justify-between text-left">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition ${expanded ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="pt-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

function CopyButton({ text }: { text: string }) {
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
  };

  return (
    <button onClick={handleCopy} className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background px-3 py-1.5 text-sm text-muted-foreground transition hover:text-foreground">
      <Copy className="h-3.5 w-3.5" />
      Copy
    </button>
  );
}

function toArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (typeof value === "string") return [value] as T[];
  return [];
}

export function ResultsDashboard({ pipeline }: ResultsDashboardProps) {
  const summary = pipeline.summaryGenerator?.data?.summary as string | undefined;
  const topics = toArray<string>(pipeline.topicExtractor?.data?.subtopics);
  const insights = toArray<string>(pipeline.researchAnalyzer?.data?.keyFindings);
  const claims = toArray<{ claim?: string; support?: string }>(pipeline.claimExtractor?.data?.claims);
  const evaluations = toArray<{ claim?: string; status?: string; note?: string }>(pipeline.evidenceEvaluator?.data?.evaluations);
  const weakClaims = toArray<{ claim?: string; reason?: string }>(pipeline.weakClaimDetector?.data?.weakClaims);
  const contradictions = toArray<{ statement?: string; issue?: string }>(pipeline.contradictionDetector?.data?.contradictions);
  const recommendations = toArray<{ recommendation?: string }>(pipeline.recommendationGenerator?.data?.recommendations);
  const nextSteps = toArray<string>(pipeline.humanReviewDecision?.data?.reasons);
  const confidence = pipeline.confidenceScorer?.data?.overallConfidence as number | undefined;
  const humanReview = pipeline.humanReviewDecision?.data?.decision as string | undefined;

  const confidencePercent = useMemo(() => Math.round((confidence ?? 0) * 100), [confidence]);

  return (
    <div className="space-y-6">
      <motion.div layout initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="rounded-[1.75rem] border border-border/70 bg-gradient-to-br from-primary/10 via-background to-emerald-500/10 p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Executive Summary</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">Research review dashboard</h2>
            <p className="mt-3 max-w-3xl text-base leading-8 text-muted-foreground">{summary || "Evidence-based summary will appear here once the pipeline runs."}</p>
          </div>
          <div className="rounded-[1.25rem] border border-border/70 bg-background/80 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Sparkles className="h-4 w-4 text-primary" />
              Confidence score
            </div>
            <div className="mt-3 h-3 w-48 rounded-full bg-muted">
              <div className="h-3 rounded-full bg-primary transition-all" style={{ width: `${confidencePercent}%` }} />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{confidencePercent}% overall confidence</p>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Topics" accent="border-cyan-500/20">
          <div className="flex flex-wrap gap-2">
            {topics.length > 0 ? topics.map((topic) => (
              <span key={topic} className="rounded-full border border-border/70 bg-background px-3 py-1.5 text-sm text-muted-foreground">
                {topic}
              </span>
            )) : <span className="text-sm text-muted-foreground">No topics extracted yet</span>}
          </div>
        </SectionCard>

        <SectionCard title="Human Review" accent="border-amber-500/20">
          <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-background/70 p-4">
            <BrainCircuit className="h-5 w-5 text-amber-500" />
            <div>
              <p className="text-sm font-semibold text-foreground">{humanReview || "Needs review"}</p>
              <p className="text-sm text-muted-foreground">{nextSteps?.[0] || "Review the evidence and final recommendations before sharing."}</p>
            </div>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Key Insights">
        <div className="grid gap-3 md:grid-cols-2">
          {insights.length > 0 ? insights.map((insight) => (
            <div key={insight} className="rounded-2xl border border-border/70 bg-background/70 p-4 text-sm leading-7 text-muted-foreground">
              {insight}
            </div>
          )) : <div className="col-span-2 text-sm text-muted-foreground">No insights available</div>}
        </div>
      </SectionCard>

      <SectionCard title="Claims">
        <div className="space-y-3">
          {(claims ?? []).map((claim, index) => (
            <div key={`${claim.claim}-${index}`} className="rounded-2xl border border-border/70 bg-background/70 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">{claim.claim || "Untitled claim"}</p>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{claim.support || "Support detail unavailable"}</p>
                </div>
                <CopyButton text={`${claim.claim || "Untitled claim"}\n${claim.support || ""}`} />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Evidence">
        <div className="space-y-3">
          {(evaluations ?? []).map((evaluation, index) => (
            <div key={`${evaluation.claim}-${index}`} className="rounded-2xl border border-border/70 bg-background/70 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">{evaluation.claim || "Evidence item"}</p>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{evaluation.note || "Evidence is insufficient."}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${evaluation.status === "strong" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"}`}>
                  {evaluation.status || "Needs review"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Weak Claims" accent="border-amber-500/20">
        <div className="space-y-3">
          {(weakClaims ?? []).map((item, index) => (
            <div key={`${item.claim}-${index}`} className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.claim || "Weak claim"}</p>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.reason || "Evidence is insufficient."}</p>
                </div>
                <ShieldAlert className="h-5 w-5 text-amber-500" />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Contradictions" accent="border-rose-500/20">
        <div className="space-y-3">
          {(contradictions ?? []).map((item, index) => (
            <div key={`${item.statement}-${index}`} className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4">
              <p className="text-sm font-semibold text-foreground">{item.statement || "Potential contradiction"}</p>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.issue || "Evidence is insufficient."}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Recommendations">
        <div className="space-y-3">
          {(recommendations ?? []).map((item, index) => (
            <div key={`${item.recommendation}-${index}`} className="rounded-2xl border border-border/70 bg-background/70 p-4">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm leading-7 text-muted-foreground">{item.recommendation || "No recommendation available"}</p>
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500" />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Next Steps">
        <div className="space-y-3">
          {nextSteps.length > 0 ? nextSteps.map((step) => (
            <div key={step} className="rounded-2xl border border-border/70 bg-background/70 p-4 text-sm leading-7 text-muted-foreground">
              {step}
            </div>
          )) : <div className="text-sm text-muted-foreground">No next steps available</div>}
        </div>
      </SectionCard>
    </div>
  );
}
