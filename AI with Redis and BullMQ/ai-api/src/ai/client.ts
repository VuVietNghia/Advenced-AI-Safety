import Anthropic from "@anthropic-ai/sdk";
import { env } from "../config/env.js";

export const anthropic = new Anthropic({
  baseURL: env.ai.baseURL,
  apiKey: env.ai.apiKey,
});
