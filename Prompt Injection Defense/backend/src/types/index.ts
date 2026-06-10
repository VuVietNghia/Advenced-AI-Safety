export interface ChatRequest {
  message: string;
}

export interface DefenseLog {
  layer: number | null;
  reason: string | null;
}

export interface ChatResponse {
  reply: string;
  blocked: boolean;
  defenseLog: DefenseLog;
}

export interface DefenseResult {
  blocked: boolean;
  reason?: string;
  sanitizedInput?: string;
}
