import axios from "axios";
import { env } from "@/lib/config/env";

const FIRECRAWL_API_URL = env.FIRECRAWL_API_URL || "https://api.firecrawl.dev";
const FIRECRAWL_API_KEY = env.FIRECRAWL_API_KEY;

export interface FirecrawlScrapeResult {
  title: string;
  markdown: string;
  url: string;
  metadata?: Record<string, unknown>;
}

function validateUrl(input: string): URL {
  try {
    const parsed = new URL(input);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      throw new Error("Only HTTP and HTTPS URLs are supported.");
    }
    return parsed;
  } catch {
    throw new Error("Please enter a valid URL.");
  }
}

export async function scrapeWithFirecrawl(url: string): Promise<FirecrawlScrapeResult> {
  if (!FIRECRAWL_API_KEY) {
    throw new Error("Firecrawl is not configured. Please add FIRECRAWL_API_KEY to your environment variables.");
  }

  const parsedUrl = validateUrl(url);

  try {
    const response = await axios.post(
      `${FIRECRAWL_API_URL}/v1/scrape`,
      {
        url: parsedUrl.toString(),
        formats: ["markdown"],
        onlyMainContent: true,
        waitFor: 5000,
      },
      {
        headers: {
          Authorization: `Bearer ${FIRECRAWL_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    );

    const data = response.data?.data;
    if (!data?.markdown) {
      throw new Error("The page was empty or returned no readable content.");
    }

    return {
      title: data.title || parsedUrl.hostname,
      markdown: cleanMarkdown(data.markdown),
      url: parsedUrl.toString(),
      metadata: data.metadata || {},
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 404) {
        throw new Error("The requested page could not be found.");
      }
      if (status === 403) {
        throw new Error("The page blocked access. Please try another URL.");
      }
      if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
        throw new Error("The request timed out. Please try again.");
      }
      throw new Error("Firecrawl could not process the page. Please try again later.");
    }

    throw new Error(error instanceof Error ? error.message : "Unable to scrape the page.");
  }
}

function cleanMarkdown(markdown: string): string {
  return markdown
    .replace(/^(?:nav|header|footer|menu|breadcrumb|cookie|subscribe|social).*$/gim, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
