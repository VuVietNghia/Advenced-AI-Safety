import pino from "pino";
import path from "path";
import fs from "fs";

// Đảm bảo folder logs/ tồn tại
const logDir = path.resolve(process.cwd(), "logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const errorLogPath = path.join(logDir, "error.log");

// Pino multistream: stdout (all levels) + file (error only)
export const logger = pino({
  level: "info",
  transport: {
    targets: [
      {
        target: "pino-pretty",
        level: "info",
        options: { colorize: true },
      },
      {
        target: "pino/file",
        level: "error",
        options: { destination: errorLogPath },
      },
    ],
  },
});
