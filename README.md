# InsightFlow AI

**Research-to-output workspace** — ingest source material, run structured multi-agent analysis, and export polished reports.

## Architecture Overview

```
User Input ──► Upload/Scrape/Search ──► AI Pipeline (10 agents) ──► Results Dashboard ──► Export
                       │                       │                           │
                       ▼                       ▼                           ▼
                 Supabase Auth         OpenRouter (GPT-4o-mini)      PDF / MD / JSON / CSV
```

The app uses **Supabase** for authentication (email/password) and report storage, and **OpenRouter** (GPT-4o-mini) for the analysis pipeline.

---

## Step-by-Step Application Process

### 1. Authentication

- All routes except `/auth` require a signed-in user.
- Users sign up with email/password or sign in to an existing account.
- Sessions persist via Supabase Auth (localStorage).
- On sign out, users are redirected to `/auth`.

### 2. Source Ingestion

Once authenticated, users can provide source material in **four ways**:

| Method | Page | Description |
|--------|------|-------------|
| Paste text | `/upload` (Text tab) | Type or paste research content directly |
| Upload file | `/upload` (File tab) | Upload PDF, DOCX, TXT, or Markdown files |
| Scrape URL | `/upload` (URL tab) | Enter a website URL to scrape content |
| Topic search | `/upload` (Search tab) | Search a topic via Tavily and select results |

### 3. AI Processing Pipeline

When the user clicks **Run pipeline**, the content is sent to 10 sequential agents via OpenRouter (GPT-4o-mini):

| Agent | Role | Output |
|-------|------|--------|
| **Research Analyzer** | Analyzes content, extracts key findings and evidence status | Description, key findings, citations |
| **Topic Extractor** | Identifies core topic, subtopics, and themes | Primary topic, subtopics, themes |
| **Claim Extractor** | Extracts supported and challengeable claims | Claims list with support details |
| **Evidence Evaluator** | Rates evidence strength for each claim | Evaluations (strong/weak/insufficient) |
| **Weak Claim Detector** | Flags unsupported or weak claims | Weak claims with reasons |
| **Contradiction Detector** | Identifies contradictions between statements | Contradictions with descriptions |
| **Summary Generator** | Produces a concise research summary | Summary text, key takeaways |
| **Recommendation Generator** | Creates evidence-grounded recommendations | Recommendations list |
| **Confidence Scorer** | Scores overall reliability and confidence | Overall confidence percentage, rationale |
| **Human Review Decision** | Determines if human review is needed | Decision with reasoning |

Each agent runs sequentially, receiving the original content plus previous agent results for context. Results are parsed as JSON and displayed in the dashboard.

### 4. Results Dashboard

After the pipeline completes, the full breakdown auto-displays:

- **Executive Summary** — overall summary with confidence score gauge
- **Topics** — extracted topics shown as tags
- **Human Review** — whether human review is recommended
- **Key Insights** — key findings from the research analyzer
- **Claims** — extracted claims with support detail and copy button
- **Evidence** — evidence evaluations with strong/weak status labels
- **Weak Claims** — unsupported claims highlighted in amber
- **Contradictions** — contradictory statements highlighted in rose
- **Recommendations** — evidence-grounded recommendations
- **Next Steps** — suggested actions from the human review agent

### 5. Save & Export

- **Save report** — persists the full pipeline output to Supabase (linked to the signed-in user)
- **Delete saved report** — removes the report from storage
- **Export** — download as PDF, Markdown, JSON, or copy to clipboard

### 6. History & Review

- **History page** (`/history`) — lists all saved reports for the current user
- **Results page** (`/results?id=xxx`) — view a previously saved report with the full dashboard

---

## Environment Variables

Create a `.env.local` file in the project root:

```env
# OpenRouter (AI Pipeline)
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxx

# Supabase (Auth + Database)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...

# Firecrawl (Website scraping — only needed for URL input)
FIRECRAWL_API_KEY=fc-xxxxxxxxxxxx
FIRECRAWL_API_URL=https://api.firecrawl.dev

# Tavily (Topic search — only needed for search input)
TAVILY_API_KEY=tvly-xxxxxxxxxxxx
TAVILY_API_URL=https://api.tavily.com/search
```

### Supabase Schema

Run the SQL in `supabase-schema.sql` in your Supabase SQL Editor to create the `research_reports` table with Row-Level Security.

---

## Installation & Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

---

## Deployment on Vercel

1. Push the repository to GitHub.
2. Go to [vercel.com](https://vercel.com) and import the repository.
3. In **Project Settings → Environment Variables**, add:
   - `OPENROUTER_API_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `FIRECRAWL_API_KEY` (optional)
   - `TAVILY_API_KEY` (optional)
4. Deploy — the build command (`next build`) runs automatically.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router, Turbopack) |
| Language | TypeScript |
| UI | Tailwind CSS, Framer Motion, Radix UI |
| Auth | Supabase Auth (email/password) |
| Database | Supabase PostgreSQL (Row-Level Security) |
| AI Pipeline | OpenRouter (GPT-4o-mini) |
| Scraping | Firecrawl |
| Search | Tavily |
| Export | jsPDF, html2canvas |
