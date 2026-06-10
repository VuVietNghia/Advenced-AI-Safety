import { Router } from "express";
import { aiQueue } from "../queue/ai-queue.js";
import type { AiJobData, AiJobResult } from "../queue/job-types.js";

const router = Router();

// POST /api/ask — thêm job vào queue
router.post("/ask", async (req, res) => {
  const { prompt, messages } = req.body as AiJobData;

  if (!prompt || typeof prompt !== "string") {
    res.status(400).json({ error: "prompt is required and must be a string" });
    return;
  }

  if (prompt.length > 10_000) {
    res.status(400).json({ error: "prompt too long (max 10000 chars)" });
    return;
  }

  const job = await aiQueue.add("ask", { prompt, messages });
  res.status(202).json({ jobId: job.id, status: "queued" });
});

// GET /api/job/:id — poll kết quả
router.get("/job/:id", async (req, res) => {
  const job = await aiQueue.getJob(req.params.id);

  if (!job) {
    res.status(404).json({ error: "Job not found" });
    return;
  }

  const state = await job.getState();

  if (state === "completed") {
    const result = job.returnvalue as AiJobResult;
    res.json({ status: "completed", result });
    return;
  }

  if (state === "failed") {
    res.status(500).json({ status: "failed", reason: job.failedReason });
    return;
  }

  res.json({ status: state });
});

export default router;
