export function RecommendationCard({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-[1.25rem] border border-primary/20 bg-primary/10 p-4 shadow-sm">
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-muted-foreground">{detail}</p>
    </div>
  );
}
