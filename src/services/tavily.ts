import axios from "axios";
import { env } from "@/lib/config/env";

export type TavilyCategory = "news" | "business" | "technology" | "marketing";

export interface TavilyResult {
  title: string;
  url: string;
  summary: string;
  content: string;
}

interface TavilySearchResponse {
  results?: Array<{
    title?: string;
    url?: string;
    content?: string;
    score?: number;
  }>;
}

const TAVILY_API_URL = env.TAVILY_API_URL || "https://api.tavily.com/search";
const TAVILY_API_KEY = env.TAVILY_API_KEY;

export async function searchWithTavily(topic: string, category: TavilyCategory): Promise<TavilyResult[]> {
  if (!TAVILY_API_KEY) {
    throw new Error("Tavily is not configured. Please add TAVILY_API_KEY to your environment variables.");
  }

  if (!topic.trim()) {
    throw new Error("Please enter a topic to search.");
  }

  try {
    const response = await axios.post<TavilySearchResponse>(
      TAVILY_API_URL,
      {
        query: `${topic} ${category}`,
        search_depth: "basic",
        include_domains: [],
        include_answer: false,
        include_raw_content: true,
        max_results: 5,
      },
      {
        headers: {
          Authorization: `Bearer ${TAVILY_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    );

    const items = response.data?.results ?? [];
    if (!items.length) {
      throw new Error("No results were found for that topic.");
    }

    return items.map((item) => ({
      title: item.title ?? "Untitled result",
      url: item.url ?? "",
      summary: item.content?.slice(0, 220) ?? "No summary available.",
      content: item.content ?? "",
    }));
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error("Tavily authentication failed. Please verify your API key.");
      }
      if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
        throw new Error("The Tavily request timed out. Please try again.");
      }
      throw new Error("Tavily could not complete the search. Please try again later.");
    }

    throw new Error(error instanceof Error ? error.message : "Unable to run the search.");
  }
}
