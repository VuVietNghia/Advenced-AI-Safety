import { describe, it, expect } from 'vitest';
import { ExactMatchEvaluator } from '../src/evaluators/exact-match.js';
import { ContainsEvaluator } from '../src/evaluators/contains.js';
import { JsonSchemaEvaluator } from '../src/evaluators/json-schema.js';

describe('ExactMatchEvaluator', () => {
  it('should pass on exact match', async () => {
    const evaluator = new ExactMatchEvaluator();
    const result = await evaluator.evaluate("123", "123");
    expect(result.passed).toBe(true);
    expect(result.score).toBe(1.0);
  });

  it('should fail on mismatch', async () => {
    const evaluator = new ExactMatchEvaluator();
    const result = await evaluator.evaluate("124", "123");
    expect(result.passed).toBe(false);
    expect(result.score).toBe(0.0);
    expect(result.reason).toContain("Expected '123'");
  });
});

describe('ContainsEvaluator', () => {
  it('should pass when all keywords are present', async () => {
    const evaluator = new ContainsEvaluator();
    const result = await evaluator.evaluate("Hello world and universe", ["world", "Universe"]);
    expect(result.passed).toBe(true);
    expect(result.score).toBe(1.0);
  });

  it('should fail when a keyword is missing', async () => {
    const evaluator = new ContainsEvaluator();
    const result = await evaluator.evaluate("Hello world", ["world", "universe"]);
    expect(result.passed).toBe(false);
    expect(result.score).toBe(0.0);
    expect(result.reason).toContain("universe");
  });
});

describe('JsonSchemaEvaluator', () => {
  it('should pass valid JSON schema', async () => {
    const evaluator = new JsonSchemaEvaluator();
    const output = '```json\n{"name": "Alice", "age": 30}\n```';
    const schema = {
      type: "object",
      properties: {
        name: { type: "string" },
        age: { type: "number" }
      },
      required: ["name", "age"]
    };
    
    const result = await evaluator.evaluate(output, schema);
    expect(result.passed).toBe(true);
    expect(result.score).toBe(1.0);
  });

  it('should fail invalid JSON schema', async () => {
    const evaluator = new JsonSchemaEvaluator();
    const output = '{"name": "Alice", "age": "thirty"}';
    const schema = {
      type: "object",
      properties: {
        name: { type: "string" },
        age: { type: "number" }
      },
      required: ["name", "age"]
    };
    
    const result = await evaluator.evaluate(output, schema);
    expect(result.passed).toBe(false);
    expect(result.score).toBe(0.0);
  });
});
