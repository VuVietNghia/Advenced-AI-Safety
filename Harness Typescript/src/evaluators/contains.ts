import { BaseEvaluator, EvaluatorResult } from './base.js';

export class ContainsEvaluator extends BaseEvaluator {
  constructor() {
    super("contains");
  }

  async evaluate(output: string, expected: any): Promise<EvaluatorResult> {
    if (!Array.isArray(expected)) {
      expected = [expected];
    }
    
    for (const keyword of expected) {
      if (!output.toLowerCase().includes(String(keyword).toLowerCase())) {
        return {
          passed: false,
          score: 0.0,
          reason: `Missing keyword: ${keyword}`
        };
      }
    }
    
    return { passed: true, score: 1.0 };
  }
}
