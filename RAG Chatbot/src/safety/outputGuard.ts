import { z } from "zod";

// Define expected LLM output structure
// The prompt builder must instruct the LLM to respond in this JSON format
export const LLMOutputSchema = z.object({
  answer: z.string().min(1).max(3000),
  sources_used: z.array(z.number()).min(0), // indices of context sources actually used
  confidence: z.enum(["high", "medium", "low"]),
});

export type LLMOutput = z.infer<typeof LLMOutputSchema>;

export interface OutputGuardResult {
  valid: boolean;
  output?: LLMOutput;
  error?: string;
  rawText?: string;
}

// Forbidden phrases in output (hallucination / leakage indicators)
const FORBIDDEN_OUTPUT_PATTERNS: RegExp[] = [
  /as\s+an\s+AI\s+language\s+model/i,
  /I\s+don't\s+have\s+access\s+to\s+real[\s-]time/i,
  /my\s+training\s+data/i,
];

// Extract JSON from mixed text output (fallback for small models)
function extractJSON(raw: string): string {
  const match = raw.match(/\{[\s\S]*\}/);
  if (match) return match[0];

  // Last resort: wrap plain text as structured response
  return JSON.stringify({
    answer: raw.trim(),
    sources_used: [],
    confidence: "low",
  });
}

export function validateOutput(rawOutput: string, numContextChunks: number): OutputGuardResult {
  // Strip markdown code fences if LLM wraps JSON in ```
  const cleaned = rawOutput.replace(/```(?:json)?\s*/g, "").replace(/```/g, "").trim();

  // Attempt JSON parse with fallback extraction
  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    try {
      parsed = JSON.parse(extractJSON(cleaned));
    } catch {
      return {
        valid: false,
        error: "Output is not valid JSON",
        rawText: rawOutput,
      };
    }
  }

  // Zod schema validation
  const result = LLMOutputSchema.safeParse(parsed);
  if (!result.success) {
    return {
      valid: false,
      error: `Schema validation failed: ${result.error.message}`,
      rawText: rawOutput,
    };
  }

  // Forbidden pattern check on the answer text
  for (const pattern of FORBIDDEN_OUTPUT_PATTERNS) {
    if (pattern.test(result.data.answer)) {
      return {
        valid: false,
        error: "Output contains forbidden pattern",
        rawText: rawOutput,
      };
    }
  }

  // Grounding check: verify source indices are within valid range
  for (const idx of result.data.sources_used) {
    if (idx < 1 || idx > numContextChunks) {
      return {
        valid: false,
        error: `Source index ${idx} out of range [1..${numContextChunks}]`,
        rawText: rawOutput,
      };
    }
  }

  return { valid: true, output: result.data };
}
