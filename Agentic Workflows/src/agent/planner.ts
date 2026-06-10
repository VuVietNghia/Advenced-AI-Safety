import type { LLMProvider } from "../providers/types.js";
import type { ToolRegistry } from "../tools/tool-registry.js";
import type { PlanStep } from "./types.js";
import { extractJsonObject } from "./json-utils.js";

interface PlanPayload {
  steps: Array<{
    id: number;
    description: string;
    tool: string | null;
    reasoning: string;
  }>;
}

export class Planner {
  constructor(
    private readonly provider: LLMProvider,
    private readonly tools: ToolRegistry
  ) {}

  async createPlan(task: string, previousFailure?: string): Promise<PlanStep[]> {
    const toolNames = this.tools.getToolNames().join(", ");

    for (let attempt = 1; attempt <= 3; attempt += 1) {
      const response = await this.provider.chat([
        {
          role: "system",
          content: [
            "You are the PLAN module of an educational TypeScript AI agent.",
            "Break the user task into 3-5 small steps.",
            "Return only valid JSON with this schema:",
            "{\"steps\":[{\"id\":1,\"description\":\"...\",\"tool\":\"web_search|calculator|file_reader|null\",\"reasoning\":\"...\"}]}",
            `Available tools: ${toolNames}. Use null when no tool is needed.`,
            "Do not execute the task yet."
          ].join("\n")
        },
        {
          role: "user",
          content: previousFailure
            ? `Task: ${task}\nPrevious failure to account for: ${previousFailure}`
            : `Task: ${task}`
        }
      ]);

      const parsed = extractJsonObject<PlanPayload>(response.text);
      if (parsed?.steps?.length) {
        return parsed.steps.map((step, index) => ({
          id: Number.isInteger(step.id) ? step.id : index + 1,
          description: String(step.description ?? `Step ${index + 1}`),
          tool: normalizeTool(step.tool, this.tools.getToolNames()),
          reasoning: String(step.reasoning ?? "No reasoning provided."),
          status: "pending"
        }));
      }
    }

    return createFallbackPlan(task);
  }
}

function normalizeTool(tool: string | null, availableTools: string[]): string | null {
  if (!tool || tool === "null") {
    return null;
  }

  return availableTools.includes(tool) ? tool : null;
}

function createFallbackPlan(task: string): PlanStep[] {
  const lowerTask = task.toLocaleLowerCase("vi-VN");
  const steps: PlanStep[] = [];

  if (/(dân số|population|tìm|search|web)/i.test(lowerTask)) {
    steps.push({
      id: steps.length + 1,
      description: "Tìm thông tin cần thiết bằng web_search.",
      tool: "web_search",
      reasoning: "Task có dấu hiệu cần tra cứu thông tin.",
      status: "pending"
    });
  }

  if (/[0-9][0-9\s+\-*/().,%]*(\+|-|\*|\/)/.test(task) || /(tính|calculate|per capita|chia)/i.test(lowerTask)) {
    steps.push({
      id: steps.length + 1,
      description: "Tính toán các giá trị cần thiết bằng calculator.",
      tool: "calculator",
      reasoning: "Task có dấu hiệu cần tính toán.",
      status: "pending"
    });
  }

  steps.push({
    id: steps.length + 1,
    description: "Tổng hợp kết quả thành câu trả lời cuối cùng.",
    tool: null,
    reasoning: "Cần trình bày kết quả rõ ràng cho user.",
    status: "pending"
  });

  return steps;
}
