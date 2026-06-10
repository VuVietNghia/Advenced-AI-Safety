import pLimit from 'p-limit';
import { BaseProvider } from '../providers/base.js';
import { EVALUATORS } from '../evaluators/index.js';

export interface TestCase {
  id: string;
  prompt?: string;
  input?: string;
  evaluator?: string;
  eval_type?: string;
  expected?: any;
  expected_contains?: any;
}

export interface TestResult {
  provider: string;
  test_id: string;
  passed: boolean;
  score: number;
  latency_ms: number;
  reason: string;
  error: string;
}

export async function runSuite(testCases: TestCase[], providers: BaseProvider[]): Promise<TestResult[]> {
  const limit = pLimit(5);
  const results: TestResult[] = [];

  const tasks = [];

  for (const testCase of testCases) {
    for (const provider of providers) {
      tasks.push(limit(async () => {
        const start = Date.now();
        const result: TestResult = {
          provider: provider.name,
          test_id: testCase.id,
          passed: false,
          score: 0.0,
          latency_ms: 0,
          reason: "",
          error: ""
        };

        try {
          const content = testCase.prompt || testCase.input || "";
          const output = await provider.complete([{ role: "user", content: content }]);
          result.latency_ms = Date.now() - start;

          const evaluatorName = testCase.evaluator || testCase.eval_type || "exact_match";
          const expected = testCase.expected !== undefined ? testCase.expected : testCase.expected_contains;
          const evaluator = EVALUATORS[evaluatorName];
          
          if (!evaluator) {
            result.error = `Evaluator '${evaluatorName}' not found`;
          } else {
            const evalResult = await evaluator.evaluate(output, expected);
            result.passed = evalResult.passed;
            result.score = evalResult.score;
            result.reason = evalResult.reason || "";
          }
        } catch (e) {
          result.latency_ms = Date.now() - start;
          result.error = (e as Error).message;
        }

        results.push(result);
      }));
    }
  }

  await Promise.all(tasks);
  return results;
}
