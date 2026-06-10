import { BaseEvaluator } from './base.js';
import { ExactMatchEvaluator } from './exact-match.js';
import { ContainsEvaluator } from './contains.js';
import { JsonSchemaEvaluator } from './json-schema.js';
import { LLMJudgeEvaluator } from './llm-judge.js';

export const EVALUATORS: Record<string, BaseEvaluator> = {
  exact_match: new ExactMatchEvaluator(),
  contains: new ContainsEvaluator(),
  json_schema: new JsonSchemaEvaluator(),
  llm_judge: new LLMJudgeEvaluator()
};
