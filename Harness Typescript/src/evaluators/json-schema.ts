import Ajv from 'ajv';
import { BaseEvaluator, EvaluatorResult } from './base.js';

export class JsonSchemaEvaluator extends BaseEvaluator {
  private ajv: any;

  constructor() {
    super("json_schema");
    const AjvConstructor = (Ajv as any).default || Ajv;
    this.ajv = new AjvConstructor();
  }

  async evaluate(output: string, expected: any): Promise<EvaluatorResult> {
    try {
      // Find JSON block if it's wrapped in markdown ```json
      let cleanOutput = output;
      const match = output.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (match) {
        cleanOutput = match[1];
      }

      const parsed = JSON.parse(cleanOutput);
      const validate = this.ajv.compile(expected);
      const valid = validate(parsed);

      if (!valid) {
        return {
          passed: false,
          score: 0.0,
          reason: `Schema validation error: ${this.ajv.errorsText(validate.errors)}`
        };
      }
      return { passed: true, score: 1.0 };
    } catch (e) {
      return {
        passed: false,
        score: 0.0,
        reason: `Invalid JSON format: ${(e as Error).message}`
      };
    }
  }
}
