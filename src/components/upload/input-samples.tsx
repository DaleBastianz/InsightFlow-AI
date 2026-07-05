import { BookOpen, FileText, Globe2, Sparkles } from "lucide-react";

const sampleInputs = [
  {
    title: "Board memo",
    description: "A market strategy brief from a recent leadership meeting.",
    icon: FileText,
  },
  {
    title: "Web source",
    description: "A launch article or analyst report pulled from the web.",
    icon: Globe2,
  },
  {
    title: "Meeting notes",
    description: "Raw notes from a customer conversation or internal planning session.",
    icon: BookOpen,
  },
];

export function InputSamples() {
  return (
    <div className="rounded-[1.75rem] border border-border/70 bg-card/80 p-6 shadow-sm">
      <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-primary">
        <Sparkles className="h-4 w-4" />
        Three sample input types
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {sampleInputs.map((sample) => {
          const Icon = sample.icon;
          return (
            <div key={sample.title} className="rounded-[1.5rem] border border-border/70 bg-background/80 p-4">
              <Icon className="h-5 w-5 text-primary" />
              <h3 className="mt-3 text-lg font-semibold text-foreground">{sample.title}</h3>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">{sample.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
