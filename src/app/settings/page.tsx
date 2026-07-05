import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/shared/page-header";
import { SummaryCard } from "@/components/results/summary-card";
import { CheckCircle2, Settings2, Sparkles } from "lucide-react";

const preferenceCards = [
  { title: "Output tone", value: "Executive" },
  { title: "Default format", value: "Brief + deck" },
  { title: "Review mode", value: "Collaborative" },
];

export default function SettingsPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Settings"
          title="Configure your workspace"
          description="Tune how research is interpreted, summarized, and delivered across your team."
        />

        <div className="grid gap-4 md:grid-cols-3">
          {preferenceCards.map((card) => (
            <SummaryCard key={card.title} title={card.title} value={card.value} />
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[1.75rem] border border-border/70 bg-card/80 p-6 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-primary">
              <Settings2 className="h-4 w-4" />
              Workspace defaults
            </div>
            <div className="mt-5 space-y-4">
              {[
                "Executive summaries focused on decision support",
                "Human review before high-stakes distribution",
                "Confidence scoring visible for every output",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-border/70 bg-background/70 p-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-border/70 bg-gradient-to-br from-primary/10 via-background to-amber-500/10 p-6 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-primary">
              <Sparkles className="h-4 w-4" />
              Recommended setup
            </div>
            <h2 className="mt-3 text-xl font-semibold text-foreground">Keep review thresholds conservative</h2>
            <p className="mt-3 text-sm leading-8 text-muted-foreground">
              For external-facing output, require human review when confidence falls below 80% or when contradictory evidence is present.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
