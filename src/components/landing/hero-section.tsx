import { ArrowRight, Sparkles, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const highlights = [
  "Summaries tailored for executives",
  "Multi-format export to reports and decks",
  "Collaborative review from first draft to final handoff",
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-background/80 px-6 py-14 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.35)] backdrop-blur sm:px-10 lg:px-14 lg:py-20">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.18),_transparent_45%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.16),_transparent_45%)]" />
      <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div className="max-w-2xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            AI Research → Output Studio
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Turn research into polished delivery in minutes.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">
            InsightFlow AI helps teams capture insights, shape them into focused narratives, and publish-ready outputs without the usual bottlenecks.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" className="gap-2">
              Start free
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg">
              Book a strategy call
            </Button>
          </div>
          <ul className="mt-8 space-y-3 text-sm text-muted-foreground">
            {highlights.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <ShieldCheck className="mt-0.5 h-4 w-4 text-emerald-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border border-border/70 bg-card/80 p-5 shadow-sm">
          <div className="rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/10 via-background to-emerald-500/10 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Current workflow</p>
                <p className="mt-1 text-xl font-semibold text-foreground">Research brief • Q3 pipeline</p>
              </div>
              <div className="rounded-full bg-foreground/10 px-3 py-1 text-xs font-medium text-foreground">
                Live
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Source intake</span>
                  <span>85% complete</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-muted">
                  <div className="h-2 w-[85%] rounded-full bg-primary" />
                </div>
              </div>
              <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Executive narrative</span>
                  <span>Ready</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-muted">
                  <div className="h-2 w-full rounded-full bg-emerald-500" />
                </div>
              </div>
              <div className="rounded-2xl border border-border/60 bg-background/70 p-4 text-sm text-muted-foreground">
                Export ready for reporting, internal review, or client delivery.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
