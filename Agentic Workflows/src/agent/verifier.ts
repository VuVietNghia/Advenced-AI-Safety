import type { LLMProvider } from "../providers/types.js";
import type { ConversationMemory } from "../memory/conversation-memory.js";
import type { StepExecutionResult, VerificationResult, VerificationStatus } from "./types.js";
import { extractJsonObject } from "./json-utils.js";

interface VerificationPayload {
  status: VerificationStatus;
  reason: string;
}

export class Verifier {
  constructor(
    private readonly provider: LLMProvider,
    private readonly memory: ConversationMemory
  ) {}

  async verify(task: string, result: StepExecutionResult): Promise<VerificationResult> {
    if (result.error) {
      return {
        status: "RETRY",
        reason: `Tool error: ${result.error}`
      };
    }

    const response = await this.provider.chat([
      {
        role: "system",
        content: [
          "You are the VERIFY module of an educational TypeScript AI agent.",
          "Judge whether the current step result is sufficient.",
          "Return only valid JSON: {\"status\":\"SUCCESS|RETRY|REPLAN\",\"reason\":\"...\"}.",
          "Use RETRY for a transient or fixable execution issue.",
          "Use REPLAN if the plan is unsuitable for the original task."
        ].join("\n")
      },
      {
        role: "user",
        content: [
          `Original task: ${task}`,
          "All previous context:",
          this.memory.getExecutionContext(),
          "Current result:",
          JSON.stringify(result, null, 2)
        ].join("\n\n")
      }
    ]);

    const parsed = extractJsonObject<VerificationPayload>(response.text);
    if (!parsed || !["SUCCESS", "RETRY", "REPLAN"].includes(parsed.status)) {
      return {
        status: "SUCCESS",
        reason: "Verifier returned invalid JSON, but the step produced a non-error result."
      };
    }

    return {
      status: parsed.status,
      reason: String(parsed.reason ?? "No reason provided.")
    };
  }
}
