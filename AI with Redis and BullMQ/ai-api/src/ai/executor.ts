import { evaluate } from "mathjs";
import { logger } from "../logger/app-logger.js";

// Dispatch tool call → trả về string result
export async function executeTool(
  name: string,
  input: Record<string, unknown>
): Promise<string> {
  switch (name) {
    case "get_weather": {
      const city = input.city as string;
      // ⚠️ MOCK DATA — chỉ phục vụ demo
      logger.info({ tool: name, input: { city } }, "[executor] Tool called");
      return JSON.stringify({
        city,
        temp: "32°C",
        condition: "Sunny",
        _demo: true,
        _notice: "This is MOCK data for demonstration only",
      });
    }

    case "calculate": {
      const expr = input.expression as string;
      logger.info({ tool: name, input: { expression: expr } }, "[executor] Tool called");
      try {
        // mathjs — safe math evaluation, không dùng eval/Function
        const result = evaluate(expr);
        return String(result);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        logger.error({ tool: name, expr, err: message }, "[executor] Calculate failed");
        return `Error: ${message}`;
      }
    }

    default:
      logger.warn({ tool: name }, "[executor] Unknown tool called");
      return `Error: Unknown tool "${name}"`;
  }
}
