export function InsightCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-[1.25rem] border border-border/70 bg-background/70 p-4 shadow-sm">
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-muted-foreground">{description}</p>
    </div>
  );
}
