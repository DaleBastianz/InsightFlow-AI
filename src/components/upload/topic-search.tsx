"use client";

import { useState } from "react";
import { AlertCircle, Search, Sparkles } from "lucide-react";
import { type TavilyCategory, type TavilyResult } from "@/services/tavily";

const categories: TavilyCategory[] = ["news", "business", "technology", "marketing"];

export function TopicSearch() {
  const [topic, setTopic] = useState("");
  const [category, setCategory] = useState<TavilyCategory>("technology");
  const [results, setResults] = useState<TavilyResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const response = await fetch("/api/topic-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, category }),
      });

      const data = await response.json() as { results?: TavilyResult[]; error?: string };

      if (!response.ok || data.error) {
        throw new Error(data.error ?? "Unable to run the search.");
      }

      setResults(data.results ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to run the search.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-[1.5rem] border border-border/70 bg-card/80 p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Search a topic</h3>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">Search the web for current, topic-based sources to use in your analysis workflow.</p>

      <div className="mt-4 grid gap-3 md:grid-cols-[1.3fr_0.7fr_auto]">
        <label className="sr-only" htmlFor="topic-search-input">
          Research topic
        </label>
        <input
          id="topic-search-input"
          value={topic}
          onChange={(event) => setTopic(event.target.value)}
          placeholder="Enter a topic or research question"
          className="rounded-2xl border border-border/70 bg-background px-3 py-2 text-sm outline-none"
        />
        <label className="sr-only" htmlFor="topic-search-category">
          Category
        </label>
        <select
          id="topic-search-category"
          value={category}
          onChange={(event) => setCategory(event.target.value as TavilyCategory)}
          className="rounded-2xl border border-border/70 bg-background px-3 py-2 text-sm outline-none"
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <button
          onClick={handleSearch}
          disabled={loading}
          aria-label="Search for topic sources"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-70"
        >
          <Search className="h-4 w-4" />
          Search
        </button>
      </div>

      {loading && (
        <div className="mt-4 rounded-2xl border border-border/70 bg-background/70 px-4 py-3 text-sm text-muted-foreground">
          Searching the web for the latest sources...
        </div>
      )}

      {error && (
        <div className="mt-4 flex items-start gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-500">
          <AlertCircle className="mt-0.5 h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {results.length > 0 && (
        <div className="mt-5 space-y-3">
          {results.map((result) => (
            <div key={result.url} className="rounded-2xl border border-border/70 bg-background/70 p-4">
              <p className="text-sm font-semibold text-foreground">{result.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{result.url}</p>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">{result.summary}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
