import type { LLMProvider } from "../providers/types.js";
import type { ToolRegistry } from "../tools/tool-registry.js";
import type { ConversationMemory } from "../memory/conversation-memory.js";
import type { PlanStep, StepExecutionResult } from "./types.js";

export class Executor {
  constructor(
    private readonly provider: LLMProvider,
    private readonly tools: ToolRegistry,
    private readonly memory: ConversationMemory
  ) {}

  async execute(step: PlanStep, task: string): Promise<StepExecutionResult> {
    const response = await this.provider.chat([
      {
        role: "system",
        content: [
          "You are the EXECUTE module of an educational TypeScript AI agent.",
          "Complete exactly the current step.",
          "If a tool is useful, call one tool with precise JSON input.",
          "If no tool is needed, answer with concise execution output."
        ].join("\n")
      },
      {
        role: "user",
        content: [
          `Original task: ${task}`,
          `Current step: ${step.description}`,
          `Suggested tool: ${step.tool ?? "none"}`,
          "Previous context:",
          this.memory.getExecutionContext()
        ].join("\n\n")
      }
    ], this.tools.getDefinitions());

    if (response.toolCalls.length === 0) {
      return {
        stepId: step.id,
        description: step.description,
        output: response.text ?? "No output returned by model.",
        toolName: null,
        toolInput: null,
        error: null
      };
    }

    const toolCall = response.toolCalls[0];
    try {
      const output = await this.tools.execute(toolCall.toolName, toolCall.toolInput);
      return {
        stepId: step.id,
        description: step.description,
        output,
        toolName: toolCall.toolName,
        toolInput: toolCall.toolInput,
        error: null
      };
    } catch (error) {
      return {
        stepId: step.id,
        description: step.description,
        output: "Tool execution failed.",
        toolName: toolCall.toolName,
        toolInput: toolCall.toolInput,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
}
