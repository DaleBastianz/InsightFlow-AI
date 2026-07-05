import { ArrowRight, Sparkles, ShieldCheck, Workflow } from "lucide-react";

const journeys = [
  {
    title: "Board-ready memo",
    description: "Turn a market brief into a crisp executive narrative with evidence, uncertainty flags, and recommendations.",
    badge: "Board",
    icon: Sparkles,
  },
  {
    title: "Evidence review",
    description: "Surface weak claims and contradictions before a team reviews a strategy or product launch memo.",
    badge: "Risk",
    icon: ShieldCheck,
  },
  {
    title: "Decision support",
    description: "Combine source notes, documents, and web context into clear follow-up actions for product and growth teams.",
    badge: "Action",
    icon: Workflow,
  },
];

export function SampleJourneys() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {journeys.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.title} className="rounded-[1.5rem] border border-border/70 bg-background/80 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="rounded-full border border-border/70 bg-background px-2.5 py-1 text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                {item.badge}
              </span>
              <Icon className="h-4 w-4 text-primary" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-foreground">{item.title}</h3>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.description}</p>
            <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary">
              See workflow <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
