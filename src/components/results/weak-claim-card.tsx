export function WeakClaimCard({ title, concern }: { title: string; concern: string }) {
  return (
    <div className="rounded-[1.25rem] border border-amber-500/20 bg-amber-500/10 p-4 shadow-sm">
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-muted-foreground">Needs attention: {concern}</p>
    </div>
  );
}
