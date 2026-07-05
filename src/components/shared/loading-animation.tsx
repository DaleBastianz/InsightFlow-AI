export function LoadingAnimation() {
  return (
    <div className="flex items-center gap-3 rounded-[1.25rem] border border-border/70 bg-background/70 px-4 py-3 text-sm text-muted-foreground shadow-sm">
      <div className="flex gap-1">
        <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
        <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
        <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-primary" />
      </div>
      Preparing insights...
    </div>
  );
}
