"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { AlertCircle, CheckCircle2, UploadCloud, Sparkles, Link2, PencilLine, Trash2, XCircle } from "lucide-react";
import { TopicSearch } from "@/components/upload/topic-search";
import { AgentPipelinePanel } from "@/components/results/agent-pipeline-panel";
import { InputSamples } from "@/components/upload/input-samples";

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const ACCEPTED_TYPES = {
  "application/pdf": [".pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  "text/plain": [".txt"],
  "text/markdown": [".md", ".markdown"],
  "text/*": [".txt", ".md", ".markdown"],
};

interface SourceItem {
  id: string;
  type: "file" | "url" | "text";
  label: string;
  content: string;
  status: "success" | "error";
  error?: string;
}

export function UploadWorkflow() {
  const [sources, setSources] = useState<SourceItem[]>([]);
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [status, setStatus] = useState<string>("Idle");
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setError(null);
    setStatus("Processing files...");
    setProgress(10);

    if (!acceptedFiles.length) {
      setError("No files were selected or supported.");
      setStatus("Error");
      return;
    }

    const newSources: SourceItem[] = [];
    let processed = 0;

    for (const file of acceptedFiles) {
      const fileId = Math.random().toString(36).substring(7);
      
      if (file.size > MAX_FILE_SIZE_BYTES) {
        newSources.push({
          id: fileId,
          type: "file",
          label: file.name,
          content: "",
          status: "error",
          error: `File is too large. Maximum size is ${MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB.`,
        });
        processed++;
        continue;
      }

      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/parse-document", {
          method: "POST",
          body: formData,
        });

        const data = await response.json() as { text?: string; error?: string };

        if (!response.ok || data.error) {
          throw new Error(data.error ?? "Unable to parse file.");
        }

        newSources.push({
          id: fileId,
          type: "file",
          label: file.name,
          content: data.text ?? "",
          status: "success",
        });
      } catch (err) {
        newSources.push({
          id: fileId,
          type: "file",
          label: file.name,
          content: "",
          status: "error",
          error: err instanceof Error ? err.message : "Unable to parse file.",
        });
      }
      processed++;
      setProgress(10 + Math.round((processed / acceptedFiles.length) * 90));
    }

    setSources((prev) => [...prev, ...newSources]);
    setProgress(100);
    setStatus("Ready");
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    multiple: true,
    maxSize: MAX_FILE_SIZE_BYTES,
    onDropRejected: (rejections) => {
      const rejection = rejections[0];
      setError(rejection.errors[0]?.message ?? "Unsupported upload.");
      setStatus("Error");
    },
  });

  const handleUrlSubmit = async () => {
    if (!url.trim()) return;
    setError(null);
    setStatus("Processing URL...");
    setProgress(20);
    try {
      const response = await fetch("/api/scrape-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await response.json() as { title?: string; markdown?: string; url?: string; error?: string };

      if (!response.ok || data.error) {
        throw new Error(data.error ?? "Unable to read URL content.");
      }

      setSources((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substring(7),
          type: "url",
          label: data.title ?? url,
          content: data.markdown ?? "",
          status: "success",
        },
      ]);
      setUrl("");
      setProgress(100);
      setStatus("Ready");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to read URL content.");
      setStatus("Error");
    }
  };

  const handleTextSubmit = async () => {
    const trimmed = text.trim();
    if (!trimmed) {
      setError("Please enter some text to analyze.");
      return;
    }
    setError(null);
    setStatus("Adding text...");
    setProgress(50);
    
    setSources((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(7),
        type: "text",
        label: "Pasted text snippet",
        content: trimmed,
        status: "success",
      },
    ]);
    setText("");
    setProgress(100);
    setStatus("Ready");
  };

  const removeSource = (id: string) => {
    setSources((prev) => prev.filter((s) => s.id !== id));
  };

  const successfulSources = sources.filter((s) => s.status === "success");
  const combinedContent = successfulSources
    .map((s) => `--- SOURCE: ${s.label} ---\n${s.content}`)
    .join("\n\n");
  const combinedLabels = successfulSources.map((s) => s.label).join(", ");

  return (
    <div className="space-y-6">
      <div className="rounded-[1.75rem] border border-border/70 bg-gradient-to-br from-primary/10 via-background to-emerald-500/10 p-6 shadow-sm">
        <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-primary">
              <Sparkles className="h-4 w-4" />
              Multi-input analysis workspace
            </div>
            <h2 className="mt-3 text-2xl font-semibold text-foreground">Bring in documents, notes, or web context</h2>
            <p className="mt-2 text-sm leading-8 text-muted-foreground">
              Add multiple files, URLs, and text snippets below. InsightFlow AI will combine them into a structured output ready for executive review.
            </p>
          </div>
          <span className="rounded-full border border-border/70 bg-background px-3 py-1 text-xs font-medium text-muted-foreground whitespace-nowrap">
            Max 10MB per file
          </span>
        </div>

        <div
          {...getRootProps()}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-[1.25rem] border border-dashed px-6 py-10 text-center transition ${
            isDragActive ? "border-primary bg-primary/10" : "border-border/70 bg-background/70 hover:bg-background/90"
          }`}
        >
          <input {...getInputProps()} />
          <UploadCloud className="h-8 w-8 text-primary" />
          <p className="mt-3 text-sm font-medium text-foreground">{isDragActive ? "Drop your files here" : "Drag and drop multiple PDFs, DOCX, TXT or Markdown files"}</p>
          <p className="mt-1 text-sm text-muted-foreground">Supports local files up to 10MB each.</p>
        </div>

        {(progress > 0 && progress < 100) && (
          <div className="mt-4">
            <div className="h-2 rounded-full bg-muted">
              <div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
              <span>Status: {status}</span>
              <span>{progress}%</span>
            </div>
          </div>
        )}

        {/* Source List */}
        {sources.length > 0 && (
          <div className="mt-6 space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Added Sources ({sources.length})</h3>
            {sources.map((source) => (
              <div key={source.id} className={`flex items-center justify-between rounded-2xl border p-3 text-sm ${source.status === "error" ? "border-red-500/30 bg-red-500/10" : "border-border/70 bg-background/70"}`}>
                <div className="flex items-center gap-3 truncate">
                  {source.status === "error" ? (
                    <XCircle className="h-4 w-4 text-red-500 shrink-0" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  )}
                  <span className="font-medium text-foreground truncate">{source.label}</span>
                  {source.error && <span className="text-red-500 text-xs truncate"> - {source.error}</span>}
                </div>
                <button
                  onClick={() => removeSource(source.id)}
                  className="rounded-full p-1.5 text-muted-foreground hover:bg-background hover:text-foreground transition shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[1.5rem] border border-border/70 bg-card/80 p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Link2 className="h-4 w-4 text-primary" />
            Add URL
          </div>
          <input
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://example.com/article"
            className="mt-3 w-full rounded-2xl border border-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          />
          <button
            onClick={handleUrlSubmit}
            className="mt-4 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition"
          >
            Add URL to workspace
          </button>
        </div>

        <div className="rounded-[1.5rem] border border-border/70 bg-card/80 p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <PencilLine className="h-4 w-4 text-primary" />
            Add text
          </div>
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            rows={4}
            placeholder="Paste product notes, meeting summaries, or research drafts..."
            className="mt-3 w-full rounded-2xl border border-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-primary resize-none"
          />
          <button
            onClick={handleTextSubmit}
            className="mt-4 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition"
          >
            Add text to workspace
          </button>
        </div>
      </div>

      <InputSamples />
      <TopicSearch />

      {combinedContent && (
        <AgentPipelinePanel content={combinedContent} sourceLabel={combinedLabels.length > 50 ? combinedLabels.substring(0, 47) + "..." : combinedLabels} />
      )}

      {(error || combinedContent) && (
        <div className="rounded-[1.5rem] border border-border/70 bg-card/80 p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {error ? <AlertCircle className="h-4 w-4 text-red-500" /> : <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
              <h3 className="text-lg font-semibold text-foreground">Combined Preview</h3>
            </div>
            <span className="rounded-full border border-border/70 bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
              {successfulSources.length} source{successfulSources.length === 1 ? "" : "s"}
            </span>
          </div>

          {error && (
            <p className="mt-3 text-sm leading-7 text-red-500">{error}</p>
          )}
          
          {combinedContent && (
            <div className="mt-4 rounded-2xl border border-border/70 bg-background/70 p-4 text-sm leading-7 text-muted-foreground max-h-[400px] overflow-y-auto whitespace-pre-wrap">
              {combinedContent.length > 2000 ? combinedContent.substring(0, 2000) + "...\n\n(Preview truncated for display)" : combinedContent}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
