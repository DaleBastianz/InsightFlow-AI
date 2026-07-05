import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  ANTHROPIC_API_URL: z.string().optional(),
  ANTHROPIC_MODEL: z.string().optional(),
  FIRECRAWL_API_KEY: z.string().optional(),
  FIRECRAWL_API_URL: z.string().optional(),
  TAVILY_API_KEY: z.string().optional(),
  TAVILY_API_URL: z.string().optional(),
  OPENROUTER_API_KEY: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

export const env = parsed.success
  ? parsed.data
  : {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
      ANTHROPIC_API_URL: process.env.ANTHROPIC_API_URL,
      ANTHROPIC_MODEL: process.env.ANTHROPIC_MODEL,
      FIRECRAWL_API_KEY: process.env.FIRECRAWL_API_KEY,
      FIRECRAWL_API_URL: process.env.FIRECRAWL_API_URL,
      TAVILY_API_KEY: process.env.TAVILY_API_KEY,
      TAVILY_API_URL: process.env.TAVILY_API_URL,
      OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
    };
