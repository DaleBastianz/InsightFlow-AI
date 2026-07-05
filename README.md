# InsightFlow AI

InsightFlow AI is a research-to-output workspace for ingesting source material, running structured analysis, and exporting polished reports.

## Installation

```bash
npm install
```

## API Keys

The app uses the following services:

- Anthropic for the analysis pipeline
- Firecrawl for website scraping
- Tavily for topic search
- Supabase for report storage

## Environment Variables

Create a `.env.local` file in the project root with:

```env
ANTHROPIC_API_KEY=your_anthropic_key
ANTHROPIC_API_URL=https://api.anthropic.com/v1/messages
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022

FIRECRAWL_API_KEY=your_firecrawl_key
FIRECRAWL_API_URL=https://api.firecrawl.dev

TAVILY_API_KEY=your_tavily_key
TAVILY_API_URL=https://api.tavily.com/search

NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Folder Structure

```text
src/
  app/                # Routes and pages
  components/         # Reusable UI components
  lib/                # Shared utilities and environment setup
  services/           # External API abstractions
```

## Features

- Upload PDF, DOCX, TXT, and Markdown files
- Scrape website URLs
- Search topic-based sources
- Run evidence-based analysis
- Save, review, and delete reports
- Export reports as PDF, Markdown, JSON, or clipboard

## Deployment Instructions

1. Push the repository to GitHub.
2. Create a Vercel project and import the repository.
3. Add the environment variables in Vercel Project Settings.
4. Deploy the application.

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```
