import "dotenv/config";

export type ProviderName = "local" | "frontier";

export interface AppConfig {
  provider: ProviderName;
  local: {
    baseUrl: string;
    model: string;
  };
  frontier: {
    apiKey: string;
    model: string;
    baseUrl: string;
  };
}

function readProvider(value: string | undefined): ProviderName {
  if (value === "frontier") {
    return "frontier";
  }

  return "local";
}

export const config: AppConfig = {
  provider: readProvider(process.env.PROVIDER),
  local: {
    baseUrl: process.env.LOCAL_BASE_URL ?? "http://localhost:1234/v1",
    model: process.env.LOCAL_MODEL ?? "qwen-3.5-9b"
  },
  frontier: {
    apiKey: process.env.FRONTIER_API_KEY ?? process.env.ZAI_API_KEY ?? "",
    model: process.env.FRONTIER_MODEL ?? process.env.ZAI_MODEL ?? "glm 4.6",
    baseUrl: process.env.FRONTIER_BASE_URL ?? "https://llm-hub.roxane.one/v1"
  }
};

export function validateConfig(appConfig: AppConfig): void {
  if (appConfig.provider === "frontier" && !appConfig.frontier.apiKey) {
    throw new Error("FRONTIER_API_KEY is required when PROVIDER=frontier.");
  }
}
