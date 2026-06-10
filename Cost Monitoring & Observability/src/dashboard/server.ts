import express from "express";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { settings } from "../config/settings.js";
import { apiRouter } from "./api.js";
import { logger } from "../storage/logger.js";

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "public");

app.use(express.json({ limit: "1mb" }));
app.use("/api", apiRouter);
app.use(express.static(publicDir));

app.get("*", (_req, res) => {
  res.sendFile(join(publicDir, "index.html"));
});

app.listen(settings.DASHBOARD_PORT, () => {
  logger.info(`Dashboard running at http://localhost:${settings.DASHBOARD_PORT}`);
});
