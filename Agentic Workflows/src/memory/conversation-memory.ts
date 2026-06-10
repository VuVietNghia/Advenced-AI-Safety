import type { Message } from "../providers/types.js";
import type { PlanStep, StepExecutionResult, StepStatus } from "../agent/types.js";

export class ConversationMemory {
  private readonly messages: Message[] = [];
  private plan: PlanStep[] = [];
  private readonly stepResults: StepExecutionResult[] = [];

  addMessage(message: Message): void {
    this.messages.push(message);
  }

  getMessages(): Message[] {
    return [...this.messages];
  }

  setPlan(steps: PlanStep[]): void {
    this.plan = steps;
  }

  getPlan(): PlanStep[] {
    return this.plan.map((step) => ({ ...step }));
  }

  updateStepStatus(stepId: number, status: StepStatus): void {
    this.plan = this.plan.map((step) => step.id === stepId ? { ...step, status } : step);
  }

  addStepResult(result: StepExecutionResult): void {
    this.stepResults.push(result);
  }

  getStepResults(): StepExecutionResult[] {
    return this.stepResults.map((result) => ({
      ...result,
      toolInput: result.toolInput ? { ...result.toolInput } : null
    }));
  }

  getExecutionContext(): string {
    if (this.stepResults.length === 0) {
      return "No previous step results yet.";
    }

    return this.stepResults
      .map((result) => [
        `Step ${result.stepId}: ${result.description}`,
        `Tool: ${result.toolName ?? "none"}`,
        `Input: ${result.toolInput ? JSON.stringify(result.toolInput) : "none"}`,
        `Output: ${result.output}`,
        result.error ? `Error: ${result.error}` : null
      ].filter(Boolean).join("\n"))
      .join("\n\n");
  }
}
