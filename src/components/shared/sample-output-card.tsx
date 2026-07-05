import { ArrowUpRight, BrainCircuit, ShieldAlert } from "lucide-react";

interface SampleOutputCardProps {
  title: string;
  description: string;
  confidence: string;
  status: string;
}

export function SampleOutputCard({ title, description, confidence, status }: SampleOutputCardProps) {
  return (
    <div className="rounded-[1.5rem] border border-border/70 bg-background/80 p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <BrainCircuit className="h-4 w-4 text-primary" />
          {title}
        </div>
        <span className="rounded-full border border-border/70 bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground">
          {confidence}
        </span>
      </div>
      <p className="mt-3 text-sm leading-7 text-muted-foreground">{description}</p>
      <div className="mt-4 flex items-center justify-between">
        <span className="inline-flex items-center gap-2 text-sm font-medium text-primary">
          <ShieldAlert className="h-4 w-4" />
          {status}
        </span>
        <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  );
}
