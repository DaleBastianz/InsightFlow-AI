"use client";

import { useState } from "react";
import { Link2 } from "lucide-react";

export function URLInput() {
  const [url, setUrl] = useState("");

  return (
    <label className="block rounded-[1.25rem] border border-border/70 bg-background/70 p-4">
      <div className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
        <Link2 className="h-4 w-4 text-primary" />
        Source URL
      </div>
      <input
        value={url}
        onChange={(event) => setUrl(event.target.value)}
        placeholder="https://example.com/research-brief"
        className="w-full rounded-2xl border border-border/70 bg-background px-3 py-2 text-sm outline-none ring-0"
      />
    </label>
  );
}
