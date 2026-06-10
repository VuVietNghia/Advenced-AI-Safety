export type StepStatus = "pending" | "running" | "success" | "failed";

export interface PlanStep {
  id: number;
  description: string;
  tool: string | null;
  reasoning: string;
  status: StepStatus;
}

export interface StepExecutionResult {
  stepId: number;
  description: string;
  output: string;
  toolName: string | null;
  toolInput: Record<string, unknown> | null;
  error: string | null;
}

export type VerificationStatus = "SUCCESS" | "RETRY" | "REPLAN";

export interface VerificationResult {
  status: VerificationStatus;
  reason: string;
}
