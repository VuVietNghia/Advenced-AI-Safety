import type { AgentTool } from "./tool-registry.js";

const ALLOWED_EXPRESSION = /^[\d\s+\-*/().,%]+$/;

export class CalculatorTool implements AgentTool {
  definition = {
    name: "calculator",
    description: "Evaluate a numeric math expression. Use this for arithmetic, percentages, ratios, and unit calculations.",
    parameters: {
      type: "object",
      properties: {
        expression: {
          type: "string",
          description: "A numeric expression, for example: (430000000000 / 100000000)"
        }
      },
      required: ["expression"],
      additionalProperties: false
    }
  };

  async execute(input: Record<string, unknown>): Promise<string> {
    const expression = String(input.expression ?? "").replace(/,/g, "");

    if (!expression.trim()) {
      throw new Error("calculator requires a non-empty expression.");
    }

    if (!ALLOWED_EXPRESSION.test(expression)) {
      throw new Error("calculator only accepts numbers, whitespace, parentheses, and arithmetic operators.");
    }

    const normalized = expression.replace(/%/g, "/100");
    const result: unknown = Function(`"use strict"; return (${normalized});`)();

    if (typeof result !== "number" || !Number.isFinite(result)) {
      throw new Error("calculator result is not a finite number.");
    }

    return `${expression} = ${result}`;
  }
}
