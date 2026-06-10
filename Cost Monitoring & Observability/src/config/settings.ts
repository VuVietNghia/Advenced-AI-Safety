import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

export interface AppSettings {
  ANTHROPIC_AUTH_TOKEN?: string;
  ANTHROPIC_BASE_URL: string;
  ANTHROPIC_DEFAULT_HAIKU_MODEL: string;
  ANTHROPIC_DEFAULT_SONNET_MODEL: string;
  ANTHROPIC_DEFAULT_OPUS_MODEL: string;
  LM_STUDIO_BASE_URL: string;
  DASHBOARD_PORT: number;
}

const defaults: AppSettings = {
  ANTHROPIC_AUTH_TOKEN: "",
  ANTHROPIC_BASE_URL: "https://llm-hub.roxane.one",
  ANTHROPIC_DEFAULT_HAIKU_MODEL: "glm-4.5",
  ANTHROPIC_DEFAULT_SONNET_MODEL: "glm-4.6",
  ANTHROPIC_DEFAULT_OPUS_MODEL: "glm-4.7",
  LM_STUDIO_BASE_URL: "http://localhost:1234/v1",
  DASHBOARD_PORT: 3000
};

export function loadSettings(): AppSettings {
  const settingsPath = join(process.cwd(), "settings.json");

  if (!existsSync(settingsPath)) {
    return defaults;
  }

  const parsed = JSON.parse(readFileSync(settingsPath, "utf-8")) as Partial<AppSettings>;
  return {
    ...defaults,
    ...parsed,
    DASHBOARD_PORT: Number(parsed.DASHBOARD_PORT ?? defaults.DASHBOARD_PORT)
  };
}

export const settings = loadSettings();
