export interface EvaluatorResult {
  passed: boolean;
  score: number;
  reason?: string;
}

export abstract class BaseEvaluator {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  abstract evaluate(output: string, expected: any, ...args: any[]): Promise<EvaluatorResult>;
}
