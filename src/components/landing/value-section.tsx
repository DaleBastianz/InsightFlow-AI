import { BarChart3, Bot, Layers3 } from "lucide-react";

const pillars = [
  {
    icon: Bot,
    title: "Research copilot",
    description: "Collect and synthesize findings from your source materials into concise, decision-ready insights.",
  },
  {
    icon: Layers3,
    title: "Structured output",
    description: "Generate briefs, summaries, and polished deliverables with a consistent format every time.",
  },
  {
    icon: BarChart3,
    title: "Actionable analytics",
    description: "Monitor momentum, review quality, and share progress with stakeholders in one place.",
  },
];

export function ValueSection() {
  return (
    <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Why teams choose InsightFlow</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Built for modern research and output teams.
        </h2>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">
          Replace fragmented handoffs with a focused workflow that keeps context, narrative, and delivery aligned.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {pillars.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <div key={pillar.title} className="rounded-2xl border border-border/70 bg-card/80 p-5 shadow-sm">
              <div className="inline-flex rounded-xl bg-primary/10 p-2 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">{pillar.title}</h3>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">{pillar.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
