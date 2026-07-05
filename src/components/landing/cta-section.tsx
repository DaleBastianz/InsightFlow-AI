import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="rounded-[2rem] border border-border/70 bg-foreground px-6 py-12 text-background sm:px-10 lg:px-14">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-background/70">Ready to move faster?</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Bring your research pipeline into one elegant operating system.
          </h2>
          <p className="mt-4 text-lg leading-8 text-background/80">
            Launch your first workflow in a single afternoon with a process that scales from one analyst to a full team.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button size="lg" variant="secondary" className="bg-background text-foreground hover:bg-background/90">
            Request demo
          </Button>
          <Button size="lg" variant="outline" className="border-background/30 bg-transparent text-background hover:bg-background/10">
            Explore platform
          </Button>
        </div>
      </div>
    </section>
  );
}
