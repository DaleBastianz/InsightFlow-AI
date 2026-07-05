"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FileUp, CheckCircle2 } from "lucide-react";

export function PDFUploader() {
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
  });

  return (
    <div className="space-y-3">
      <div
        {...getRootProps()}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-[1.25rem] border border-dashed px-6 py-10 text-center transition ${
          isDragActive ? "border-primary bg-primary/10" : "border-border/70 bg-background/70"
        }`}
      >
        <input {...getInputProps()} />
        <FileUp className="h-8 w-8 text-primary" />
        <p className="mt-3 text-sm font-medium text-foreground">
          {isDragActive ? "Drop your PDF here" : "Drop a PDF or browse files"}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">Supports research papers, reports, and briefs.</p>
      </div>
      {files.length > 0 && (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-600">
          <CheckCircle2 className="h-4 w-4" />
          {files[0].name} ready for analysis
        </div>
      )}
    </div>
  );
}
