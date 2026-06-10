import { BaseEvaluator, EvaluatorResult } from './base.js';

export class ExactMatchEvaluator extends BaseEvaluator {
  constructor() {
    super("exact_match");
  }

  async evaluate(output: string, expected: any): Promise<EvaluatorResult> {
    const passed = output.trim() === String(expected).trim();
    if (!passed) {
      const displayOut = output.length > 50 ? output.substring(0, 50) + "..." : output;
      return {
        passed: false,
        score: 0.0,
        reason: `Expected '${expected}', got '${displayOut}'`
      };
    }
    return { passed: true, score: 1.0 };
  }
}
