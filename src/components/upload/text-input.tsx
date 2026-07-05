"use client";

import { useState } from "react";
import { PenLine } from "lucide-react";

export function TextInput() {
  const [text, setText] = useState("");

  return (
    <label className="block rounded-[1.25rem] border border-border/70 bg-background/70 p-4">
      <div className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
        <PenLine className="h-4 w-4 text-primary" />
        Paste raw text
      </div>
      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        rows={8}
        placeholder="Add notes, interview transcripts, or draft content here..."
        className="w-full rounded-2xl border border-border/70 bg-background px-3 py-2 text-sm outline-none ring-0"
      />
    </label>
  );
}
