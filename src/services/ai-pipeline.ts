import { env } from "@/lib/config/env";

export interface PipelineInput {
  content: string;
  sourceType?: string;
  sourceLabel?: string;
  topic?: string;
}

export interface AgentResult<T = Record<string, unknown>> {
  agent: string;
  status: "completed" | "insufficient_evidence";
  confidence: number;
  citations: Array<{ source: string; note: string }>;
  data: T;
}

export interface PipelineOutput {
  researchAnalyzer: AgentResult;
  topicExtractor: AgentResult;
  claimExtractor: AgentResult;
  evidenceEvaluator: AgentResult;
  weakClaimDetector: AgentResult;
  contradictionDetector: AgentResult;
  summaryGenerator: AgentResult;
  recommendationGenerator: AgentResult;
  confidenceScorer: AgentResult;
  humanReviewDecision: AgentResult;
}

interface AgentConfig {
  name: string;
  prompt: string;
}

const OPENROUTER_API_KEY = env.OPENROUTER_API_KEY;
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_MODEL = "openai/gpt-4o-mini";

export async function runAiProcessingPipeline(input: PipelineInput): Promise<PipelineOutput> {
  if (!OPENROUTER_API_KEY) {
    throw new Error("OpenRouter API key is not configured. Set OPENROUTER_API_KEY to run the AI pipeline.");
  }

  const context = {
    sourceType: input.sourceType ?? "unknown",
    sourceLabel: input.sourceLabel ?? "unknown",
    topic: input.topic ?? "",
    content: input.content,
  };

  const agents: AgentConfig[] = [
    {
      name: "researchAnalyzer",
      prompt: `You are the Research Analyzer. Analyze the provided research content. Return ONLY valid JSON with fields: description, keyFindings, evidenceStatus, citations, confidence. If evidence is missing, set evidenceStatus to "insufficient_evidence" and do not invent facts.`,
    },
    {
      name: "topicExtractor",
      prompt: `You are the Topic Extractor. Extract the core topic, subtopics, and themes from the research content. Return ONLY valid JSON with fields: primaryTopic, subtopics, themes, citations, confidence. If evidence is missing, explicitly state that evidence is insufficient and do not invent facts.`,
    },
    {
      name: "claimExtractor",
      prompt: `You are the Claim Extractor. Extract claims that can be supported or challenged. Return ONLY valid JSON with fields: claims, citations, confidence. If evidence is missing, explicitly state that evidence is insufficient. Never invent facts.`,
    },
    {
      name: "evidenceEvaluator",
      prompt: `You are the Evidence Evaluator. Evaluate the strength of the evidence for each claim. Return ONLY valid JSON with fields: evaluations, citations, confidence. If evidence is insufficient, mark it clearly and do not invent details.`,
    },
    {
      name: "weakClaimDetector",
      prompt: `You are the Weak Claim Detector. Identify weak or unsupported claims. Return ONLY valid JSON with fields: weakClaims, citations, confidence. If evidence is missing, clearly state that evidence is insufficient.`,
    },
    {
      name: "contradictionDetector",
      prompt: `You are the Contradiction Detector. Identify contradictions between claims or statements. Return ONLY valid JSON with fields: contradictions, citations, confidence. If no contradiction is supported, return an empty array and explain that evidence is insufficient if needed.`,
    },
    {
      name: "summaryGenerator",
      prompt: `You are the Summary Generator. Produce a concise research summary. Return ONLY valid JSON with fields: summary, keyTakeaways, citations, confidence. Do not invent missing facts; if evidence is insufficient, say so.`,
    },
    {
      name: "recommendationGenerator",
      prompt: `You are the Recommendation Generator. Create recommendations grounded only in the evidence. Return ONLY valid JSON with fields: recommendations, citations, confidence. If evidence is insufficient, say so and avoid speculation.`,
    },
    {
      name: "confidenceScorer",
      prompt: `You are the Confidence Scorer. Score the overall reliability of the analysis. Return ONLY valid JSON with fields: overallConfidence, rationale, confidence. If evidence is insufficient, lower the confidence and explain why.`,
    },
    {
      name: "humanReviewDecision",
      prompt: `You are the Human Review Decision Agent. Decide whether the content requires human review. Return ONLY valid JSON with fields: decision, reasons, citations, confidence. Use conservative judgment and state that evidence is insufficient when required.`,
    },
  ];

  const results: Partial<PipelineOutput> = {};

  for (const agent of agents) {
    const response = await callOpenRouterAgent(agent.name, agent.prompt, context, results);
    results[agent.name.replace(/[-\s]+/g, "_") as keyof PipelineOutput] = response as never;
  }

  return results as PipelineOutput;
}

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function callOpenRouterAgent(
  agentName: string,
  prompt: string,
  context: PipelineInput & { content: string },
  previousResults: Partial<PipelineOutput>,
  retryCount = 0
): Promise<AgentResult> {
  const maxRetries = 5;
  const baseDelay = 2000; // 2 seconds

  const requestPayload = {
    model: OPENROUTER_MODEL,
    messages: [
      {
        role: "system",
        content: "You are a careful research assistant. Respond with valid JSON only. Never invent facts. If evidence is missing, explicitly state that evidence is insufficient. Include citations when available. Do not include Markdown or commentary.",
      },
      {
        role: "user",
        content: `${prompt}\n\nResearch context:\n${JSON.stringify({
          sourceType: context.sourceType,
          sourceLabel: context.sourceLabel,
          topic: context.topic,
          content: context.content.slice(0, 25000),
          previousResults,
        }, null, 2)}`,
      },
    ],
    temperature: 0.2,
  };

  const response = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://insightflow-ai.com",
      "X-Title": "InsightFlow AI",
    },
    body: JSON.stringify(requestPayload),
  });

  if (!response.ok) {
    const text = await response.text();

    // Handle rate limiting (429) with exponential backoff
    if (response.status === 429 && retryCount < maxRetries) {
      const delay = baseDelay * Math.pow(2, retryCount);
      console.log(`Rate limit hit for ${agentName}. Retrying in ${Math.round(delay / 1000)}s (attempt ${retryCount + 1}/${maxRetries})...`);
      await sleep(delay);
      return callOpenRouterAgent(agentName, prompt, context, previousResults, retryCount + 1);
    }

    throw new Error(`OpenRouter request failed for ${agentName}: ${text}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content ?? "{}";
  const parsed = safeParseJson(text, agentName);

  return {
    agent: agentName,
    status: parsed.evidenceInsufficient || parsed.evidenceStatus === "insufficient_evidence" ? "insufficient_evidence" : "completed",
    confidence: typeof parsed.confidence === "number" ? parsed.confidence : 0.3,
    citations: Array.isArray(parsed.citations) ? parsed.citations : [],
    data: parsed,
  };
}

function safeParseJson(rawText: string, agentName: string): Record<string, unknown> {
  try {
    return JSON.parse(rawText);
  } catch {
    const match = rawText.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        return {
          error: `OpenRouter returned invalid JSON for ${agentName}`,
          evidenceInsufficient: true,
          confidence: 0.1,
        };
      }
    }
    return {
      error: `OpenRouter returned invalid JSON for ${agentName}`,
      evidenceInsufficient: true,
      confidence: 0.1,
    };
  }
}