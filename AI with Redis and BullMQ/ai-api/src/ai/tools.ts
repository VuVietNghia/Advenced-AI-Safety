import type Anthropic from "@anthropic-ai/sdk";

// Định nghĩa tools cho GLM (Anthropic-compatible format)
export const tools: Anthropic.Tool[] = [
  {
    name: "get_weather",
    description: "Get current weather for a given city. NOTE: Returns MOCK data for demonstration purposes only.",
    input_schema: {
      type: "object" as const,
      properties: {
        city: {
          type: "string",
          description: "City name, e.g. Hanoi",
        },
      },
      required: ["city"],
    },
  },
  {
    name: "calculate",
    description: "Evaluate a math expression safely using mathjs. Supports +, -, *, /, ^, sqrt, sin, cos, etc.",
    input_schema: {
      type: "object" as const,
      properties: {
        expression: {
          type: "string",
          description: "Math expression, e.g. '2 + 2 * 10' or 'sqrt(144)'",
        },
      },
      required: ["expression"],
    },
  },
];
