import { AppShell } from "@/components/layout/app-shell";
import { UploadWorkflow } from "@/components/upload/upload-workflow";

export default function UploadPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Upload</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">Bring in source content</h1>
          <p className="mt-3 max-w-2xl text-base leading-8 text-muted-foreground">
            Upload PDF, DOCX, TXT, Markdown, or a website URL and preview the extracted text.
          </p>
        </div>
        <UploadWorkflow />
      </div>
    </AppShell>
  );
}
