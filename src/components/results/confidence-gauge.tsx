export function ConfidenceGauge({ value }: { value: number }) {
  return (
    <div className="rounded-[1.25rem] border border-border/70 bg-background/70 p-4 shadow-sm">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Confidence</span>
        <span className="font-semibold text-foreground">{value}%</span>
      </div>
      <div className="mt-3 h-3 rounded-full bg-muted">
        <div className="h-3 rounded-full bg-primary" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
