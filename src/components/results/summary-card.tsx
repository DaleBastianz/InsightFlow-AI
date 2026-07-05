export function SummaryCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-[1.25rem] border border-border/70 bg-card/80 p-4 shadow-sm">
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <p className="mt-2 text-lg font-semibold text-foreground">{value}</p>
    </div>
  );
}
