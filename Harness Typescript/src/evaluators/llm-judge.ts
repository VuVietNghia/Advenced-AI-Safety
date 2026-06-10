import { BaseEvaluator, EvaluatorResult } from './base.js';
import { REGISTRY } from '../providers/index.js';

export class LLMJudgeEvaluator extends BaseEvaluator {
  constructor() {
    super("llm_judge");
  }

  async evaluate(output: string, expected: any, ...args: any[]): Promise<EvaluatorResult> {
    const judgeProvider = REGISTRY["claude_judge"];
    if (!judgeProvider) {
      return { passed: false, score: 0.0, reason: "Judge provider 'claude_judge' not configured" };
    }

    const prompt = `You are an impartial judge. Evaluate the following AI response against the expected criteria.
    
Expected criteria:
${expected}

AI Response:
${output}

Rate the response on a scale of 1 to 5, where 5 is perfect.
Respond ONLY with a JSON object in the following format:
{"score": <number>, "reason": "<brief reason>"}
`;

    try {
      const judgeResponse = await judgeProvider.complete([{ role: "user", content: prompt }]);
      
      let cleanOutput = judgeResponse;
      const match = judgeResponse.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (match) {
        cleanOutput = match[1];
      }
      
      const parsed = JSON.parse(cleanOutput);
      const rawScore = Number(parsed.score || 0);
      const normalizedScore = rawScore / 5.0;
      
      return {
        passed: rawScore >= 4,
        score: normalizedScore,
        reason: parsed.reason || ""
      };
    } catch (e) {
      return {
        passed: false,
        score: 0.0,
        reason: `Judge evaluation failed: ${(e as Error).message}`
      };
    }
  }
}
