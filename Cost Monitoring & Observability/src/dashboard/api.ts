import { Router } from "express";
import { aiClient } from "../core/aiClient.js";
import {
  getAllMetrics,
  getRecentMetrics,
  getSummary,
  getSummaryByModel,
  getSummaryByProvider
} from "../storage/database.js";
import { AIProvider } from "../providers/types.js";

export const apiRouter = Router();

function parseProvider(value: unknown): AIProvider | undefined {
  if (value === AIProvider.LM_STUDIO || value === "lm_studio") {
    return AIProvider.LM_STUDIO;
  }

  if (value === AIProvider.ZHIPU_API || value === "zhipu_api") {
    return AIProvider.ZHIPU_API;
  }

  return undefined;
}

apiRouter.get("/metrics", (req, res) => {
  const provider = parseProvider(req.query.provider);
  const limit = req.query.limit ? Number(req.query.limit) : undefined;

  res.json({
    metrics: getAllMetrics({ provider, limit })
  });
});

apiRouter.get("/summary", (_req, res) => {
  res.json(getSummary());
});

apiRouter.get("/summary/by-provider", (_req, res) => {
  res.json({
    providers: getSummaryByProvider()
  });
});

apiRouter.get("/summary/by-model", (_req, res) => {
  res.json({
    models: getSummaryByModel()
  });
});

apiRouter.get("/recent", (req, res) => {
  const limit = req.query.n ? Number(req.query.n) : 20;
  res.json({
    metrics: getRecentMetrics(limit)
  });
});

apiRouter.post("/chat", async (req, res) => {
  const prompt = String(req.body?.prompt ?? "").trim();
  const provider = parseProvider(req.body?.provider);
  const model = String(req.body?.model ?? "").trim();

  if (!prompt) {
    res.status(400).json({ error: "Prompt is required." });
    return;
  }

  if (!provider) {
    res.status(400).json({ error: "Provider must be LM_STUDIO or ZHIPU_API." });
    return;
  }

  const response = await aiClient.chat({
    prompt,
    provider,
    model,
    userId: req.body?.userId ? String(req.body.userId) : undefined
  });

  res.status(response.metrics.isError ? 502 : 200).json(response);
});
