export function ClaimCard({ title, support }: { title: string; support: string }) {
  return (
    <div className="rounded-[1.25rem] border border-emerald-500/20 bg-emerald-500/10 p-4 shadow-sm">
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-muted-foreground">Support: {support}</p>
    </div>
  );
}
