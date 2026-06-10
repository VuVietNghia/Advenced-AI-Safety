import { AIProvider } from "../providers/types.js";

interface PricePerThousandTokens {
  input: number;
  output: number;
}

const zhipuPrices: Record<string, PricePerThousandTokens> = {
  "glm-4.5": { input: 0.00014, output: 0.00014 },
  "glm-4.6": { input: 0.00028, output: 0.00028 },
  "glm-4.7": { input: 0.0014, output: 0.0014 }
};

export function calculateCostUSD(
  provider: AIProvider,
  model: string,
  promptTokens: number,
  completionTokens: number
): number | null {
  if (provider === AIProvider.LM_STUDIO) {
    return null;
  }

  const price = zhipuPrices[model];
  if (!price) {
    return 0;
  }

  return (promptTokens * price.input + completionTokens * price.output) / 1000;
}
