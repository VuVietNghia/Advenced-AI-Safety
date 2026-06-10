import type { LLMProvider } from "../providers/types.js";
import type { ConversationMemory } from "../memory/conversation-memory.js";
import type { ToolRegistry } from "../tools/tool-registry.js";
import { Executor } from "./executor.js";
import { Planner } from "./planner.js";
import type { PlanStep, StepExecutionResult } from "./types.js";
import { Verifier } from "./verifier.js";

const color = {
  blue: (value: string) => `\x1b[34m${value}\x1b[0m`,
  cyan: (value: string) => `\x1b[36m${value}\x1b[0m`,
  green: (value: string) => `\x1b[32m${value}\x1b[0m`,
  red: (value: string) => `\x1b[31m${value}\x1b[0m`,
  yellow: (value: string) => `\x1b[33m${value}\x1b[0m`,
  bold: (value: string) => `\x1b[1m${value}\x1b[0m`
};

export interface AgentLoopOptions {
  maxIterations?: number;
  maxStepRetries?: number;
}

export class AgentLoop {
  private readonly planner: Planner;
  private readonly executor: Executor;
  private readonly verifier: Verifier;
  private readonly maxIterations: number;
  private readonly maxStepRetries: number;

  constructor(
    private readonly provider: LLMProvider,
    tools: ToolRegistry,
    private readonly memory: ConversationMemory,
    options: AgentLoopOptions = {}
  ) {
    this.planner = new Planner(provider, tools);
    this.executor = new Executor(provider, tools, memory);
    this.verifier = new Verifier(provider, memory);
    this.maxIterations = options.maxIterations ?? 10;
    this.maxStepRetries = options.maxStepRetries ?? 2;
  }

  async run(task: string): Promise<string> {
    this.memory.addMessage({ role: "user", content: task });
    console.log(color.bold(`\n🎯 Task: ${task}`));

    let iteration = 0;
    let replanReason: string | undefined;

    while (iteration < this.maxIterations) {
      iteration += 1;
      const plan = await this.planner.createPlan(task, replanReason);
      this.memory.setPlan(plan);
      printPlan(plan);

      let shouldReplan = false;

      for (const step of plan) {
        const stepDone = await this.runStep(task, step);

        if (stepDone === "REPLAN") {
          shouldReplan = true;
          replanReason = `Step ${step.id} required replanning.`;
          break;
        }
      }

      if (!shouldReplan) {
        const finalAnswer = await this.buildFinalAnswer(task);
        this.memory.addMessage({ role: "assistant", content: finalAnswer });
        console.log(color.green(`\n🏁 FINAL ANSWER:\n${finalAnswer}`));
        return finalAnswer;
      }

      console.log(color.yellow("\n🔁 Replanning requested by verifier..."));
    }

    const fallback = "Agent stopped because maxIterations was reached before a stable final answer.";
    console.log(color.red(`\n${fallback}`));
    return fallback;
  }

  private async runStep(task: string, step: PlanStep): Promise<"DONE" | "REPLAN"> {
    for (let attempt = 1; attempt <= this.maxStepRetries + 1; attempt += 1) {
      this.memory.updateStepStatus(step.id, "running");
      console.log(color.cyan(`\n⚡ EXECUTE Step ${step.id}: ${step.description}`));

      const result = await this.executor.execute(step, task);
      this.memory.addStepResult(result);
      printExecutionResult(result);

      const verification = await this.verifier.verify(task, result);
      console.log(color.blue(`✅ VERIFY Step ${step.id}: ${verification.status} - ${verification.reason}`));

      if (verification.status === "SUCCESS") {
        this.memory.updateStepStatus(step.id, "success");
        return "DONE";
      }

      if (verification.status === "REPLAN") {
        this.memory.updateStepStatus(step.id, "failed");
        return "REPLAN";
      }

      if (attempt <= this.maxStepRetries) {
        console.log(color.yellow(`↻ RETRY Step ${step.id}: attempt ${attempt + 1}/${this.maxStepRetries + 1}`));
      }
    }

    this.memory.updateStepStatus(step.id, "failed");
    return "REPLAN";
  }

  private async buildFinalAnswer(task: string): Promise<string> {
    const results = this.memory.getStepResults();
    const summary = results.map((result) => [
      `Step ${result.stepId}: ${result.description}`,
      `Tool: ${result.toolName ?? "none"}`,
      result.error ? `Error: ${result.error}` : null,
      `Output: ${result.output}`
    ].filter(Boolean).join("\n")).join("\n\n");

    const response = await this.provider.chat([
      {
        role: "system",
        content: [
          "You are the FINAL ANSWER module of an educational TypeScript AI agent.",
          "Write a concise, helpful answer to the user's original task using the verified step results.",
          "If some attempts failed but later steps succeeded, ignore the failed attempts unless they matter."
        ].join("\n")
      },
      {
        role: "user",
        content: [
          `Original task: ${task}`,
          "Workflow results:",
          summary
        ].join("\n\n")
      }
    ]);

    if (response.text?.trim()) {
      return response.text.trim();
    }

    return [
      "Tổng hợp kết quả workflow:",
      `Task: ${task}`,
      "",
      summary
    ].join("\n");
  }
}

function printPlan(plan: PlanStep[]): void {
  console.log(color.bold(color.blue(`\n📋 PLAN (${plan.length} steps):`)));
  for (const step of plan) {
    console.log(`  Step ${step.id}: ${step.description} → tool: ${step.tool ?? "none"}`);
  }
}

function printExecutionResult(result: StepExecutionResult): void {
  if (result.toolName) {
    console.log(`  Tool: ${result.toolName}(${JSON.stringify(result.toolInput ?? {})})`);
  }

  console.log(`  → Kết quả: ${result.output}`);

  if (result.error) {
    console.log(color.red(`  Error: ${result.error}`));
  }
}
